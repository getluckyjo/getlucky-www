import { NextRequest, NextResponse } from "next/server";
import { partnerSchema } from "@/lib/validation";
import { sendSubmissionNotification } from "@/lib/email";
import { isDbConfigured, insertLead } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = partnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const timestamp = new Date().toISOString();
  const submission = {
    Timestamp: timestamp,
    "Full Name": data.fullName,
    Email: data.email,
    Mobile: data.mobile,
    "Golf Course": data.golfCourse || "",
    Message: data.message || "",
    Source: "getluckygolf.co.za /become-a-partner",
  };

  // Postgres is the durable lead store; Sheets/email are the mirror + alert.
  // Fail-soft: a DB hiccup must not lose the enquiry while Sheets still records it.
  let recordedInDb = false;
  if (isDbConfigured()) {
    try {
      await insertLead({
        type: "partner",
        full_name: data.fullName,
        email: data.email,
        mobile: data.mobile,
        message: data.message || null,
        source: submission.Source,
        consent_communication: data.consentCommunication,
        data: { golf_course: data.golfCourse || "" },
      });
      recordedInDb = true;
    } catch (err) {
      console.error("Partner lead DB write failed", err);
    }
  }

  // The email is an alert, not a record — Postgres is the record. It fails
  // soft on its own so a Resend hiccup cannot lose an enquiry already stored.
  const emailed = await sendSubmissionNotification("partner", submission).then(
    () => true,
    (err) => {
      console.error("Partner notification email failed", err);
      return false;
    },
  );

  // Only now is the enquiry genuinely lost: nothing stored it and nobody was
  // told. This was the same test with the Sheet in place of the DB, and the
  // DB is the more durable of the two.
  if (!recordedInDb && !emailed) {
    console.error("Partner submission not recorded and not emailed");
    return NextResponse.json(
      { error: "We couldn't record your enquiry. Please try again or email us directly." },
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
