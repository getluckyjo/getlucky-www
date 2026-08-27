/**
 * The WhatsApp leg of the Indwe feed.
 *
 * Run with: npm test  (node --test, no test framework dependency)
 *
 * These leads are the most qualified in the feed, the only ones carrying
 * underwriting detail, and now the only ones carrying an appointment — so the
 * things worth pinning are the shape Indwe receives, the slot the golfer was
 * promised, and the consent rule that decides who appears at all.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const { toIndweRaw, displayName, provinceLabel } = await import("../src/lib/whatsapp-db.ts");
const { LEAD_STAGE_BY_TYPE } = await import("../src/lib/indwe-tiers.ts");

test("a completed profile is Quote-Ready", () => {
  // The golfer answered the underwriting questions and said yes, explicitly, to
  // their details going to Indwe. That is the same insurance intent as a risk
  // review, with more detail attached.
  assert.equal(LEAD_STAGE_BY_TYPE.whatsapp, "Quote-Ready Lead");
});

test("every raw key is present even when the question was never asked", () => {
  // An integrator should not need one code path for a missing key and another
  // for a blank one. The branch makes this the common case rather than the
  // exception: a personal-only golfer never sees the two business questions.
  const raw = toIndweRaw({});
  assert.deepEqual(Object.keys(raw).sort(), [
    "business_cover",
    "business_premium",
    "call_date",
    "call_slot",
    "call_time",
    "channel",
    "cover",
    "current_insurer",
    "line",
    "personal_premium",
    "province",
  ]);
  assert.equal(raw.cover, "");
  assert.equal(raw.channel, "whatsapp");
});

test("a golfer quoting one line leaves the other line's keys empty, not absent", () => {
  const raw = toIndweRaw({ line: "personal", cover: "car", personal_premium: "below_2500" });

  assert.equal(raw.line, "personal");
  assert.equal(raw.business_cover, "");
  assert.equal(raw.business_premium, "");
});

test("the answers keep their meaning outside the conversation", () => {
  // `insurer` is obvious inside the chat and ambiguous in a CRM, so it is
  // renamed on the way out — as `insured` was before it.
  const raw = toIndweRaw({
    line: "both",
    business_cover: "liabilities",
    business_premium: "above_30000",
    cover: "both",
    personal_premium: "2500_5000",
    insurer: "Santam",
    province: "kwazulu_natal",
    call_date: "2026-09-02",
    call_time: "10:00",
    indwe_share: "yes",
  });

  assert.equal(raw.current_insurer, "Santam");
  assert.equal(raw.business_cover, "liabilities");
});

test("a coded answer is readable without the conversation as context", () => {
  // A consultant reading "15000_30000" off a CRM screen has to guess. Values
  // that are already words — car, assets, both — pass through untouched.
  const raw = toIndweRaw({
    line: "both",
    business_cover: "assets",
    business_premium: "15000_30000",
    cover: "car",
    personal_premium: "below_2500",
    province: "kwazulu_natal",
  });

  assert.equal(raw.business_premium, "R15,000 – R30,000");
  assert.equal(raw.personal_premium, "Below R2,500");
  assert.equal(raw.province, "KwaZulu-Natal");

  assert.equal(raw.line, "both");
  assert.equal(raw.business_cover, "assets");
  assert.equal(raw.cover, "car");
});

test("the booked slot reads as an appointment", () => {
  // The field that matters on this lead type. The golfer was told an Advisor
  // would ring at exactly this time.
  const raw = toIndweRaw({ call_date: "2026-09-02", call_time: "10:00" });

  assert.equal(raw.call_slot, "Wed 2 Sep, 10:00–11:00");
  // Both halves stay available raw, for anything sorting or diarising by them.
  assert.equal(raw.call_date, "2026-09-02");
  assert.equal(raw.call_time, "10:00");
});

test("an unusable booking answer produces no slot at all, rather than a plausible one", () => {
  // A booking question that failed to parse twice is stored as the golfer's raw
  // text. A slot assembled out of that would read as an appointment nobody
  // holds — the one thing worth being strict about, because this lead type is
  // the only one carrying a commitment to a specific hour.
  for (const answers of [
    { call_date: "next tuesday-ish", call_time: "10:00" },
    { call_date: "2026-09-02", call_time: "sometime in the morning" },
    { call_date: "2026-09-02" },
    { call_time: "10:00" },
    {},
    // A date the regex accepts and the calendar does not.
    { call_date: "2026-02-31", call_time: "10:00" },
  ]) {
    assert.equal(toIndweRaw(answers).call_slot, "", JSON.stringify(answers));
  }
});

test("every province the conversation can produce has a label", () => {
  const provinces = [
    "eastern_cape", "free_state", "gauteng", "kwazulu_natal", "limpopo",
    "mpumalanga", "north_west", "northern_cape", "western_cape",
  ];

  for (const p of provinces) {
    const label = provinceLabel(p);
    assert.notEqual(label, "", p);
    assert.equal(label.includes("_"), false, `${p} was not translated`);
  }

  // An answer that failed to parse is stored as the golfer's own words. Passing
  // it through beats a blank, and must not throw.
  assert.equal(provinceLabel("somewhere near Knysna"), "somewhere near Knysna");
  assert.equal(provinceLabel(undefined), "");
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
