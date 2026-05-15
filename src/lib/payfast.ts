import crypto from "node:crypto";

const SANDBOX_HOST = "sandbox.payfast.co.za";
const LIVE_HOST = "www.payfast.co.za";

function host() {
  return process.env.PAYFAST_MODE === "live" ? LIVE_HOST : SANDBOX_HOST;
}

export function processUrl() {
  return `https://${host()}/eng/process`;
}

function validateUrl() {
  return `https://${host()}/eng/query/validate`;
}

function merchantId() {
  const v = process.env.PAYFAST_MERCHANT_ID;
  if (!v) throw new Error("PAYFAST_MERCHANT_ID not set");
  return v;
}
function merchantKey() {
  const v = process.env.PAYFAST_MERCHANT_KEY;
  if (!v) throw new Error("PAYFAST_MERCHANT_KEY not set");
  return v;
}
function passphrase() {
  return process.env.PAYFAST_PASSPHRASE || "";
}
function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.getluckygolf.co.za";
}

/**
 * PayFast field order matters for signature generation.
 * Per the PayFast docs the signature is the MD5 hash of a URL-encoded
 * key=value query string in the order fields are submitted, with the
 * passphrase appended (also URL-encoded).
 */
function pfEncode(value: string) {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

/**
 * Normalise a SA mobile number to PayFast's required 10-digit format
 * starting with a leading 0. Accepts +27 / 27 / 0 prefixes and free
 * spacing. Returns "" if the input doesn't look like a SA mobile so the
 * caller can drop the field entirely (it's optional in PayFast's API).
 */
export function normaliseSACellNumber(input: string): string {
  let digits = (input || "").replace(/\D/g, "");
  if (digits.startsWith("27") && digits.length === 11) digits = "0" + digits.slice(2);
  if (digits.length === 9 && !digits.startsWith("0")) digits = "0" + digits;
  return digits.length === 10 && digits.startsWith("0") ? digits : "";
}

export function buildPaymentRequest(opts: {
  amount: number;
  itemName: string;
  itemDescription?: string;
  reference: string;
  buyerName: string;
  buyerEmail: string;
  buyerMobile?: string;
  customStr1?: string;
  customStr2?: string;
  /** Path on the site to redirect to on successful payment, e.g. "/form/success".
   *  ?ref=<reference> is appended automatically. Defaults to /buy-a-swing/success. */
  returnPath?: string;
  /** Path for cancel/abort. Defaults to /buy-a-swing/cancel. */
  cancelPath?: string;
  /**
   * Absolute URL overrides — bypass `siteUrl()` entirely. Use when redirecting
   * to a different host (e.g. membership.getluckygolfclub.com). When provided,
   * `?ref=<reference>` is NOT appended; pass the full URL you want.
   */
  urls?: {
    returnUrl?: string;
    cancelUrl?: string;
    notifyUrl?: string;
  };
  /** Recurring subscription config. Omit for one-off payments. */
  subscription?: {
    /** R amount charged each cycle (can equal amount for first-cycle == recurring). */
    recurringAmount: number;
    /** PayFast frequency code: 3=monthly, 4=quarterly, 5=biannual, 6=annual. */
    frequency: 3 | 4 | 5 | 6;
    /** Number of cycles. 0 = unlimited / until cancelled. */
    cycles: number;
    /** First billing date YYYY-MM-DD; defaults to today. */
    billingDate?: string;
  };
}) {
  const returnPath = opts.returnPath || "/buy-a-swing/success";
  const cancelPath = opts.cancelPath || "/buy-a-swing/cancel";
  const ref = encodeURIComponent(opts.reference);
  const email = opts.buyerEmail && opts.buyerEmail.trim() ? opts.buyerEmail.trim() : "";

  // IMPORTANT: field insertion order is the PayFast canonical order. PayFast
  // signs fields in submitted order, and PayFast's own signature computation
  // expects this exact sequence — specifically email_address BEFORE cell_number,
  // and email_confirmation / confirmation_address AFTER the custom_str* fields.
  // Getting this wrong returns "Generated signature does not match submitted
  // signature." on the /eng/process redirect.
  const fields: Record<string, string> = {
    merchant_id: merchantId(),
    merchant_key: merchantKey(),
    return_url: opts.urls?.returnUrl ?? `${siteUrl()}${returnPath}?ref=${ref}`,
    cancel_url: opts.urls?.cancelUrl ?? `${siteUrl()}${cancelPath}?ref=${ref}`,
    notify_url: opts.urls?.notifyUrl ?? `${siteUrl()}/api/payfast/notify`,
    name_first: opts.buyerName.split(" ")[0] || opts.buyerName,
    name_last: opts.buyerName.split(" ").slice(1).join(" ") || opts.buyerName,
    // email_address must come BEFORE cell_number. PayFast rejects an empty
    // email_address string, so omit the field entirely when no email provided.
    ...(email ? { email_address: email } : {}),
    cell_number: normaliseSACellNumber(opts.buyerMobile || ""),
    m_payment_id: opts.reference,
    amount: opts.amount.toFixed(2),
    item_name: opts.itemName.slice(0, 100),
    item_description: (opts.itemDescription || opts.itemName).slice(0, 255),
    custom_str1: opts.customStr1 || "",
    custom_str2: opts.customStr2 || "",
    // email_confirmation + confirmation_address come AFTER custom_str* per
    // PayFast's canonical order.
    ...(email ? { email_confirmation: "1", confirmation_address: email } : {}),
  };

  // Subscription fields, if requested. Per PayFast docs, set subscription_type=1
  // and the recurring fields. The initial `amount` is what gets charged today;
  // `recurring_amount` is what gets charged every subsequent cycle.
  if (opts.subscription) {
    const today = new Date();
    const billingDate =
      opts.subscription.billingDate ||
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    fields.subscription_type = "1";
    fields.billing_date = billingDate;
    fields.recurring_amount = opts.subscription.recurringAmount.toFixed(2);
    fields.frequency = String(opts.subscription.frequency);
    fields.cycles = String(opts.subscription.cycles);
  }

  // Drop empty fields (PayFast doesn't want them in the signature)
  for (const k of Object.keys(fields)) {
    if (!fields[k]) delete fields[k];
  }

  fields.signature = signFields(fields);
  return fields;
}

export function signFields(fields: Record<string, string>) {
  const queryString = Object.keys(fields)
    .filter((k) => k !== "signature" && fields[k] !== "")
    .map((k) => `${k}=${pfEncode(fields[k])}`)
    .join("&");

  const pp = passphrase();
  const toHash = pp ? `${queryString}&passphrase=${pfEncode(pp)}` : queryString;
  return crypto.createHash("md5").update(toHash).digest("hex");
}

export function verifyNotifySignature(rawBody: string, providedSignature: string) {
  // Reconstruct the field map from the raw form-encoded body, preserving order.
  const params = new URLSearchParams(rawBody);
  const fields: Record<string, string> = {};
  for (const [k, v] of params.entries()) {
    if (k !== "signature") fields[k] = v;
  }
  const expected = signFields(fields);
  return timingSafeEqual(expected, providedSignature);
}

export async function validateNotifyServerSide(rawBody: string) {
  const res = await fetch(validateUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: rawBody,
  });
  const text = (await res.text()).trim();
  return text === "VALID";
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

const PAYFAST_IPS = [
  "www.payfast.co.za",
  "sandbox.payfast.co.za",
  "w1w.payfast.co.za",
  "w2w.payfast.co.za",
];

export function payfastNotifyHosts() {
  return PAYFAST_IPS;
}
