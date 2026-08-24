/**
 * Credentials must not reach the logs.
 *
 * Run with: npm test  (node --test, no test framework dependency)
 *
 * On 24 August 2026 a typo in WHATSAPP_DATABASE_URL made @neondatabase/serverless
 * throw an error containing the entire connection string. The route logged that
 * message, so a live database password was written into the platform log and had
 * to be rotated. The first case below is that exact message.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

const { redactSecrets, safeErrorMessage } = await import("../src/lib/redact.ts");

test("the message that actually leaked is redacted", () => {
  const leaked =
    "Database connection string provided to `neon()` is not a valid URL. " +
    "Connection string: postgresql://getlucky_www_ro:hunter2@ep-x-1.aws.neon.tech/neondb?sslmode=require";

  const safe = redactSecrets(leaked);

  assert.ok(!safe.includes("hunter2"), "password survived redaction");
  // The role name is kept: knowing which role failed is the useful half of the
  // diagnosis, and it is not a secret.
  assert.ok(safe.includes("getlucky_www_ro"));
  assert.ok(safe.includes("REDACTED"));
});

test("redacts every credential in a message, not just the first", () => {
  const two =
    "primary postgres://a:secret1@host/db failed, fallback postgres://b:secret2@host2/db also failed";
  const safe = redactSecrets(two);

  assert.ok(!safe.includes("secret1"));
  assert.ok(!safe.includes("secret2"));
});

test("handles other schemes, since the next careless driver may not be Postgres", () => {
  assert.ok(!redactSecrets("redis://user:pw@h:6379").includes("pw"));
  assert.ok(!redactSecrets("https://svc:tok@api.example.com/x").includes("tok"));
});

test("leaves a message with no credentials alone", () => {
  const plain = "relation \"lead_pushes\" does not exist";
  assert.equal(redactSecrets(plain), plain);
});

test("does not mangle a URL that has no credentials in it", () => {
  const url = "failed to reach https://api.example.com/v1/leads?since=2026-08-01";
  assert.equal(redactSecrets(url), url);
});

test("safeErrorMessage copes with whatever a catch block hands it", () => {
  assert.equal(
    safeErrorMessage(new Error("postgres://u:p@h/db")),
    "postgres://u:REDACTED@h/db",
  );
  assert.equal(safeErrorMessage("postgres://u:p@h/db"), "postgres://u:REDACTED@h/db");
  assert.equal(safeErrorMessage(null), "null");
});
