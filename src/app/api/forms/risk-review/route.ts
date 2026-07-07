/**
 * /api/forms/risk-review
 *
 * Receives risk-review form submissions from the Indwe sponsor microsite
 * (indwemicrosite.vercel.app) and writes them into the central Sheets
 * pipeline so they flow through /api/indwe/leads alongside the other lead
 * types. The microsite keeps writing to its own Apps Script as a backup,
 * so this endpoint is fail-soft from the user's perspective.
 *
 * CORS: allows POST from indwemicrosite.vercel.app (and any *.vercel.app
 * preview of the microsite project). Reject everything else.
 */

import { NextRequest, NextResponse } from "next/server";
import { riskReviewSchema } from "@/lib/validation";
import { appendSubmission } from "@/lib/sheets";
import { isDbConfigured, insertLead } from "@/lib/db";

export const runtime = "nodejs";

const ALLOWED_ORIGIN_PATTERNS: RegExp[] = [
  /^https:\/\/indwemicrosite\.vercel\.app$/,
  /^https:\/\/microsite-[a-z0-9-]+-get-lucky-golf-club\.vercel\.app$/,
  /^https:\/\/microsite-dusky\.vercel\.app$/,
];

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin));
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : "https://indwemicrosite.vercel.app",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: corsHeaders(origin) });
  }

  const parsed = riskReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors),
      },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  const data = parsed.data;
  const timestamp = new Date().toISOString();
  const sheetRow = {
    Timestamp: timestamp,
    "Full Name": data.fullName,
    Email: data.email,
    Mobile: data.mobile,
    "Schedule File": data.scheduleFile || "",
    Consent: data.consent ? "Yes" : "No",
    // Every microsite submission is by definition a hot intent signal —
    // someone clicked through the sponsor mailer/banner specifically to
    // request a risk review. Requesting the review is an explicit quote
    // action, so it's tagged Quote-Ready (see docs/indwe/lead-tagging.md).
    // Stored here for human-readability in the Sheet; the Indwe API derives
    // the same tag by type regardless.
    "Lead Stage": "Quote-Ready Lead",
    Source: data.source || "indwe-microsite",
  };

  // Postgres is the durable lead store; Sheets is the mirror. Fail-soft — the
  // microsite also writes to its own Apps Script as a backup.
  if (isDbConfigured()) {
    try {
      await insertLead({
        type: "risk_review",
        full_name: data.fullName,
        email: data.email,
        mobile: data.mobile,
        source: sheetRow.Source,
        consent_communication: data.consent ?? false,
        data: {
          schedule_file: data.scheduleFile || "",
          lead_stage: sheetRow["Lead Stage"],
        },
      });
    } catch (err) {
      console.error("Risk-review lead DB write failed", err);
    }
  }

  try {
    await appendSubmission("riskReview", sheetRow);
  } catch (err) {
    console.error("Risk-review submission failed:", err);
    return NextResponse.json(
      { error: "We couldn't record your request. Please try again." },
      { status: 500, headers: corsHeaders(origin) },
    );
  }

  return NextResponse.json({ ok: true }, { headers: corsHeaders(origin) });
}

function flattenErrors(fe: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fe)) if (v?.[0]) out[k] = v[0];
  return out;
}
