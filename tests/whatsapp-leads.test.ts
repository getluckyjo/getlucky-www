/**
 * The WhatsApp leg of the Indwe feed.
 *
 * Run with: npm test  (node --test, no test framework dependency)
 *
 * These leads are the most qualified in the feed and the only ones carrying
 * underwriting detail, so the two things worth pinning are the shape Indwe
 * receives and the consent rule that decides who appears at all.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const { toIndweRaw, displayName } = await import("../src/lib/whatsapp-db.ts");
const { LEAD_STAGE_BY_TYPE } = await import("../src/lib/indwe-tiers.ts");

test("a completed profile is Quote-Ready", () => {
  // The golfer answered the underwriting questions and said yes, explicitly, to
  // their details going to Indwe. That is the same insurance intent as a risk
  // review, with more detail attached.
  assert.equal(LEAD_STAGE_BY_TYPE.whatsapp, "Quote-Ready Lead");
});

test("every raw key is present even when the question was never asked", () => {
  // An integrator should not need one code path for a missing key and another
  // for a blank one.
  const raw = toIndweRaw({});
  assert.deepEqual(Object.keys(raw).sort(), [
    "area",
    "channel",
    "cover",
    "currently_insured",
    "parking",
    "preferred_call_time",
    "tenure",
    "vehicle",
  ]);
  assert.equal(raw.cover, "");
  assert.equal(raw.channel, "whatsapp");
});

test("the answers keep their meaning outside the conversation", () => {
  // `insured` and `call_time` are obvious inside the chat and ambiguous in a
  // CRM, so they are renamed on the way out.
  const raw = toIndweRaw({
    cover: "both",
    area: "Claremont",
    vehicle: "VW Polo 2019",
    parking: "garage",
    tenure: "own",
    insured: "yes",
    call_time: "morning",
    indwe_share: "yes",
  });

  assert.equal(raw.currently_insured, "yes");
  assert.equal(raw.preferred_call_time, "morning");
  assert.equal(raw.vehicle, "VW Polo 2019");
});

test("consent is never carried through to the feed as an answer", () => {
  // It is the gate, not underwriting detail. Passing it on would invite it
  // being read as a field Indwe can act on.
  const raw = toIndweRaw({ indwe_share: "yes" });
  assert.equal(Object.values(raw).includes("indwe_share"), false);
  assert.equal("indwe_share" in raw, false);
});

test("a golfer with no entry still gets whatever name we have", () => {
  assert.equal(displayName({ first_name: "Thabo", last_name: "Mokoena" }), "Thabo Mokoena");
  assert.equal(displayName({ first_name: "Thabo", last_name: null }), "Thabo");
  assert.equal(displayName({ first_name: null, last_name: null }), "");
});

test("the query refuses to read a profile that did not consent", () => {
  // Asserted against the source rather than a live database, because there is
  // no other way to test it here and this is the one rule that must never be
  // quietly dropped: without it, a change on the WhatsApp side could start
  // feeding unconsented golfers into a sponsor's CRM with nothing failing.
  const source = readFileSync(new URL("../src/lib/whatsapp-db.ts", import.meta.url), "utf8");
  assert.match(source, /indwe_share'\s*=\s*'yes'/);
});
