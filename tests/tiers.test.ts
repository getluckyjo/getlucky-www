import { test } from "node:test";
import assert from "node:assert/strict";
import { PRIZE_TIERS } from "../src/lib/constants.ts";
import { findTier, formatRand, nextTier, tierMultiplier, upsellCopy } from "../src/lib/tiers.ts";

test("every tier's prize string matches its prizeAmount", () => {
  for (const t of PRIZE_TIERS) assert.equal(formatRand(t.prizeAmount), t.prize);
});

test("multipliers never fall as you climb the ladder", () => {
  let last = 0;
  for (const t of PRIZE_TIERS) {
    const m = tierMultiplier(t);
    assert.ok(m >= last, `${t.label} multiplier ${m} < ${last}`);
    last = m;
  }
  assert.equal(tierMultiplier(findTier(50)!), 500);
  assert.equal(tierMultiplier(findTier(1000)!), 1000);
});

test("nextTier walks up and stops at the top", () => {
  assert.equal(nextTier(50)?.entryAmount, 100);
  assert.equal(nextTier(500)?.entryAmount, 1000);
  assert.equal(nextTier(1000), undefined);
  assert.equal(nextTier(999), undefined);
});

test("upsellCopy frames the extra rand and the next prize", () => {
  const u = upsellCopy(150);
  assert.ok(u);
  assert.equal(u.extra, 100);
  assert.equal(u.prize, "R200,000");
  assert.equal(u.next.entryAmount, 250);
  assert.equal(upsellCopy(1000), undefined);
});

test("formatRand groups thousands with commas", () => {
  assert.equal(formatRand(0), "R0");
  assert.equal(formatRand(999), "R999");
  assert.equal(formatRand(1234567.4), "R1,234,567");
});
