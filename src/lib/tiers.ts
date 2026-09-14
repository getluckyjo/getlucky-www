import { PRIZE_TIERS, type PrizeTier } from "./constants.ts";

/**
 * Helpers behind the prize-first tier picker.
 *
 * The picker borrows three things from bet-slip design: the payout is the
 * headline and the stake is the small print; the payout-to-stake ratio is
 * shown so a bigger swing reads as better odds, not just a bigger spend; and
 * there is always a one-tap nudge to the next rung up (the "bet max" step).
 * These are pure so the maths can be tested without a DOM.
 */

export function findTier(entryAmount: number): PrizeTier | undefined {
  return PRIZE_TIERS.find((t) => t.entryAmount === entryAmount);
}

/** Prize divided by entry, rounded — "500×" on a R50 swing for R25,000. */
export function tierMultiplier(tier: PrizeTier): number {
  return Math.round(tier.prizeAmount / tier.entryAmount);
}

/** The rung above the given one, or undefined at the top of the ladder. */
export function nextTier(entryAmount: number): PrizeTier | undefined {
  const i = PRIZE_TIERS.findIndex((t) => t.entryAmount === entryAmount);
  if (i < 0) return undefined;
  return PRIZE_TIERS[i + 1];
}

/**
 * What the nudge under the grid says. Framed as the extra rand, not the new
 * total, because "R100 more" is a smaller number than "R250" and the prize
 * jump beside it is the point.
 */
export function upsellCopy(entryAmount: number): { extra: number; prize: string; next: PrizeTier } | undefined {
  const cur = findTier(entryAmount);
  const next = nextTier(entryAmount);
  if (!cur || !next) return undefined;
  return { extra: next.entryAmount - cur.entryAmount, prize: next.prize, next };
}

/** R-prefixed with comma grouping, matching the strings in PRIZE_TIERS. */
export function formatRand(n: number): string {
  return "R" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
