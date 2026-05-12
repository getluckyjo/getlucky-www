import { NextRequest, NextResponse } from "next/server";
import { buildPaymentRequest, processUrl } from "@/lib/payfast";
import { MEMBERSHIP, COURSE_SLUGS } from "@/lib/constants";
import { membershipSchema } from "@/lib/validation";

export const runtime = "nodejs";

/**
 * /api/forms/membership — Get Lucky Club signup from /form.
 *
 * Integrates with the existing membership backend at
 * `membership.getluckygolfclub.com` rather than maintaining a parallel data
 * store. Mirrors the membership site's PayFast payload exactly so paid
 * subscriptions land directly in its database via its webhook.
 */

const MEMBERSHIP_HOST = "https://membership.getluckygolfclub.com";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = membershipSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors),
      },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const slug = COURSE_SLUGS[d.course as keyof typeof COURSE_SLUGS];
  if (!slug) {
    // Belt-and-braces: schema already restricts to COURSES, but if a label is
    // ever added there without a matching slug we want to fail before payment.
    return NextResponse.json(
      { error: "This course isn't set up for membership yet. Please email johannes@getluckygolfclub.com." },
      { status: 400 },
    );
  }

  const reference = `GLG-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  let fields: Record<string, string>;
  try {
    fields = buildPaymentRequest({
      amount: MEMBERSHIP.amount,
      itemName: "Get Lucky Hole-in-One Membership",
      itemDescription: `Monthly membership - ${d.course}`,
      reference,
      buyerName: d.name,
      buyerEmail: d.email || "",
      buyerMobile: d.mobile,
      // custom_str1 carries the club so the membership backend can attribute
      // the subscriber to the right course on its end.
      customStr1: slug,
      subscription: {
        recurringAmount: MEMBERSHIP.amount,
        frequency: 3, // monthly
        cycles: 0, // unlimited
      },
      urls: {
        notifyUrl: `${MEMBERSHIP_HOST}/api/webhooks/payfast`,
        returnUrl: `${MEMBERSHIP_HOST}/join/${slug}/success`,
        cancelUrl: `${MEMBERSHIP_HOST}/join/${slug}/cancelled`,
      },
    });
  } catch (err) {
    console.error("PayFast membership build failed", err);
    return NextResponse.json(
      { error: "Membership signup is not configured yet. Please try again shortly." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    reference,
    processUrl: processUrl(),
    fields,
  });
}

function flattenErrors(fe: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fe)) if (v?.[0]) out[k] = v[0];
  return out;
}
