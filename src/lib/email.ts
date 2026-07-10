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
