/**
 * Sheets integration via a Google Apps Script Web App bound to the Sheet.
 * Avoids the GCP service account path entirely. The Apps Script runs as the
 * Sheet owner and exposes a single HTTPS endpoint protected by a shared secret.
 */

export type SubmissionType = "partner" | "corporate" | "agency" | "voucher" | "entry" | "freeEntry" | "riskReview";

const HEADERS: Record<SubmissionType, string[]> = {
  partner: [
    "Timestamp",
    "Full Name",
    "Email",
    "Mobile",
    "Golf Course",
    "Message",
    "Source",
  ],
  corporate: [
    "Timestamp",
    "Full Name",
    "Email",
    "Mobile",
    "Company",
    "Golf Course",
    "Golf Day Date",
    "Message",
    "Source",
  ],
  agency: [
    "Timestamp",
    "Full Name",
    "Email",
    "Mobile",
    "Company",
    "Industry",
    "Budget Range",
    "Message",
    "Source",
  ],
  voucher: [
    "Timestamp",
    "Reference",
    "Status",
    "Tier",
    "Amount",
    "Prize",
    "Course",
    "Buyer Name",
    "Buyer Email",
    "Buyer Mobile",
    "For",
    "Recipient Name",
    "Recipient Email",
    "Personal Message",
    "Promo Code",
    "PayFast PaymentID",
  ],
  // /form — in-person QR-code entry at a course (paid via PayFast)
  entry: [
    "Timestamp",
    "Reference",
    "Status",
    "Date",
    "Tier",
    "Amount",
    "Prize",
    "Course",
    "Name",
    "Email",
    "Mobile",
    "PayFast PaymentID",
  ],
  // /form-2 — free entry capture for sponsored / corporate days (no payment)
  freeEntry: [
    "Timestamp",
    "Name",
    "Email",
    "Mobile",
    "Course",
    "Event",
    "Source",
  ],
  // indwemicrosite.vercel.app — risk review request from the Indwe sponsor microsite.
  // Lands here so the Indwe leads API picks it up alongside the other types.
  // Tab is created automatically by the central Apps Script, so riskReview
  // submissions are physically separated from other lead types.
  riskReview: [
    "Timestamp",
    "Full Name",
    "Email",
    "Mobile",
    "Schedule File",
    "Consent",
    "Lead Stage",
    "Source",
  ],
};

function endpoint() {
  const url = process.env.SHEETS_WEBAPP_URL;
  const secret = process.env.SHEETS_SECRET;
  if (!url || !secret) {
    throw new Error("SHEETS_WEBAPP_URL / SHEETS_SECRET not configured");
  }
  return { url, secret };
}

// Apps Script web apps are slow and bursty (cold starts, a 302 hop to
// googleusercontent, multi-second responses). Bound every call so a stuck
// request fails fast *inside* the serverless function instead of running until
// the platform kills it with a non-JSON 504 — which the browser would then
// mis-report to the buyer as a generic "Network error". 8s sits comfortably
// under Vercel's default 10s function limit, so our thrown error wins the race
// and the caller can surface an actionable message.
const SHEETS_TIMEOUT_MS = 8000;

async function postScript(payload: Record<string, unknown>) {
  const { url, secret } = endpoint();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, secret }),
    redirect: "follow",
    signal: AbortSignal.timeout(SHEETS_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Apps Script HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`Apps Script: ${data.error}`);
  return data;
}

async function getScript(params: Record<string, string>) {
  const { url, secret } = endpoint();
  const u = new URL(url);
  u.searchParams.set("secret", secret);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const res = await fetch(u.toString(), {
    redirect: "follow",
    signal: AbortSignal.timeout(SHEETS_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Apps Script HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`Apps Script: ${data.error}`);
  return data;
}

export async function appendSubmission(
  type: SubmissionType,
  row: Record<string, string | number | boolean | null | undefined>,
) {
  // Normalize row values: booleans → Yes/No, null/undefined → ""
  const cleaned: Record<string, string | number> = {};
  for (const h of HEADERS[type]) {
    const v = row[h];
    if (v === null || v === undefined) cleaned[h] = "";
    else if (typeof v === "boolean") cleaned[h] = v ? "Yes" : "No";
    else cleaned[h] = v;
  }
  await postScript({ action: "append", type, headers: HEADERS[type], row: cleaned });
}

export async function readSubmissions(
  type: SubmissionType,
  sinceISO?: string,
): Promise<Record<string, string>[]> {
  const params: Record<string, string> = { action: "read", type };
  if (sinceISO) params.since = sinceISO;
  const data = await getScript(params);
  return Array.isArray(data.entries) ? data.entries : [];
}

export async function updateVoucherStatus(
  reference: string,
  patch: Record<string, string>,
): Promise<boolean> {
  const data = await postScript({
    action: "update-voucher",
    reference,
    patch,
    headers: HEADERS.voucher,
  });
  return Boolean(data.ok);
}
