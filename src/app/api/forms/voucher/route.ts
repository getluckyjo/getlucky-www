import { NextRequest, NextResponse } from "next/server";
import { voucherSchema } from "@/lib/validation";
import { isDbConfigured, createVoucher } from "@/lib/db";
import { buildPaymentRequest, processUrl } from "@/lib/payfast";
import { PRIZE_TIERS } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Guard: don't initiate payments we can't record. Postgres is the only store
  // now that the Sheets mirror is gone. Better a friendly maintenance message
  // than money we cannot reconcile.
  if (!isDbConfigured()) {
    console.error("Voucher purchase attempted with no database configured");
    return NextResponse.json(
      {
        error:
          "Online voucher purchases are temporarily offline. Please email johannes@getluckygolfclub.com to buy a swing and we'll come right back to you.",
      },
      { status: 503 },
    );
  }

  const parsed = voucherSchema.safeParse(body);
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
  const tier = PRIZE_TIERS.find((t) => t.entryAmount === d.entryAmount);
  if (!tier) {
    return NextResponse.json({ error: "Invalid entry amount" }, { status: 400 });
  }

  const reference = makeReference();


  // Postgres is the durable system-of-record (Sheets is now a mirror). Write it
  // first; fail-soft like the Sheets path below — the notify webhook upserts the
  // paid status by reference, so a missed pending row still reconciles.
  {
    try {
      await createVoucher({
        reference,
        status: "pending",
        tier: tier.label,
        amount: d.entryAmount,
        prize: tier.prize,
        course: d.course,
        buyer_name: d.fullName,
        buyer_email: d.email || null,
        buyer_mobile: d.mobile,
        purchase_for: d.purchaseFor,
        recipient_name: d.recipientName || null,
        recipient_email: d.recipientEmail || null,
        personal_message: d.personalMessage || null,
        promo_code: d.promoCode || null,
      });
    } catch (err) {
      // Fails closed now the Sheets mirror is gone. It used to continue on the
      // grounds that /api/payfast/notify would backfill by reference — but
      // notify cannot backfill a row that was never written, and with no Sheet
      // behind it that would mean taking money with no record anywhere.
      console.error("Voucher DB write failed", err);
      return NextResponse.json(
        {
          error:
            "We couldn't record your purchase just now. Please try again in a moment.",
        },
        { status: 503 },
      );
    }
  }

  let fields: Record<string, string>;
  try {
    fields = buildPaymentRequest({
      amount: d.entryAmount,
      itemName: `${tier.label} — Get Lucky Hole-in-One Challenge`,
      itemDescription: `Swing voucher for ${d.course}, win ${tier.prize}`,
      reference,
      buyerName: d.fullName,
      buyerEmail: d.email || "",
      buyerMobile: d.mobile,
      customStr1: d.course,
      customStr2: d.purchaseFor === "someone-else" ? `gift:${d.recipientEmail}` : "",
    });
  } catch (err) {
    console.error("PayFast build failed", err);
    return NextResponse.json(
      { error: "Payment is not configured yet. Please try again shortly." },
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

function makeReference() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `GL-${ts}-${rand}`;
}

function flattenErrors(fe: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fe)) if (v?.[0]) out[k] = v[0];
  return out;
}
