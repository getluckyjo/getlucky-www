/**
 * The "What do the golf gods say?" spinner behind the tier picker.
 *
 * A roulette run: the light hops from card to card, fast at first and
 * slowing to a stop on the rung the gods chose. The landing is uniform
 * across the six tiers and picked before the run starts; the run is
 * theatre. Pure so the schedule can be tested.
 */

export const VERDICTS = [
  "Fortune favours the bold.",
  "The wind is at your back.",
  "The gods have spoken.",
  "Trust the swing.",
  "The pin is closer than it looks.",
  "Today is the day.",
  "The cup is waiting.",
] as const;

/**
 * Delays, in ms, between each hop of the light. The light starts on card 0,
 * does at least three full laps, then eases to a stop on `landing`.
 */
export function spinSchedule(count: number, landing: number, laps = 3): number[] {
  const hops = laps * count + landing + 1;
  const out: number[] = [];
  for (let i = 0; i < hops; i++) {
    const p = i / Math.max(1, hops - 1);
    // Quadratic ease-out from a 55ms tick to a 320ms crawl at the end.
    out.push(Math.round(55 + 265 * p * p));
  }
  return out;
}

/** Which card the light is on after the i-th hop of a schedule. */
export function hopIndex(i: number, count: number): number {
  return i % count;
}
