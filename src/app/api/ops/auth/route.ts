/**
 * Sign-in for the internal ops dashboard.
 *
 * The passphrase is posted as a form field, never placed in the URL — the root
 * layout injects GTM, GA4, Plausible and Google Ads on every page, so a key in
 * a query string would be shipped to four analytics vendors as a page path.
 * On success we set an httpOnly cookie and redirect; the passphrase itself is
 * never stored in the cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { OPS_COOKIE, opsSessionToken } from "@/lib/ops/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.OPS_DASHBOARD_KEY;
  const form = await req.formData();
  const supplied = String(form.get("key") ?? "");

  if (!secret) {
    return NextResponse.redirect(new URL("/ops?e=unconfigured", req.url), 303);
  }

  const a = createHmac("sha256", secret).update(supplied).digest();
  const b = createHmac("sha256", secret).update(secret).digest();
  if (!timingSafeEqual(a, b)) {
    return NextResponse.redirect(new URL("/ops?e=denied", req.url), 303);
  }

  const res = NextResponse.redirect(new URL("/ops", req.url), 303);
  res.cookies.set(OPS_COOKIE, opsSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
