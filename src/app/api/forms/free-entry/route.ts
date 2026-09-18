import { NextRequest, NextResponse } from "next/server";
import { freeEntrySchema } from "@/lib/validation";
import { isDbConfigured, insertLead } from "@/lib/db";
import { notifyWhatsAppChannel } from "@/lib/whatsapp";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = freeEntrySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    // Field names only, never values.
    //
    // On 1 Sep 2026 two entries were rejected here a minute apart, interleaved
    // with PayFast notifications from what looked like the same golfer, and
    // afterwards there was no way to tell which field had failed — nothing was
    // written down. This is the door money comes through: an ordinary mistyped
    // number and a validator rejecting something golfers legitimately type look
    // identical from outside, and only one of them is our problem.
    //
    // The form sets noValidate, so the browser does not block an incomplete
    // submit and a 400 here is a normal thing to see. It is the *pattern* that
    // matters — the same field failing repeatedly is a bug, a spread of fields
    // is people being people. Values are personal data and stay out of the log.
    console.warn("Free entry form rejected", { fields: Object.keys(fieldErrors) });
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

  const submission = {
    Timestamp: timestamp,
    Name: d.name,
    Email: d.email || "",
    Mobile: d.mobile,
    Course: d.course || "",
    Event: d.event || "",
    Source: "getluckygolf.co.za /form-2",
  };

  // Postgres is the store. The Sheets mirror that used to stand behind it is
  // gone, so a failed write here is a lost entry and the route says so below.
  let recordedInDb = false;
  if (isDbConfigured()) {
    try {
      await insertLead({
        type: "free_entry",
        full_name: d.name,
        email: d.email || null,
        mobile: d.mobile,
        source: submission.Source,
        // consent_communication is left unset rather than false. This form no
        // longer asks the general communication question, and recording a false
        // would assert the golfer declined something they were never shown.
        // Null reads as "not asked", which is what happened.
        data: { course: d.course || "", event: d.event || "" },
      });
      recordedInDb = true;
    } catch (err) {
      console.error("Free entry lead DB write failed", err);
    }
  }

  // Checked before the handoff, not after: there is no point messaging somebody
  // about an entry we failed to record, and they are about to be told to retry.
  if (!recordedInDb) {
    return NextResponse.json(
      { error: "We couldn't record your entry. Please try again or speak to a marshal." },
      { status: 500 },
    );
  }

  // See the paid entry route: handed over after the entry is recorded, and never
  // allowed to fail the entry itself.
  await notifyWhatsAppChannel({
    name: d.name,
    mobile: d.mobile,
    email: d.email,
    course: d.course,
    whatsappOptIn: d.consentWhatsApp,
  });

  return NextResponse.json({ ok: true });
}

function flattenErrors(fe: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fe)) if (v?.[0]) out[k] = v[0];
  return out;
}
