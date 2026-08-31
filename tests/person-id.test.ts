/**
 * One golfer, one identity, however they reached us.
 *
 * Run with: npm test  (node --test, no test framework dependency)
 *
 * On 31 August 2026 twenty golfers signed in at an Indwe-sponsored golf day via
 * /form-2 and went to Indwe as Warm Leads. Had one of them then completed the
 * WhatsApp conversation, they would have arrived a second time as a separate
 * Quote-Ready record, because a free entry is keyed on its timestamp and email
 * while a WhatsApp lead is keyed on a row id. The cases below are the number
 * shapes those two routes actually produce.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const { personIdForMobile } = await import("../src/lib/person-id.ts");

test("the shapes the two routes actually produce collapse to one identity", () => {
  const expected = "+27826159393";
  // What a sign-up sheet produces — nine digits, no leading zero.
  assert.equal(personIdForMobile("826159393"), expected);
  // What the entry forms usually produce.
  assert.equal(personIdForMobile("0826159393"), expected);
  // What the WhatsApp side stores, everywhere.
  assert.equal(personIdForMobile("+27826159393"), expected);
  assert.equal(personIdForMobile("27826159393"), expected);
});

test("formatting a human typed in does not create a second person", () => {
  assert.equal(personIdForMobile("082 615 9393"), "+27826159393");
  assert.equal(personIdForMobile("(082) 615-9393"), "+27826159393");
  assert.equal(personIdForMobile(" 0826159393 "), "+27826159393");
});

test("an unreadable number links to nothing rather than to the wrong person", () => {
  // Empty means "cannot be linked", never "a new person". Two blanks must not
  // collapse into one record, which is why they are equal but empty.
  assert.equal(personIdForMobile(""), "");
  assert.equal(personIdForMobile(null), "");
  assert.equal(personIdForMobile(undefined), "");
  assert.equal(personIdForMobile("not a phone number"), "");
  assert.equal(personIdForMobile("12345"), "");
});

test("a foreign number is not silently claimed as South African", () => {
  assert.equal(personIdForMobile("+441234567890"), "");
  assert.equal(personIdForMobile("+15551234567"), "");
});

test("different golfers stay different", () => {
  assert.notEqual(personIdForMobile("0826159393"), personIdForMobile("0837862907"));
});
