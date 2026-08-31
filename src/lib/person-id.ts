import { normaliseSACellNumber } from "./payfast.ts";

/**
 * A stable identity for a golfer across every route they can reach us by.
 *
 * The same person arrives under unrelated ids depending on how they came in: a
 * free entry at a sponsored golf day is `free-entry-<timestamp>-<email>`, and
 * the same golfer completing the WhatsApp conversation a week later is
 * `whatsapp-<row id>`. Nothing linked the two. Indwe are told to dedupe on
 * `id`, so a lead moving from Warm to Quote-Ready arrived as a second, separate
 * record — and the tier upgrade, which is the entire point of the journey, was
 * invisible to them.
 *
 * The mobile number is the one field every route captures, and it is already
 * the key the WhatsApp side uses for everything.
 *
 * Returns "" when the number cannot be read confidently. **An empty personId
 * means "cannot be linked", never "a new person"** — collapsing two blanks into
 * one record would merge strangers, which is worse than not linking at all.
 */
export function personIdForMobile(mobile: string | null | undefined): string {
  // normaliseSACellNumber already collapses +27…, 0027…, 27…, 0… and the bare
  // nine-digit form that on-course sign-up sheets produce, and returns "" for
  // anything it cannot place — including a genuine foreign number, which we
  // would rather not link than link wrongly.
  //
  // E.164 is emitted rather than the local 0… form: it is what the WhatsApp
  // side stores, and it is the unambiguous shape to hand a third party.
  const local = normaliseSACellNumber(mobile || "");
  return local ? `+27${local.slice(1)}` : "";
}
