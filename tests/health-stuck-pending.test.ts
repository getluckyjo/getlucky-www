/**
 * When a pile of unpaid entries is worth an alert.
 *
 * Run with: npm test  (node --test, no test framework dependency)
 *
 * The rule this pins is the one the old absolute threshold got wrong: entry
 * rows are written before the golfer reaches PayFast, so abandonment is normal
 * and scales with traffic. What separates a break from a quiet week is whether
 * a single entry of that age paid at all.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const { stuckPendingCheck, STUCK_COHORT_MIN } = await import("../src/lib/health.ts");

test("abandonments never alarm while anything is paying", () => {
  // The 18 Sep 2026 case that made this change: 4 unpaid, 3 paid, endpoint red.
  const r = stuckPendingCheck({ cohortCreated: 11, cohortPaid: 3, stuckPending: 4 });
  assert.ok(r.ok);
  assert.match(r.detail, /payments flowing/);
});

test("no count of unpaid entries alarms on its own", () => {
  // A busy show weekend with poor conversion is still not a fault. One payment
  // proves the path, however many walked away.
  const r = stuckPendingCheck({ cohortCreated: 500, cohortPaid: 1, stuckPending: 499 });
  assert.ok(r.ok);
});

test("a cohort where not one entry paid is the shape of a break", () => {
  const r = stuckPendingCheck({
    cohortCreated: STUCK_COHORT_MIN,
    cohortPaid: 0,
    stuckPending: STUCK_COHORT_MIN,
  });
  assert.ok(!r.ok);
  assert.match(r.detail, /NOT ONE/);
});

test("a sample too small to mean anything stays quiet", () => {
  // Three people who all changed their minds is a Tuesday, not an outage.
  const r = stuckPendingCheck({ cohortCreated: 3, cohortPaid: 0, stuckPending: 3 });
  assert.ok(r.ok);
  assert.match(r.detail, /not conclusive/);
});

test("silence with no attempts behind it is not evidence", () => {
  const r = stuckPendingCheck({ cohortCreated: 0, cohortPaid: 0, stuckPending: 0 });
  assert.ok(r.ok);
});

test("the counts are reported whatever the verdict", () => {
  // The numbers are what someone reads at 6am; they must survive every branch.
  for (const h of [
    { cohortCreated: 11, cohortPaid: 3, stuckPending: 4 },
    { cohortCreated: 20, cohortPaid: 0, stuckPending: 19 },
    { cohortCreated: 2, cohortPaid: 0, stuckPending: 2 },
  ]) {
    const r = stuckPendingCheck(h);
    assert.match(r.detail, new RegExp(`${h.stuckPending} of ${h.cohortCreated} still pending`));
    assert.match(r.detail, new RegExp(`${h.cohortPaid} paid`));
  }
});
