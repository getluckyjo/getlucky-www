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
 * message. The existing `consentCommunication` checkbox does not name it, which
 * is why this is a separate field rather than a widening of that one — and it
 * lets a golfer accept email and a phone call while declining WhatsApp.
 *
 * **An entry must never fail because this did.** The golfer is mid-payment. A
 * WhatsApp follow-up that does not fire is a lost lead; an entry that does not
 * record is a lost customer and, on the paid form, money taken for nothing.
 */

/**
 * The exact wording shown beside the checkbox. Stored with every consent record
 * so it can be reconstructed later — "we're sure they agreed" is not an answer
 * if Meta or the Information Regulator ask.
 *
 * Change this and change CONSENT_FORM_VERSION in the same commit.
 */
export const WHATSAPP_CONSENT_WORDING =
  "I'd like Get Lucky to WhatsApp me about my entry, and about 12 months of " +
  "complimentary Hole-in-One Membership from headline sponsor Indwe Risk Services " +
  "when I complete an insurance quote with them.";

/** Bumped whenever WHATSAPP_CONSENT_WORDING changes. */
export const CONSENT_FORM_VERSION = "2026-08-v1";

interface EntryHandoff {
  name: string;
  mobile: string;
  email?: string | null;
  course: string;
  whatsappOptIn: boolean;
}

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
export async function notifyWhatsAppChannel(entry: EntryHandoff): Promise<void> {
  const url = process.env.WHATSAPP_API_URL;
  const secret = process.env.WHATSAPP_API_SECRET;

  // Not configured is a normal state, not an error — the channel is not live yet.
  if (!url || !secret) return;

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
        formVersion: CONSENT_FORM_VERSION,
      }),
      // The golfer is waiting on a payment redirect. Give up quickly rather
      // than holding them while a downstream service thinks about it.
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) {
      console.error("whatsapp handoff rejected", {
        status: response.status,
        body: (await response.text()).slice(0, 300),
      });
    }
  } catch (error) {
    console.error("whatsapp handoff failed", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
