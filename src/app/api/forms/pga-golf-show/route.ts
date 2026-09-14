import { NextRequest, NextResponse } from "next/server";
import { pgaGolfShowEntrySchema } from "@/lib/validation";
import { PGA_GOLF_SHOW } from "@/lib/constants";
import { appendSubmission } from "@/lib/sheets";
import { isDbConfigured, insertLead } from "@/lib/db";
import { notifyWhatsAppChannel } from "@/lib/whatsapp";

export const runtime = "nodejs";

/**
 * /api/forms/pga-golf-show — the simulator entry at the PGA Golf & Lifestyle
 * Show. Same shape as the sponsored free entry: no payment, recorded as a
 * `free_entry` lead and on the freeEntry sheet tab, so the Indwe feed and the
 * ops scorecard pick it up without a new lead type. The show is the "course".
 *
 * The WhatsApp handoff fires on submission, the same as /form-2 — there is no
 * payment step, so submitting is entering.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = pgaGolfShowEntrySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    // Field names only, never values — see the free entry route for why.
    console.warn("PGA Golf Show entry form rejected", { fields: Object.keys(fieldErrors) });
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: flattenErrors(fieldErrors),
      },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const timestamp = new Date().toISOString();

  const sheetRow = {
    Timestamp: timestamp,
    Name: d.name,
    Email: "",
    Mobile: d.mobile,
    Course: PGA_GOLF_SHOW.course,
    Event: PGA_GOLF_SHOW.event,
    Source: PGA_GOLF_SHOW.source,
  };

  // Postgres is the durable lead store; Sheets is the mirror. Fail-soft so a DB
  // hiccup does not block the entry while Sheets still records it.
  if (isDbConfigured()) {
    try {
      await insertLead({
        type: "free_entry",
        full_name: d.name,
        email: null,
        mobile: d.mobile,
        source: PGA_GOLF_SHOW.source,
        // consent_communication is left unset: the question was not asked.
        data: {
          course: PGA_GOLF_SHOW.course,
          event: PGA_GOLF_SHOW.event,
          // Optional, and the golfer's word rather than a verified follow —
          // Instagram has no API that would let us check.
          instagram_follow: d.instagramFollow,
          consent_whatsapp: d.consentWhatsApp,
        },
      });
    } catch (err) {
      console.error("PGA Golf Show lead DB write failed", err);
    }
  }

  // Handed over after the entry is recorded, and never allowed to fail the
  // entry itself. Only opted-in golfers are messaged; the rest are recorded.
  await notifyWhatsAppChannel({
    name: d.name,
    mobile: d.mobile,
    course: PGA_GOLF_SHOW.course,
    whatsappOptIn: d.consentWhatsApp,
  });

  try {
    await appendSubmission("freeEntry", sheetRow);
  } catch (err) {
    console.error("PGA Golf Show sheet append failed", err);
    return NextResponse.json(
      { error: "We couldn't record your entry. Please try again or speak to someone at the stand." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

function flattenErrors(fe: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fe)) if (v?.[0]) out[k] = v[0];
  return out;
}
