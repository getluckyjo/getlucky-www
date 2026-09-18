/**
 * When a pile of unpaid entries is worth waking someone for.
 *
 * Every entry row is written BEFORE the golfer reaches PayFast — /api/forms/entry
 * fails closed on the DB and Sheets writes, then redirects — so anyone who taps
 * the pay button and wanders off leaves a `pending` row behind for ever.
 * Abandonment is therefore not a fault; it is the normal by-product of traffic,
 * and it scales with traffic.
 *
 * The old rule alarmed on an absolute count (3 or more stuck in 72h). At the
 * observed conversion rate — 3 paid out of 11 attempts over three days — that
 * fires on an ordinary week, which is how it came to be red every day while
 * nothing was wrong. A signal that is always red is a signal nobody reads, and
 * that is precisely how the July–August 2026 ITN outage ran for nineteen days
 * behind a wall of green checks.
 *
 * So the rule is no longer "how many" but "did ANY of them pay". Take the
 * cohort of entries created inside the bounded window — all of them old enough
 * to have paid by now — and ask whether a single one reached `paid`. One
 * payment proves the whole path worked for entries of that age: signature,
 * redirect, ITN, validation, write. The rest are people who changed their mind.
 * Zero payments across a cohort big enough to mean something is the shape of a
 * break, and it is the only shape worth an email.
 *
 * MIN_COHORT exists so a quiet Tuesday cannot alarm. At a ~27% conversion rate
 * the chance of five consecutive genuine abandonments is roughly one in five,
 * and of eight about one in fourteen — small enough to be worth a look, large
 * enough not to cry wolf. It is deliberately a floor on the SAMPLE, never a
 * floor on the number of stuck rows: no count of unpaid entries alarms on its
 * own, at any volume.
 */
export const STUCK_COHORT_MIN = 8;

export type StuckPendingInput = {
  /** Entries created in the bounded window, whatever became of them. */
  cohortCreated: number;
  /** How many of that cohort reached `paid`. */
  cohortPaid: number;
  /** How many are still `pending`. Reported, never the trigger. */
  stuckPending: number;
};

export type StuckPendingVerdict = { ok: boolean; detail: string };

export function stuckPendingCheck(h: StuckPendingInput): StuckPendingVerdict {
  const { cohortCreated, cohortPaid, stuckPending } = h;

  // Nothing to judge. Silence with no attempts behind it is not evidence.
  if (cohortCreated === 0) {
    return { ok: true, detail: "no entries created in the window" };
  }

  const tooSmall = cohortCreated < STUCK_COHORT_MIN;
  const ok = cohortPaid > 0 || tooSmall;
  const summary =
    `${stuckPending} of ${cohortCreated} still pending, ${cohortPaid} paid`;

  if (cohortPaid > 0) {
    // The load-bearing sentence: payments prove the path, so what is left is
    // abandonment and nobody needs waking.
    return { ok, detail: `${summary} — payments flowing, rest are abandonments` };
  }
  if (tooSmall) {
    return { ok, detail: `${summary} — sample below ${STUCK_COHORT_MIN}, not conclusive` };
  }
  return { ok, detail: `${summary} — NOT ONE of ${cohortCreated} paid` };
}
