import { Resend } from "resend";
import { SITE } from "./constants";

let _resend: Resend | null = null;
function client() {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  _resend = new Resend(key);
  return _resend;
}

const FROM = process.env.EMAIL_FROM || `Get Lucky Golf Club <forms@getluckygolf.co.za>`;
const NOTIFY_TO = process.env.EMAIL_NOTIFY_TO || SITE.email;
const REPLY_TO = process.env.EMAIL_REPLY_TO || SITE.email;

type SubmissionType = "partner" | "corporate" | "charity" | "school" | "simulator" | "agency" | "tour" | "voucher";

const SUBJECT: Record<SubmissionType, string> = {
  partner: "New Partner Course Enquiry",
  corporate: "New Corporate Golf Day Enquiry",
  charity: "New Charity Golf Day Enquiry",
  school: "New School Fundraising Day Enquiry",
  simulator: "New Golf Simulator Enquiry",
  agency: "New Agency Partnership Enquiry",
  tour: "New Golf Tour Operator Enquiry",
  voucher: "New Swing Voucher Purchase",
};

export async function sendSubmissionNotification(
  type: SubmissionType,
  fields: Record<string, string | number | boolean | null | undefined>,
) {
  const rows = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#335231;vertical-align:top;white-space:nowrap">${escape(k)}</td><td style="padding:6px 0;color:#1a1a1a">${escape(String(v))}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="font-family:Inter,system-ui,sans-serif;background:#f5f0e1;padding:24px;color:#1a1a1a">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e8e0cc">
      <h1 style="margin:0 0 4px;color:#335231;font-size:20px">${SUBJECT[type]}</h1>
      <p style="margin:0 0 20px;color:#6b7280;font-size:13px">Submitted via getluckygolf.co.za</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">${rows}</table>
    </div>
  </body></html>`;

  const result = await client().emails.send({
    from: FROM,
    to: NOTIFY_TO,
    replyTo: REPLY_TO,
    subject: SUBJECT[type],
    html,
  });
  if (result.error) {
    throw new Error(`Resend: ${result.error.message || JSON.stringify(result.error)}`);
  }
  return result;
}

export async function sendVoucherConfirmation(opts: {
  to: string;
  recipientName: string;
  tierLabel: string;
  prize: string;
  course: string;
  reference: string;
  amount: number;
}) {
  const html = `<!doctype html><html><body style="font-family:Inter,system-ui,sans-serif;background:#f5f0e1;padding:24px;color:#1a1a1a">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #e8e0cc">
      <h1 style="margin:0 0 8px;color:#335231;font-size:24px">Your ${opts.tierLabel} is ready 🏌️</h1>
      <p style="margin:0 0 20px;color:#1a1a1a;font-size:15px">Hi ${escape(opts.recipientName)}, your swing voucher is confirmed.</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;background:#f5f0e1;border-radius:8px;padding:16px">
        <tr><td style="padding:8px 12px;font-weight:600;color:#335231">Course</td><td style="padding:8px 12px">${escape(opts.course)}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#335231">Prize</td><td style="padding:8px 12px;color:#c9a94e;font-weight:700">${escape(opts.prize)}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#335231">Amount paid</td><td style="padding:8px 12px">R${opts.amount}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#335231">Reference</td><td style="padding:8px 12px;font-family:monospace">${escape(opts.reference)}</td></tr>
      </table>
      <p style="margin:24px 0 0;color:#6b7280;font-size:13px">Show this email at your course pro shop to play the challenge. Insured by Indwe Risk Services (FSP 3425).</p>
    </div>
  </body></html>`;

  const result = await client().emails.send({
    from: FROM,
    to: opts.to,
    replyTo: REPLY_TO,
    subject: `Your Get Lucky ${opts.tierLabel} — ${opts.course}`,
    html,
  });
  if (result.error) {
    throw new Error(`Resend: ${result.error.message || JSON.stringify(result.error)}`);
  }
  return result;
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Ops alert — for the failures nobody is watching a screen for.
 *
 * Aug 2026: PayFast ITNs started failing signature verification and the notify
 * route answered 400 and logged a console warning nobody reads. Three weeks and
 * ~30 entries later it was still failing. Anything on the money path that fails
 * silently must send one of these.
 *
 * Deliberately fire-and-forget: it never throws and never blocks the caller's
 * own error handling. Uses the Resend REST API directly (same as the health
 * canary) so it works even if the SDK client can't be constructed.
 */
export async function sendOpsAlert(opts: {
  subject: string;
  heading: string;
  detail: Record<string, string | number | boolean | null | undefined>;
  body?: string;
}): Promise<boolean> {
  try {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.error("Ops alert not sent — RESEND_API_KEY not set", opts.subject);
      return false;
    }
    const to = process.env.OPS_ALERT_EMAIL || NOTIFY_TO;

    const rows = Object.entries(opts.detail)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(
        ([k, v]) =>
          `<tr style="border-top:1px solid #e5e5e5"><td style="padding:6px 12px 6px 0;font-weight:600;white-space:nowrap">${escape(k)}</td><td style="padding:6px 0;font-family:monospace;color:#444">${escape(String(v))}</td></tr>`,
      )
      .join("");

    const html = `<div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto">
      <h2 style="color:#b91c1c;margin:0 0 8px">${escape(opts.heading)}</h2>
      ${opts.body ? `<p style="font-size:14px;color:#333">${escape(opts.body)}</p>` : ""}
      <table style="border-collapse:collapse;width:100%;font-size:13px">${rows}</table>
      <p style="color:#666;font-size:12px;margin-top:20px">getluckygolf.co.za · ${new Date().toISOString()}</p>
    </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Get Lucky Ops <ops@getluckygolfclub.com>",
        to,
        subject: opts.subject,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("Ops alert send failed", { status: res.status, subject: opts.subject });
      return false;
    }
    return true;
  } catch (err) {
    console.error("Ops alert send threw", err);
    return false;
  }
}
