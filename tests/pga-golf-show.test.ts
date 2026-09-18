/**
 * The PGA Golf Show entry.
 *
 * Run with: npm test  (node --test, no test framework dependency)
 *
 * Three things worth pinning: neither the Instagram tap nor the WhatsApp box
 * is required, the tap is still recorded when given, and the form asks for
 * nothing beyond a name and a number. The terms are accepted by pressing
 * Enter, so the form always sends them as accepted.
 *
 * And a fourth, at the bottom: the R100 option is a show-floor price that must
 * stay off the public tier ladder.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const { pgaGolfShowEntrySchema } = await import("../src/lib/validation.ts");
const { PGA_GOLF_SHOW, PRIZE_TIERS } = await import("../src/lib/constants.ts");

const good = {
  name: "Test Golfer",
  mobile: "082 555 1234",
  instagramFollow: true,
  consentWhatsApp: true,
  consentTerms: true,
};

test("a name and a number, with the terms accepted by pressing Enter, is a complete entry", () => {
  const r = pgaGolfShowEntrySchema.safeParse(good);
  assert.ok(r.success);
});

test("the Instagram follow is optional — not everyone has Instagram", () => {
  const r = pgaGolfShowEntrySchema.safeParse({ ...good, instagramFollow: false });
  assert.ok(r.success);
  assert.equal(r.data?.instagramFollow, false);
  const { instagramFollow: _omitted, ...withoutFollow } = good;
  void _omitted;
  const r2 = pgaGolfShowEntrySchema.safeParse(withoutFollow);
  assert.ok(r2.success);
  assert.equal(r2.data?.instagramFollow, false);
});

test("an Instagram tap is recorded", () => {
  const r = pgaGolfShowEntrySchema.safeParse(good);
  assert.ok(r.success);
  assert.equal(r.data?.instagramFollow, true);
});

test("WhatsApp consent is optional and defaults to false", () => {
  // Consent bundled with entry is not freely given. Leaving the box unticked
  // must still be a valid entry, recorded as no opt-in.
  const { consentWhatsApp: _omitted, ...withoutWhatsApp } = good;
  void _omitted;
  const r = pgaGolfShowEntrySchema.safeParse(withoutWhatsApp);
  assert.ok(r.success);
  assert.equal(r.data?.consentWhatsApp, false);
});

test("email is not asked", () => {
  assert.ok(!("email" in pgaGolfShowEntrySchema.shape));
});

test("the course reads as a place in the WhatsApp opening", () => {
  // The template says "thanks for entering ... at {{course}}", so the value
  // has to read after "at".
  assert.match(`at ${PGA_GOLF_SHOW.course}.`, /^at the PGA Golf Show\.$/);
});

/**
 * The paid option at the bottom of the form: R100 for a shot at R100,000.
 *
 * What is worth pinning is that it is a show-floor price and nothing else:
 * it must not appear on the public ladder, and it must not collide with it.
 */
test("the paid option is R100 for a shot at R100,000", () => {
  assert.equal(PGA_GOLF_SHOW.paidEntry.amount, 100);
  assert.equal(PGA_GOLF_SHOW.paidEntry.entry, "R100");
  assert.equal(PGA_GOLF_SHOW.paidEntry.prize, "R100,000");
  assert.equal(PGA_GOLF_SHOW.paidEntry.prizeAmount, 100000);
});

test("the paid option is not a rung on the public ladder", () => {
  // R100 buys R60,000 everywhere else, and R100,000 costs R150. The show price
  // is deliberately better, and adding it to PRIZE_TIERS would put it in the
  // tier picker on /form and /buy-a-swing.
  const hundred = PRIZE_TIERS.find((t) => t.entryAmount === PGA_GOLF_SHOW.paidEntry.amount);
  assert.equal(hundred?.prize, "R60,000");
  // Widened to string: the literal types genuinely do not overlap, which is the
  // point being asserted, but comparing them directly is a tsc error.
  const ladderLabels: readonly string[] = PRIZE_TIERS.map((t) => t.label);
  assert.ok(!ladderLabels.includes(PGA_GOLF_SHOW.paidEntry.label));
});

test("the paid shot is four times the free shot", () => {
  // The copy on the form says so — "4× the prize" is computed, not typed.
  assert.equal(PGA_GOLF_SHOW.paidEntry.prizeAmount / PGA_GOLF_SHOW.prizeAmount, 4);
});

test("a paid entry is validated by the same schema as a free one", () => {
  // /api/forms/pga-golf-show/paid takes the same body and reads the price from
  // the server. Nothing about the amount comes off the browser.
  const r = pgaGolfShowEntrySchema.safeParse(good);
  assert.ok(r.success);
  assert.ok(!("entryAmount" in pgaGolfShowEntrySchema.shape));
  assert.ok(!("amount" in pgaGolfShowEntrySchema.shape));
});
