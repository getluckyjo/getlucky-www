import { test } from "node:test";
import assert from "node:assert/strict";
import { hopIndex, spinSchedule, VERDICTS } from "../src/lib/golf-gods.ts";

test("the spin always ends on the landing card", () => {
  for (let landing = 0; landing < 6; landing++) {
    const steps = spinSchedule(6, landing);
    assert.equal(hopIndex(steps.length - 1, 6), landing, `landing ${landing}`);
  }
});

test("the spin does at least three laps and slows down", () => {
  const steps = spinSchedule(6, 2);
  assert.ok(steps.length >= 3 * 6);
  for (let i = 1; i < steps.length; i++) assert.ok(steps[i] >= steps[i - 1]);
  assert.equal(steps[0], 55);
  assert.equal(steps[steps.length - 1], 320);
});

test("the whole run lasts a few seconds, not a blink or an age", () => {
  const total = spinSchedule(6, 5).reduce((a, b) => a + b, 0);
  assert.ok(total > 2000 && total < 6000, `total ${total}ms`);
});

test("there is more than one verdict", () => {
  assert.ok(VERDICTS.length > 1);
});
