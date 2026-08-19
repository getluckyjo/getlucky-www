/**
 * Signature checks for the PayFast money path.
 *
 * Run with: npm test  (node --test, no test framework dependency)
 *
 * The August 2026 outage was a signature the app could not reproduce: PayFast
 * sent ITNs whose payload included empty-valued fields, this app dropped those
 * fields before hashing, every notification was answered 400, and ~30 paid
 * entries stayed `pending`. The cases below encode both constructions so a
 * regression in either direction is caught here rather than in the Sheet.
 *
 * The expected hashes are computed by an independent implementation written
 * from PayFast's PHP reference (phpUrlencode + md5) rather than by calling the
 * code under test, so the test is a real check and not a tautology.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

process.env.PAYFAST_MERCHANT_ID ||= "10000100";
process.env.PAYFAST_MERCHANT_KEY ||= "46f0cd694581a";
process.env.PAYFAST_PASSPHRASE ||= "jt7NOE43FZPn";

const { signFields, verifyNotifySignature, normaliseSACellNumber } = await import(
  "../src/lib/payfast.ts"
);

/** PHP urlencode(), independently implemented. */
function phpUrlencode(v: string) {
  return encodeURIComponent(v)
    .replace(/%20/g, "+")
    .replace(/[!'()*~]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

function md5(s: string) {
  return crypto.createHash("md5").update(s).digest("hex");
}

/** PayFast's PHP SDK ITN validator: every field received, in order, untrimmed. */
function itnSignatureAllFields(fields: Record<string, string>, passphrase: string) {
  const parts = Object.entries(fields).map(([k, v]) => `${k}=${phpUrlencode(v)}`);
  parts.push(`passphrase=${phpUrlencode(passphrase)}`);
  return md5(parts.join("&"));
}

/** The construction this app used until Aug 2026: empty fields dropped. */
function itnSignatureSkippingEmpty(fields: Record<string, string>, passphrase: string) {
  const parts = Object.entries(fields)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}=${phpUrlencode(v)}`);
  parts.push(`passphrase=${phpUrlencode(passphrase)}`);
  return md5(parts.join("&"));
}

function toBody(fields: Record<string, string>, signature: string) {
  const parts = Object.entries(fields).map(([k, v]) => `${k}=${phpUrlencode(v)}`);
  parts.push(`signature=${signature}`);
  return parts.join("&");
}

/** A realistic entry ITN, including the empty-valued fields PayFast now sends. */
const ITN_FIELDS: Record<string, string> = {
  m_payment_id: "GLE-MSYCOGB4-W7JTQ",
  pf_payment_id: "2129461",
  payment_status: "COMPLETE",
  item_name: "Gold Swing — Get Lucky Hole-in-One Challenge",
  item_description: "Course entry for Atlantic Beach on 2026-08-18, win R200,000",
  amount_gross: "250.00",
  amount_fee: "-8.63",
  amount_net: "241.37",
  custom_str1: "Atlantic Beach",
  custom_str2: "entry:2026-08-18",
  custom_str3: "",
  custom_str4: "",
  custom_str5: "",
  custom_int1: "",
  name_first: "Liam",
  name_last: "O'Brien",
  email_address: "liam@example.co.za",
  merchant_id: "10000100",
};

test("an ITN signed the way PayFast's PHP reference does it verifies", () => {
  const signature = itnSignatureAllFields(ITN_FIELDS, process.env.PAYFAST_PASSPHRASE!);
  const result = verifyNotifySignature(toBody(ITN_FIELDS, signature), signature);
  assert.equal(result.ok, true, `no variant matched (empty fields: ${result.emptyFieldNames})`);
  assert.equal(result.matched, "all-fields");
  // The empty fields are the whole reason this used to fail — make sure the
  // diagnostic that would have named the cause is actually populated.
  assert.deepEqual(result.emptyFieldNames, ["custom_str3", "custom_str4", "custom_str5", "custom_int1"]);
});

test("an ITN signed the legacy way (empty fields dropped) still verifies", () => {
  const signature = itnSignatureSkippingEmpty(ITN_FIELDS, process.env.PAYFAST_PASSPHRASE!);
  const result = verifyNotifySignature(toBody(ITN_FIELDS, signature), signature);
  assert.equal(result.ok, true);
  // No value here has surrounding whitespace, so the trimmed and untrimmed
  // skip-empty constructions hash identically; either name is a pass.
  assert.match(String(result.matched), /^skip-empty/);
});

test("an ITN with no empty fields verifies under either construction", () => {
  const fields = Object.fromEntries(
    Object.entries(ITN_FIELDS).filter(([, v]) => v !== ""),
  ) as Record<string, string>;
  const signature = itnSignatureAllFields(fields, process.env.PAYFAST_PASSPHRASE!);
  assert.equal(verifyNotifySignature(toBody(fields, signature), signature).ok, true);
});

test("a tampered amount does not verify", () => {
  const signature = itnSignatureAllFields(ITN_FIELDS, process.env.PAYFAST_PASSPHRASE!);
  const tampered = { ...ITN_FIELDS, amount_gross: "5.00" };
  const result = verifyNotifySignature(toBody(tampered, signature), signature);
  assert.equal(result.ok, false);
  assert.equal(result.matchedWithoutPassphrase, null);
});

test("a signature computed without the passphrase is reported, not accepted", () => {
  const parts = Object.entries(ITN_FIELDS).map(([k, v]) => `${k}=${phpUrlencode(v)}`);
  const signature = md5(parts.join("&"));
  const result = verifyNotifySignature(toBody(ITN_FIELDS, signature), signature);
  assert.equal(result.ok, false);
  assert.equal(result.matchedWithoutPassphrase, "all-fields");
});

test("garbage in the signature field is rejected without throwing", () => {
  const result = verifyNotifySignature(toBody(ITN_FIELDS, "not-a-hash"), "not-a-hash");
  assert.equal(result.ok, false);
});

test("outbound payment requests keep the pre-outage construction", () => {
  // Empty fields are never sent outbound, so signFields must keep dropping
  // them: this is the signature PayFast validates at /eng/process, and getting
  // it wrong stops every golfer at the payment page.
  const fields = {
    merchant_id: "10000100",
    merchant_key: "46f0cd694581a",
    amount: "250.00",
    item_name: "Gold Swing (O'Brien)",
    custom_str1: "",
  };
  const expected = itnSignatureSkippingEmpty(fields, process.env.PAYFAST_PASSPHRASE!);
  assert.equal(signFields(fields), expected);
});

test("SA mobile numbers normalise to PayFast's 10-digit format", () => {
  assert.equal(normaliseSACellNumber("+27 82 811 1909"), "0828111909");
  assert.equal(normaliseSACellNumber("27828111909"), "0828111909");
  assert.equal(normaliseSACellNumber("828111909"), "0828111909");
  assert.equal(normaliseSACellNumber("0828111909"), "0828111909");
  assert.equal(normaliseSACellNumber("nonsense"), "");
});
