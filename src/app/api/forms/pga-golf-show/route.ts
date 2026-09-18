import { NextRequest, NextResponse } from "next/server";
import { pgaGolfShowEntrySchema } from "@/lib/validation";
import { PGA_GOLF_SHOW } from "@/lib/constants";
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


  // Postgres is the store. The Sheets mirror that used to stand behind it is
  // gone, so a failed write here is a lost entry and the route says so below.
  let recordedInDb = false;
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
      recordedInDb = true;
    } catch (err) {
      console.error("PGA Golf Show lead DB write failed", err);
    }
  }

  // Checked before the handoff, not after: there is no point messaging somebody
  // about an entry we failed to record, and they are about to be told to retry.
  if (!recordedInDb) {
    return NextResponse.json(
      { error: "We couldn't record your entry. Please try again in a moment." },
      { status: 500 },
    );
  }

  // Handed over after the entry is recorded, and never allowed to fail the
  // entry itself. Only opted-in golfers are messaged; the rest are recorded.
  await notifyWhatsAppChannel({
    name: d.name,
    mobile: d.mobile,
    course: PGA_GOLF_SHOW.course,
    whatsappOptIn: d.consentWhatsApp,
  });

  return NextResponse.json({ ok: true });
}

function flattenErrors(fe: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fe)) if (v?.[0]) out[k] = v[0];
  return out;
}
