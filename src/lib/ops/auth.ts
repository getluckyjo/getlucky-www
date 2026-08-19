/**
 * Shared-secret gate for /ops. Deliberately simple: two founders, one
 * passphrase, no user table. The cookie carries a derived token rather than the
 * passphrase, so reading the cookie does not hand over the secret.
 */

import { createHmac, timingSafeEqual } from "crypto";

export const OPS_COOKIE = "gl_ops";

export function opsSessionToken(secret: string): string {
  return createHmac("sha256", secret).update("ops-session-v1").digest("hex");
}

export function isOpsSessionValid(cookieValue: string | undefined): boolean {
  const secret = process.env.OPS_DASHBOARD_KEY;
  if (!secret || !cookieValue) return false;
  const expected = Buffer.from(opsSessionToken(secret), "utf8");
  const got = Buffer.from(cookieValue, "utf8");
  if (expected.length !== got.length) return false;
  return timingSafeEqual(expected, got);
}
