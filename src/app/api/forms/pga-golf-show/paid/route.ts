import { NextRequest, NextResponse } from "next/server";
import { pgaGolfShowEntrySchema } from "@/lib/validation";
import { PGA_GOLF_SHOW, ROUTES } from "@/lib/constants";
import { appendSubmission } from "@/lib/sheets";
import { isDbConfigured, createEntry } from "@/lib/db";
import { buildPaymentRequest, processUrl } from "@/lib/payfast";
import { CONSENT_FORM_VERSION } from "@/lib/whatsapp";

export const runtime = "nodejs";

/**
 * /api/forms/pga-golf-show/paid — the R100 option at the bottom of the show
 * form: R100 for a shot at R100,000 on the same simulator, beside the free
 * shot at R25,000.
 *
 * It takes the same body as the free entry (name, mobile, the optional
 * Instagram tap and the optional WhatsApp box) and adds nothing: the price
 * and the prize are server-side constants (PGA_GOLF_SHOW.paidEntry), never a
 * number the browser sends. A client that could name its own amount could
 * buy a R100,000 shot for a rand.
 *
 * Unlike the free entry this writes a paid **entry** row with a `GLE-`
 * reference, not a `free_entry` lead — that prefix is what routes the PayFast
 * notification to the entry tab (see tabForReference in /api/payfast/notify),
 * and it is what marks the row paid, backfills the name and email PayFast
 * collects at checkout, and hands the golfer to the WhatsApp channel once the
 * money has actually arrived. Submitting is not entering; paying is.
 *
 * `course` is PGA_GOLF_SHOW.course, so a paid show entrant gets the show's
 * WhatsApp journey exactly like a free one — see docs/pga-golf-show.md.
 *
 * One thing the free path records and this one does not: the Instagram tap.
 * The entries table has no JSON column to hang it on and this is not worth a
 * migration — the tap is recorded for every free entry, which is the number
 * the stand actually watches.
 */
export async function POST(req: NextRequest) {
  // Same Sheets guard as /api/forms/entry — don't accept money we can't record.
  if (!process.env.SHEETS_WEBAPP_URL || !process.env.SHEETS_SECRET) {
    return NextResponse.json(
      {
        error:
          "Paid entries are temporarily offline. Take the free shot above, or ask someone at the stand.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = pgaGolfShowEntrySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    // Field names only, never values — see the paid entry route for why.
    console.warn("PGA Golf Show paid entry rejected", { fields: Object.keys(fieldErrors) });
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: flattenErrors(fieldErrors),
      },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const paid = PGA_GOLF_SHOW.paidEntry;
  const reference = makeReference();
  const now = new Date();
  const timestamp = now.toISOString();
  const entryDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const sheetRow = {
    Timestamp: timestamp,
    Reference: reference,
    Status: "pending",
    Date: entryDate,
    Tier: paid.label,
    Amount: paid.amount,
    Prize: paid.prize,
    Course: PGA_GOLF_SHOW.course,
    // The show form asks for a name, so unlike /form this row carries one from
    // the start. Email stays blank until PayFast returns it.
    Name: d.name,
    Email: "",
    Mobile: d.mobile,
    Source: PGA_GOLF_SHOW.source,
    "PayFast PaymentID": "",
  };

  // Postgres is the durable system-of-record. Write it first and fail closed:
  // if we can't record the pending row, don't take the payment.
  if (isDbConfigured()) {
    try {
      await createEntry({
        reference,
        status: "pending",
        entry_date: entryDate,
        tier: paid.label,
        amount: paid.amount,
        prize: paid.prize,
        course: PGA_GOLF_SHOW.course,
        name: d.name,
        email: null,
        mobile: d.mobile,
        source: PGA_GOLF_SHOW.source,
        // Recorded here, acted on at payment: the WhatsApp handoff runs in
        // /api/payfast/notify once the money has arrived, and by then the tick
        // is only knowable if we stored it.
        consent_whatsapp: d.consentWhatsApp,
        consent_form_version: CONSENT_FORM_VERSION,
      });
    } catch (err) {
      console.error("PGA Golf Show paid entry DB write failed", err);
      return NextResponse.json(
        {
          error:
            "We couldn't record your entry just now. Please try again in a moment, or ask someone at the stand.",
        },
        { status: 503 },
      );
    }
  }

  // Fail closed here too — the env-var guard above only proves the env is set.
  try {
    await appendSubmission("entry", sheetRow);
  } catch (err) {
    console.error("PGA Golf Show paid entry pending row failed", err);
    return NextResponse.json(
      {
        error:
          "We couldn't record your entry just now. Please try again in a moment, or ask someone at the stand.",
      },
      { status: 503 },
    );
  }

  let fields: Record<string, string>;
  try {
    fields = buildPaymentRequest({
      amount: paid.amount,
      itemName: `${paid.label} — Get Lucky Hole-in-One Challenge`,
      itemDescription: `Simulator entry at the ${PGA_GOLF_SHOW.name} on ${entryDate}, win ${paid.prize}`,
      reference,
      buyerName: d.name,
      // Not asked on the show form — PayFast collects it at checkout and
      // returns it in the notification, which is where it enters our records.
      buyerEmail: "",
      buyerMobile: d.mobile,
      customStr1: PGA_GOLF_SHOW.course,
      customStr2: `entry:${entryDate}`,
      returnPath: ROUTES.pgaGolfShowSuccess,
      cancelPath: ROUTES.pgaGolfShowCancel,
    });
  } catch (err) {
    console.error("PGA Golf Show PayFast build failed", err);
    return NextResponse.json(
      { error: "Payment is not configured yet. Please try again shortly." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    reference,
    processUrl: processUrl(),
    fields,
  });
}

/** `GLE-` so /api/payfast/notify files it on the entry tab. */
function makeReference() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `GLE-${ts}-${rand}`;
}

function flattenErrors(fe: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fe)) if (v?.[0]) out[k] = v[0];
  return out;
}
