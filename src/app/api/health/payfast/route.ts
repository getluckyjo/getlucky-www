import { NextResponse } from "next/server";
import { signFields } from "@/lib/payfast";
import { isDbConfigured, getEntryPaymentHealth } from "@/lib/db";
import { readSubmissions } from "@/lib/sheets";

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
 *
 * It also answers the only question that actually matters: is entry money still
 * arriving? Every check above passed green through the whole of August 2026
 * while every single PayFast ITN was being rejected and ~30 paid entries sat
 * `pending`. Reachability and a stable MD5 do not prove the money path works —
 * only "entries are being marked paid" does — see the money-path checks below.
 */

/**
 * Window for the money-path checks.
 *
 * PAID_WINDOW_DAYS: if entries were created in this window and NOT ONE was
 * marked paid, the payment path is broken. Three days is short enough to catch
 * a break the same week and long enough to survive a quiet Monday at the tee.
 *
 * STUCK_PENDING_HOURS: a golfer pays within a minute of submitting. A row still
 * `pending` after this long either never paid or — the dangerous case — paid
 * into an ITN we failed to record.
 *
 * STUCK_PENDING_WINDOW_HOURS: how far back the stuck count reaches. This bound
 * is the whole point of the check. An abandoned checkout stays `pending` for
 * ever, so an unbounded count only ever grows: by 31 Aug 2026 it stood at 163
 * and had been failing this endpoint every single day since the check was
 * added on 19 August. A signal that is always red is a signal nobody reads —
 * which is precisely how the July–August ITN outage ran for nineteen days.
 *
 * Bounded, the check answers the question actually worth waking someone for:
 * is a pile of unpaid entries building up *right now*. The cumulative figure
 * is still reported, as `pending_backlog`, but it never alarms.
 */
const PAID_WINDOW_DAYS = 3;
const STUCK_PENDING_HOURS = 24;
const STUCK_PENDING_WINDOW_HOURS = 72;
const STUCK_PENDING_ALERT_THRESHOLD = 3;

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

  // 3. The Sheet can actually be used, not merely reached.
  //
  // This was an unauthenticated HEAD passing on `status < 500`, which meant the
  // 403 an Apps Script returns to an anonymous HEAD counted as healthy — and it
  // read green on 31 Aug 2026 while proving nothing. It would also have read
  // green with the wrong secret, a revoked deployment, or a script throwing on
  // every call, because none of those change the status of a HEAD.
  //
  // That is the same mistake this endpoint was rewritten to stop making: the
  // canary measured whether PayFast was reachable and whether an MD5 computed,
  // both true throughout the three weeks every ITN was being rejected.
  //
  // The question worth asking is not "does the host answer" but "would an entry
  // be written right now" — /api/forms/entry fails closed on Sheets and returns
  // 503 to the golfer if appendSubmission throws. So this calls the real thing:
  // real URL, real secret, redirects followed, and both a non-2xx and a
  // script-level error thrown rather than swallowed. `since` is set to now so
  // the script has nothing to return and the check stays cheap.
  //
  // An empty result is a pass. We are testing the pipe, not its contents.
  try {
    const rows = await readSubmissions("entry", new Date().toISOString());
    checks.push({
      name: "sheets_working",
      ok: true,
      detail: `authenticated read OK (${rows.length} rows since now)`,
    });
  } catch (err) {
    checks.push({
      name: "sheets_working",
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

  // 5. The money path itself — are entries still being marked paid?
  if (!isDbConfigured()) {
    checks.push({
      name: "entry_payments_flowing",
      ok: true,
      detail: "skipped — SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set",
    });
  } else {
    const now = Date.now();
    const sinceISO = new Date(now - PAID_WINDOW_DAYS * 86400_000).toISOString();
    const stuckBeforeISO = new Date(now - STUCK_PENDING_HOURS * 3600_000).toISOString();
    const stuckAfterISO = new Date(now - STUCK_PENDING_WINDOW_HOURS * 3600_000).toISOString();
    try {
      const health = await getEntryPaymentHealth(sinceISO, stuckBeforeISO, stuckAfterISO);
      checks.push({
        name: "entry_payments_flowing",
        // Silence is only a failure if there was something to be paid for.
        ok: !(health.created > 0 && health.paid === 0),
        detail: `${health.paid} paid / ${health.created} created in the last ${PAID_WINDOW_DAYS}d`,
      });
      checks.push({
        name: "stuck_pending_entries",
        ok: health.stuckPending < STUCK_PENDING_ALERT_THRESHOLD,
        detail:
          `${health.stuckPending} entries created in the last ${STUCK_PENDING_WINDOW_HOURS}h ` +
          `and still pending after ${STUCK_PENDING_HOURS}h`,
      });
      // Never alarms. Reported so the cumulative figure stays visible without
      // holding the endpoint permanently red — most of it is ordinary
      // abandoned checkouts, which no one can act on.
      checks.push({
        name: "pending_backlog",
        ok: true,
        detail: `${health.pendingBacklog} entries pending in total (all time, informational)`,
      });
    } catch (err) {
      checks.push({
        name: "entry_payments_flowing",
        ok: false,
        detail: err instanceof Error ? err.message : String(err),
      });
    }
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
