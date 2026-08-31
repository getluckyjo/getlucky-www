import { NextRequest, NextResponse } from "next/server";
import { entrySchema } from "@/lib/validation";
import { appendSubmission } from "@/lib/sheets";
import { isDbConfigured, createEntry } from "@/lib/db";
import { buildPaymentRequest, processUrl } from "@/lib/payfast";
import { PRIZE_TIERS } from "@/lib/constants";
import { CONSENT_FORM_VERSION } from "@/lib/whatsapp";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Same Sheets guard as /api/forms/voucher — don't accept money we can't record
  if (!process.env.SHEETS_WEBAPP_URL || !process.env.SHEETS_SECRET) {
    return NextResponse.json(
      {
        error:
          "Online entries are temporarily offline while we finish migrating to our new payment system. Please ask a marshal at the tee or email johannes@getluckygolfclub.com.",
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

  const parsed = entrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors),
      },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const tier = PRIZE_TIERS.find((t) => t.entryAmount === d.entryAmount);
  if (!tier) return NextResponse.json({ error: "Invalid entry amount" }, { status: 400 });

  const reference = makeReference();
  const now = new Date();
  const timestamp = now.toISOString();
  // Entry date is auto-captured (the form no longer asks). Use the request
  // wall-clock as the play date — accurate enough for QR-at-the-tee usage.
  const entryDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Flat "on-course" source: /form is the in-person/QR paid entry used at the
  // course. Recorded on the row so /api/indwe/leads reports the real source
  // instead of a read-time default. (Decision Jun 2026: no QR-vs-ambassador
  // split — one honest tag.)
  const source = "on-course";

  const sheetRow = {
    Timestamp: timestamp,
    Reference: reference,
    Status: "pending",
    Date: entryDate,
    Tier: tier.label,
    Amount: d.entryAmount,
    Prize: tier.prize,
    Course: d.course,
    // Filled in by /api/payfast/notify from the PayFast notification.
    Name: "",
    Email: "",
    Mobile: d.mobile,
    Source: source,
    "PayFast PaymentID": "",
  };

  // Postgres is the durable system-of-record (Sheets is now a mirror). Write it
  // first and fail closed: if we can't record the pending row, don't take the
  // payment. Skipped entirely until Supabase is configured, so the Sheets-only
  // flow keeps working during rollout.
  if (isDbConfigured()) {
    try {
      await createEntry({
        reference,
        status: "pending",
        entry_date: entryDate,
        tier: tier.label,
        amount: d.entryAmount,
        prize: tier.prize,
        course: d.course,
        // Not asked on this form. Backfilled at payment from the PayFast
        // notification, which carries name_first, name_last and email_address.
        name: null,
        email: null,
        mobile: d.mobile,
        source,
        // Recorded here, acted on at payment. The handoff to the WhatsApp
        // channel happens in /api/payfast/notify once the money has actually
        // arrived, and by then the tick is only knowable if we stored it.
        consent_whatsapp: d.consentWhatsApp,
        consent_form_version: CONSENT_FORM_VERSION,
      });
    } catch (err) {
      console.error("Entry DB write failed", err);
      return NextResponse.json(
        {
          error:
            "We couldn't record your entry just now. Please try again in a moment, or ask a marshal at the tee.",
        },
        { status: 503 },
      );
    }
  }

  // The WhatsApp handoff deliberately does NOT happen here.
  //
  // It used to, and it fired on form submission — above the PayFast redirect,
  // before a cent had moved. A golfer who opened the card page and walked away
  // was still handed over as an entrant and still chased by the follow-up cron:
  // a marketing message to somebody who never paid, on an account Meta has
  // restricted once already. Submitting is not entering.
  //
  // It now runs in /api/payfast/notify, inside the gate that fires exactly once
  // per entry however many times PayFast resends. /form-2 is unchanged — it has
  // no payment step, so there submission genuinely is the moment.

  // Fail closed: if we can't record the pending row, don't take the payment.
  // The env-var guard above only proves the env is set, not that Sheets is up.
  try {
    await appendSubmission("entry", sheetRow);
  } catch (err) {
    console.error("Entry pending row failed", err);
    return NextResponse.json(
      {
        error:
          "We couldn't record your entry just now. Please try again in a moment, or ask a marshal at the tee.",
      },
      { status: 503 },
    );
  }

  let fields: Record<string, string>;
  try {
    fields = buildPaymentRequest({
      amount: d.entryAmount,
      itemName: `${tier.label} — Get Lucky Hole-in-One Challenge`,
      itemDescription: `Course entry for ${d.course} on ${entryDate}, win ${tier.prize}`,
      reference,
      // Left blank on purpose: PayFast prompts for them on its own checkout,
      // which is a page the golfer is already on.
      buyerName: "",
      buyerEmail: "",
      buyerMobile: d.mobile,
      customStr1: d.course,
      customStr2: `entry:${entryDate}`,
      returnPath: "/form/success",
      cancelPath: "/form/cancel",
    });
  } catch (err) {
    console.error("PayFast build failed", err);
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
