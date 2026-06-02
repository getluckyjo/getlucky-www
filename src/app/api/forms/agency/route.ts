import { NextRequest, NextResponse } from "next/server";
import { agencySchema } from "@/lib/validation";
import { appendSubmission } from "@/lib/sheets";
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

  const parsed = agencySchema.safeParse(body);
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
  const sheetRow = {
    Timestamp: timestamp,
    "Full Name": data.fullName,
    Email: data.email,
    Mobile: data.mobile,
    Company: data.companyName,
    Industry: data.industry || "",
    "Budget Range": data.budgetRange || "",
    Message: data.message || "",
    Source: "getluckygolf.co.za /agency",
  };

  // Postgres is the durable lead store; Sheets/email are the mirror + alert.
  if (isDbConfigured()) {
    try {
      await insertLead({
        type: "agency",
        full_name: data.fullName,
        email: data.email,
        mobile: data.mobile,
        company: data.companyName,
        message: data.message || null,
        source: sheetRow.Source,
        consent_communication: data.consentCommunication,
        data: { industry: data.industry || "", budget_range: data.budgetRange || "" },
      });
    } catch (err) {
      console.error("Agency lead DB write failed", err);
    }
  }

  const tasks = await Promise.allSettled([
    appendSubmission("agency", sheetRow),
    sendSubmissionNotification("agency", sheetRow),
  ]);

  const failures = tasks.filter((t) => t.status === "rejected");
  if (failures.length === tasks.length) {
    console.error("Agency submission both failed", failures);
    return NextResponse.json(
      { error: "We couldn't record your enquiry. Please try again or email us directly." },
      { status: 500 },
    );
  }
  if (failures.length > 0) {
    console.warn("Agency submission partial failure", failures);
  }

  return NextResponse.json({ ok: true });
}

function flattenErrors(fe: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fe)) if (v?.[0]) out[k] = v[0];
  return out;
}
