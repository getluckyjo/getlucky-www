import { NextResponse } from "next/server";
import { signFields } from "@/lib/payfast";

/**
 * Daily PayFast + backend health check.
 *
 * Triggered by Vercel Cron (see vercel.json). Runs a fixed-payload signature
 * roundtrip — the resulting MD5 is a canary across all three apps that share
 * this PayFast merchant. If the same TEST_FIELDS produce different MD5s in
 * different apps, something drifted (passphrase, encoder, merchant id/key).
 *
 * On failure: sends an email to OPS_ALERT_EMAIL. Returns 503 with the failure
 * list so the Claude daily routine can aggregate across all three apps.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OPS_ALERT_EMAIL = process.env.OPS_ALERT_EMAIL || "johannes@getluckygolfclub.com";

// Fixed payload — must be identical to the corresponding TEST_FIELDS in
// website and subscriptions health endpoints. Apostrophe + parens are
// deliberate (catches encoder regressions like the one fixed 2026-05-15).
//
// Field ORDER matters. www's signFields iterates object insertion order,
// so this insertion order must match website's FIELD_ORDER array for the
// three apps to produce identical canary MD5s.
const TEST_FIELDS: Record<string, string> = {
  merchant_id: "__placeholder__",
  merchant_key: "__placeholder__",
  name_first: "Liam",
  name_last: "O'Brien",
  email_address: "health@getluckygolfclub.com",
  m_payment_id: "HEALTH-CHECK-FIXED-2026",
  amount: "149.00",
  item_name: "Health check (O'Brien)",
};

interface Check {
  name: string;
  ok: boolean;
  detail?: string;
}

export async function GET() {
  // Public read-only endpoint. Vercel Cron and the Claude daily routine both
  // hit it without auth. The only side effect on failure is an alert email
  // to OPS_ALERT_EMAIL, which we WANT on every failed state.
  const checks: Check[] = [];

  // 1. Env vars present
  const requiredEnv = [
    "PAYFAST_MERCHANT_ID",
    "PAYFAST_MERCHANT_KEY",
    "PAYFAST_PASSPHRASE",
    "PAYFAST_MODE",
    "RESEND_API_KEY",
    "SHEETS_WEBAPP_URL",
    "SHEETS_SECRET",
    "NEXT_PUBLIC_SITE_URL",
  ];
  const missing = requiredEnv.filter((k) => !process.env[k]);
  checks.push({
    name: "env_vars",
    ok: missing.length === 0,
    detail: missing.length ? `missing: ${missing.join(", ")}` : "all present",
  });

  // 2. Signature roundtrip canary
  let canaryMd5 = "";
  try {
    const fields = {
      ...TEST_FIELDS,
      merchant_id: process.env.PAYFAST_MERCHANT_ID || "",
      merchant_key: process.env.PAYFAST_MERCHANT_KEY || "",
    };
    canaryMd5 = signFields(fields);
    checks.push({ name: "signature_canary", ok: !!canaryMd5, detail: canaryMd5 });
  } catch (err) {
    checks.push({
      name: "signature_canary",
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  // 3. Sheets web app reachable (HEAD to the Apps Script URL)
  try {
    const url = process.env.SHEETS_WEBAPP_URL;
    if (!url) throw new Error("SHEETS_WEBAPP_URL not set");
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    checks.push({
      name: "sheets_reachable",
      ok: res.status < 500,
      detail: `HTTP ${res.status}`,
    });
  } catch (err) {
    checks.push({
      name: "sheets_reachable",
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  // 4. PayFast endpoint reachable
  try {
    const baseUrl =
      process.env.PAYFAST_MODE === "live"
        ? "https://www.payfast.co.za"
        : "https://sandbox.payfast.co.za";
    const res = await fetch(`${baseUrl}/eng/query/validate`, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    checks.push({
      name: "payfast_reachable",
      ok: res.status < 500,
      detail: `HTTP ${res.status}`,
    });
  } catch (err) {
    checks.push({
      name: "payfast_reachable",
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    });
  }

  const allOk = checks.every((c) => c.ok);
  const summary = {
    ok: allOk,
    app: "www",
    domain: "getluckygolf.co.za",
    ts: new Date().toISOString(),
    canary_md5: canaryMd5,
    checks,
  };

  if (!allOk) {
    await sendAlert(summary).catch((err) =>
      console.error("Health alert email failed:", err)
    );
  }

  return NextResponse.json(summary, { status: allOk ? 200 : 503 });
}

async function sendAlert(summary: Record<string, unknown>) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const failures = (summary.checks as Check[]).filter((c) => !c.ok);
  const body = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #b91c1c;">PayFast Health Check Failed — www</h2>
      <p>Daily backend check found <strong>${failures.length}</strong> failing check(s) on <code>${summary.domain}</code>.</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead><tr style="background: #f5f5f5;"><th style="padding: 8px; text-align: left;">Check</th><th style="padding: 8px; text-align: left;">Status</th><th style="padding: 8px; text-align: left;">Detail</th></tr></thead>
        <tbody>
        ${(summary.checks as Check[])
          .map(
            (c) =>
              `<tr style="border-top: 1px solid #e5e5e5;"><td style="padding: 8px;">${c.name}</td><td style="padding: 8px;">${c.ok ? "✓" : "✗"}</td><td style="padding: 8px; font-family: monospace; color: #666;">${c.detail || ""}</td></tr>`
          )
          .join("")}
        </tbody>
      </table>
      <p style="color: #666; font-size: 12px; margin-top: 24px;">Timestamp: ${summary.ts}<br>Canary MD5: <code>${summary.canary_md5}</code></p>
    </div>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Get Lucky Ops <ops@getluckygolfclub.com>",
      to: OPS_ALERT_EMAIL,
      subject: `[ALERT] www backend check failed (${failures.length} issue${failures.length === 1 ? "" : "s"})`,
      html: body,
    }),
  });
}
