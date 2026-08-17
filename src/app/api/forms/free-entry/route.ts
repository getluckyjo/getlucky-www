import { NextRequest, NextResponse } from "next/server";
import { freeEntrySchema } from "@/lib/validation";
import { appendSubmission } from "@/lib/sheets";
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
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors),
      },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const timestamp = new Date().toISOString();

  const sheetRow = {
    Timestamp: timestamp,
    Name: d.name,
    Email: d.email || "",
    Mobile: d.mobile,
    Course: d.course || "",
    Event: d.event || "",
    Source: "getluckygolf.co.za /form-2",
  };

  // Postgres is the durable lead store; Sheets is the mirror. Fail-soft so a DB
  // hiccup doesn't block the free-entry capture while Sheets still records it.
  if (isDbConfigured()) {
    try {
      await insertLead({
        type: "free_entry",
        full_name: d.name,
        email: d.email || null,
        mobile: d.mobile,
        source: sheetRow.Source,
        // consent_communication is left unset rather than false. This form no
        // longer asks the general communication question, and recording a false
        // would assert the golfer declined something they were never shown.
        // Null reads as "not asked", which is what happened.
        data: { course: d.course || "", event: d.event || "" },
      });
    } catch (err) {
      console.error("Free entry lead DB write failed", err);
    }
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

  try {
    await appendSubmission("freeEntry", sheetRow);
  } catch (err) {
    console.error("Free entry sheet append failed", err);
    return NextResponse.json(
      { error: "We couldn't record your entry. Please try again or speak to a marshal." },
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
