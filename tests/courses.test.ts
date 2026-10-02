/**
 * Course names: the dropdown spelling, and old spellings still in the
 * database. "Mosselbay Golf Club" was renamed "Mossel Bay Golf Club"; entries
 * saved before then keep the old name, and a form loaded before the rename
 * still sends it.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const { COURSES, COURSE_SLUGS, LEGACY_COURSE_NAMES, canonicalCourse } = await import(
  "../src/lib/constants.ts"
);
const { freeEntrySchema } = await import("../src/lib/validation.ts");

test("the dropdown says Mossel Bay, not Mosselbay", () => {
  assert.ok(COURSES.includes("Mossel Bay Golf Club"));
  assert.ok(!(COURSES as readonly string[]).includes("Mosselbay Golf Club"));
});

test("every old spelling points at a course that still exists", () => {
  for (const [old, current] of Object.entries(LEGACY_COURSE_NAMES)) {
    assert.ok(current in COURSE_SLUGS, `${old} → ${current} is not a current course`);
    assert.ok(!(old in COURSE_SLUGS), `${old} is still a current course name`);
  }
});

test("canonicalCourse maps the old spelling and leaves everything else alone", () => {
  assert.equal(canonicalCourse("Mosselbay Golf Club"), "Mossel Bay Golf Club");
  assert.equal(canonicalCourse("Mossel Bay Golf Club"), "Mossel Bay Golf Club");
  assert.equal(canonicalCourse("Atlantic Beach"), "Atlantic Beach");
  assert.equal(canonicalCourse("Nowhere Golf Club"), "Nowhere Golf Club");
});

test("an old spelling from a stale form is accepted and stored under the new one", () => {
  const parsed = freeEntrySchema.safeParse({
    name: "Test Golfer",
    mobile: "082 555 1234",
    course: "Mosselbay Golf Club",
    consentTerms: true,
  });
  assert.ok(parsed.success);
  assert.equal(parsed.data.course, "Mossel Bay Golf Club");
});

test("a course that is not on the list is still refused", () => {
  const parsed = freeEntrySchema.safeParse({
    name: "Test Golfer",
    mobile: "082 555 1234",
    course: "Nowhere Golf Club",
    consentTerms: true,
  });
  assert.ok(!parsed.success);
});

test("old Mossel Bay entries still resolve to the club's membership page", () => {
  const slug = COURSE_SLUGS[canonicalCourse("Mosselbay Golf Club") as keyof typeof COURSE_SLUGS];
  assert.equal(slug, "mossel-bay");
});
