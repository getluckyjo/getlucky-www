/**
 * A paid course entry must arrive with something Indwe can act on.
 *
 * Run with: npm test  (node --test, no test framework dependency)
 *
 * From 31 Aug to Nov 2026 /form asked for neither a name nor an email, on the
 * belief that PayFast collects both at checkout and returns them in the ITN.
 * It does not: the ITN echoes the customer details the payment request sent.
 * Every on-course entry in that window was written with a mobile number only,
 * withheld from Indwe and greeted as "there" on WhatsApp. These cases pin the
 * three places that would have caught it: the form must require a name, the
 * name must travel to PayFast, and the daily check must notice when an entry
 * arrives without one.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.PAYFAST_MERCHANT_ID ||= "10000100";
process.env.PAYFAST_MERCHANT_KEY ||= "46f0cd694581a";

const { entrySchema } = await import("../src/lib/validation.ts");
const { COURSES, PRIZE_TIERS } = await import("../src/lib/constants.ts");
const { buildPaymentRequest } = await import("../src/lib/payfast.ts");
const { contactableEntriesCheck } = await import("../src/lib/health.ts");

const good = {
  entryAmount: PRIZE_TIERS[0].entryAmount,
  course: COURSES[0],
  name: "Test Golfer",
  mobile: "082 555 1234",
  consentWhatsApp: false,
  consentTerms: true,
};

test("/form: a name, a number and a course is a complete entry, with no email", () => {
  const r = entrySchema.safeParse(good);
  assert.ok(r.success, JSON.stringify(r.error?.flatten().fieldErrors));
  assert.equal(r.data.name, "Test Golfer");
  // Email is still not asked, and is not passed through if a client sends one.
  assert.ok(!("email" in r.data));
});

test("/form: an entry without a name is turned back at the form", () => {
  for (const name of [undefined, "", "   "]) {
    const r = entrySchema.safeParse({ ...good, name });
    assert.ok(!r.success, `accepted name=${JSON.stringify(name)}`);
    assert.ok(r.error.flatten().fieldErrors.name, "no error on the name field");
  }
});

test("the payment request carries the name to PayFast, and no empty email", () => {
  const fields = buildPaymentRequest({
    amount: good.entryAmount,
    itemName: "Test entry",
    reference: "GLE-TEST-00000",
    buyerName: "Test Golfer",
    buyerEmail: "",
    buyerMobile: good.mobile,
  });
  assert.equal(fields.name_first, "Test");
  assert.equal(fields.name_last, "Golfer");
  // PayFast rejects an empty email_address; it must be absent, not blank.
  assert.ok(!("email_address" in fields));
});

test("entries_contactable: a name or an email is enough", () => {
  const r = contactableEntriesCheck([
    { name: "Test Golfer", email: null },
    { name: null, email: "golfer@example.com" },
  ]);
  assert.ok(r.ok);
  assert.match(r.detail, /all 2 carry a name or an email/);
});

test("entries_contactable: one entry with neither is a break, not a quirk", () => {
  // The shape of every on-course entry from 31 Aug: nulls, written by /form.
  const r = contactableEntriesCheck([
    { name: "Test Golfer", email: null },
    { name: null, email: null },
  ]);
  assert.ok(!r.ok);
  assert.match(r.detail, /1 of 2 have neither a name nor an email/);
});

test("entries_contactable: blank and whitespace count as missing", () => {
  const r = contactableEntriesCheck([{ name: "  ", email: "" }]);
  assert.ok(!r.ok);
});

test("entries_contactable: a day with no entries is not evidence", () => {
  const r = contactableEntriesCheck([]);
  assert.ok(r.ok);
});
