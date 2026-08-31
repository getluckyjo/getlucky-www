/**
 * Handing entries to the WhatsApp channel.
 *
 * The WhatsApp follow-up lives in a separate service (getluckyjo/twillio). This
 * module is the seam: it captures a golfer's WhatsApp consent on the entry
 * forms and hands the entry over.
 *
 * Two rules govern everything here.
 *
 * **Consent to "receive communication" is not consent to WhatsApp.** Meta
 * requires the channel to be named explicitly before any business-initiated
 * message, and it must say what the golfer will be messaged about. The entry
 * forms previously carried a general `consentCommunication` checkbox alongside
 * this one; the two read almost identically, which made the choice between them
 * meaningless. The general one has been removed from the entry forms, leaving a
 * single box that names the channel, the sponsor and the offer. The other forms
 * (corporate, charity, school, simulator, voucher) keep theirs — they do not
 * feed the WhatsApp channel.
 *
 * **An entry must never fail because this did.** A WhatsApp follow-up that does
 * not fire is a lost lead; an entry that does not record is a lost customer
 * and, on the paid form, money taken for nothing. So this resolves rather than
 * throws, always — but it reports what happened, because on the paid path the
 * caller alerts when a golfer who has actually paid is not handed over.
 *
 * **On the paid form this fires when the payment succeeds, not when the form is
 * submitted.** Submitting is not entering: a golfer who opens the PayFast page
 * and walks away has not entered anything, and messaging them is a marketing
 * message to somebody who never paid. /form-2 has no payment step, so there
 * submission is still the right moment.
 */

/**
 * The exact wording shown beside the checkbox. Stored with every consent record
 * so it can be reconstructed later — "we're sure they agreed" is not an answer
 * if Meta or the Information Regulator ask.
 *
 * The forms render this constant directly rather than repeating the string, so
 * what the golfer read and what we stored cannot drift apart.
 *
 * Change this and change CONSENT_FORM_VERSION in the same commit.
 */
export const WHATSAPP_CONSENT_WORDING =
  "I'd like Get Lucky to WhatsApp me about my entry, and about 12 months of complimentary Hole-in-One Membership from headline sponsor Indwe Risk Services when I complete an insurance quote with them.";

/** Bumped whenever WHATSAPP_CONSENT_WORDING changes. */
export const CONSENT_FORM_VERSION = "2026-08-v2";

interface EntryHandoff {
  name: string;
  mobile: string;
  email?: string | null;
  course: string;
  whatsappOptIn: boolean;
  /**
   * The wording version the golfer actually saw. Defaults to the current
   * constant for callers handing over the moment the form is submitted; the
   * paid path passes the version stored on the entry row instead.
   */
  formVersion?: string | null;
}

/**
 * What happened, so a caller on the money path can alert instead of guessing.
 * `skipped` means there was nothing to do — not a failure.
 */
export type HandoffResult = {
  ok: boolean;
  skipped: boolean;
  detail?: string;
};

/** The forms collect one name field; the WhatsApp flow greets people by first name. */
function splitName(full: string): { firstName: string; lastName?: string } {
  const parts = full.trim().split(/\s+/)
  return parts.length > 1
    ? { firstName: parts[0], lastName: parts.slice(1).join(" ") }
    : { firstName: full.trim() || "there" }
}

/**
 * Hands an entry to the WhatsApp service.
 *
 * Sent whether or not the golfer opted in. Entries without consent are recorded
 * there and simply never messaged — which is also how we can show that entering
 * the challenge never required agreeing to WhatsApp. Consent bundled with entry
 * is not freely given, and would be worthless.
 *
 * Resolves rather than throws, always.
 */
export async function notifyWhatsAppChannel(entry: EntryHandoff): Promise<HandoffResult> {
  const url = process.env.WHATSAPP_API_URL;
  const secret = process.env.WHATSAPP_API_SECRET;

  // Not configured is a normal state, not an error — the channel is not live yet.
  if (!url || !secret) {
    return { ok: true, skipped: true, detail: "WHATSAPP_API_URL / _SECRET not set" };
  }

  const { firstName, lastName } = splitName(entry.name);

  try {
    const response = await fetch(`${url.replace(/\/+$/, "")}/api/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-getlucky-signature": secret,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone: entry.mobile,
        email: entry.email || undefined,
        course: entry.course,
        whatsappOptIn: entry.whatsappOptIn,
        consentWording: WHATSAPP_CONSENT_WORDING,
        formVersion: entry.formVersion || CONSENT_FORM_VERSION,
      }),
      // PayFast wants a 200 within ten seconds and the ITN handler has already
      // spent some of that. Give up quickly rather than holding the response
      // while a downstream service thinks about it.
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) {
      const body = (await response.text()).slice(0, 300);
      console.error("whatsapp handoff rejected", { status: response.status, body });
      return { ok: false, skipped: false, detail: `HTTP ${response.status}: ${body}` };
    }

    return { ok: true, skipped: false };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("whatsapp handoff failed", { error: detail });
    return { ok: false, skipped: false, detail };
  }
}
