import crypto from "node:crypto";
import dns from "node:dns/promises";

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
function pfEncode(value: string, trim = true) {
  // Match PHP's urlencode() — PayFast computes signatures server-side with PHP,
  // so we must encode !'()*~ which encodeURIComponent leaves alone. Without
  // this, a buyer named O'Brien (or any name with these chars) fails PayFast's
  // signature check with "Generated signature does not match submitted signature".
  return encodeURIComponent(trim ? value.trim() : value)
    .replace(/%20/g, "+")
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
    .replace(/~/g, "%7E");
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

/**
 * Build the canonical `key=value&...` string PayFast hashes.
 *
 * PayFast's own reference implementations disagree with each other on two
 * points, and PayFast has changed which one it uses on the wire before
 * (see verifyNotifySignature). So the construction is parameterised rather
 * than hard-coded:
 *
 *  - `includeEmpty` — the *payment request* signature omits empty fields
 *    (we never send them). The *ITN* reference validator in PayFast's PHP SDK
 *    does NOT omit them: it hashes every field it received, empty or not.
 *  - `trim` — PayFast's older ITN sample wraps values in trim(); the newer one
 *    does not. It only matters for values with surrounding whitespace.
 */
function buildSignatureString(
  fields: Record<string, string>,
  opts: { includeEmpty: boolean; trim: boolean; passphrase: string | null },
) {
  const pairs = Object.keys(fields)
    .filter((k) => k !== "signature")
    .filter((k) => (opts.includeEmpty ? true : fields[k] !== ""))
    .map((k) => `${k}=${pfEncode(fields[k], opts.trim)}`);

  if (opts.passphrase) pairs.push(`passphrase=${pfEncode(opts.passphrase, opts.trim)}`);
  return pairs.join("&");
}

/**
 * Sign an outbound payment request.
 *
 * DO NOT change the construction here without a live test against PayFast:
 * this is the signature PayFast validates on /eng/process, and a wrong one
 * stops every golfer at the payment page. Empty fields are omitted because
 * buildPaymentRequest never sends them.
 */
export function signFields(fields: Record<string, string>) {
  const toHash = buildSignatureString(fields, {
    includeEmpty: false,
    trim: true,
    passphrase: passphrase() || null,
  });
  return crypto.createHash("md5").update(toHash).digest("hex");
}

/** The construction variants we will accept on an inbound ITN. */
const ITN_VARIANTS: { name: string; includeEmpty: boolean; trim: boolean }[] = [
  // PayFast's PHP SDK validator: every received field, untrimmed.
  { name: "all-fields", includeEmpty: true, trim: false },
  { name: "all-fields-trimmed", includeEmpty: true, trim: true },
  // What this app assumed until Aug 2026 — empty fields dropped.
  { name: "skip-empty-trimmed", includeEmpty: false, trim: true },
  { name: "skip-empty", includeEmpty: false, trim: false },
];

export type NotifySignatureCheck = {
  ok: boolean;
  /** Which construction reproduced PayFast's signature, if any. */
  matched: string | null;
  /**
   * Set when a construction matched only WITHOUT the passphrase — i.e. the
   * fields are right but the shared secret is not being applied. Diagnostic
   * only; never treated as a pass.
   */
  matchedWithoutPassphrase: string | null;
  /** Field names in the order received, for diagnosing a payload change. */
  fieldNames: string[];
  /** Field names whose value arrived empty — the usual cause of a mismatch. */
  emptyFieldNames: string[];
};

/**
 * Verify an ITN signature, tolerantly, and say exactly what happened.
 *
 * Aug 2026: PayFast began sending ITNs whose signature this app could not
 * reproduce, and the handler answered 400 and dropped them. Entries that had
 * been paid for stayed `pending` for three weeks and nobody was told. A
 * signature we cannot reproduce is a reason to shout, not a reason to throw a
 * paid golfer's entry away — the caller cross-checks with PayFast's
 * server-side validation, which is authoritative, before acting on the ITN.
 */
export function verifyNotifySignature(
  rawBody: string,
  providedSignature: string,
): NotifySignatureCheck {
  // Reconstruct the field map from the raw form-encoded body, preserving order.
  const params = new URLSearchParams(rawBody);
  const fields: Record<string, string> = {};
  for (const [k, v] of params.entries()) {
    if (k !== "signature") fields[k] = v;
  }

  const fieldNames = Object.keys(fields);
  const emptyFieldNames = fieldNames.filter((k) => fields[k] === "");
  const pp = passphrase() || null;

  let matched: string | null = null;
  let matchedWithoutPassphrase: string | null = null;

  for (const v of ITN_VARIANTS) {
    const withPass = crypto
      .createHash("md5")
      .update(buildSignatureString(fields, { ...v, passphrase: pp }))
      .digest("hex");
    if (timingSafeEqual(withPass, providedSignature)) {
      matched = v.name;
      break;
    }
    if (pp && !matchedWithoutPassphrase) {
      const noPass = crypto
        .createHash("md5")
        .update(buildSignatureString(fields, { ...v, passphrase: null }))
        .digest("hex");
      if (timingSafeEqual(noPass, providedSignature)) matchedWithoutPassphrase = v.name;
    }
  }

  return {
    ok: matched !== null,
    matched,
    matchedWithoutPassphrase,
    fieldNames,
    emptyFieldNames,
  };
}

export type NotifyPostback = {
  /** PayFast confirmed the payload is a genuine transaction of theirs. */
  valid: boolean;
  /** We got an answer out of PayFast at all. False = network/timeout/5xx. */
  reachable: boolean;
  /** PayFast's raw answer (VALID / INVALID) or the error, for logging. */
  detail: string;
};

/**
 * Post the ITN body back to PayFast and ask whether it is genuine.
 *
 * This is the authoritative check — it does not depend on us reproducing
 * PayFast's signature construction — so the result distinguishes "PayFast says
 * this is not real" (reject) from "we could not ask" (fall back to the
 * signature). Returns rather than throws.
 */
export async function validateNotifyServerSide(rawBody: string): Promise<NotifyPostback> {
  try {
    const res = await fetch(validateUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: rawBody,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return { valid: false, reachable: false, detail: `HTTP ${res.status}` };
    }
    const text = (await res.text()).trim();
    return { valid: text === "VALID", reachable: true, detail: text.slice(0, 120) };
  } catch (err) {
    return {
      valid: false,
      reachable: false,
      detail: err instanceof Error ? err.message : String(err),
    };
  }
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

/**
 * Defence-in-depth: confirm an ITN's source IP resolves to a known PayFast host.
 *
 * This sits ON TOP of signature verification + server-side postback validation
 * (which already cryptographically prove the ITN is genuine), so it is
 * intentionally **fail-open**: if we can't determine the source IP, or DNS
 * lookups fail entirely, we log and allow rather than risk dropping a real
 * paid-entry notification on an infra hiccup. It returns `false` ONLY when we
 * positively identify a source IP that is NOT a PayFast host.
 */
export async function isPayfastSourceIpValid(
  sourceIp: string | null | undefined,
): Promise<boolean> {
  if (!sourceIp) return true; // can't determine source — don't block
  try {
    const resolved = await Promise.all(
      payfastNotifyHosts().map((h) =>
        dns
          .lookup(h, { all: true })
          .then((recs) => recs.map((r) => r.address))
          .catch(() => [] as string[]),
      ),
    );
    const valid = new Set(resolved.flat());
    if (valid.size === 0) return true; // DNS failed entirely — fail-open
    return valid.has(sourceIp);
  } catch {
    return true; // unexpected error — fail-open (postback check still protects us)
  }
}
