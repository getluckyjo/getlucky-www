/**
 * The PGA Golf Show entry.
 *
 * Run with: npm test  (node --test, no test framework dependency)
 *
 * Three things worth pinning: neither the Instagram follow nor the WhatsApp box
 * is required, the follow is still recorded when given, and the form asks for
 * nothing beyond a name and a number.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const { pgaGolfShowEntrySchema } = await import("../src/lib/validation.ts");
const { PGA_GOLF_SHOW } = await import("../src/lib/constants.ts");

const good = {
  name: "Test Golfer",
  mobile: "082 555 1234",
  instagramFollow: true,
  consentWhatsApp: true,
  consentTerms: true,
};

test("a name, a number and the terms box is a complete entry", () => {
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

test("a follow that was given is recorded", () => {
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
