import { NextRequest, NextResponse } from "next/server";
import { voucherSchema } from "@/lib/validation";
import { appendSubmission } from "@/lib/sheets";
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

  // Guard: if storage (Sheets) is not yet configured, don't initiate payments
  // we can't record. Better to show a friendly maintenance message than to
  // accept money we can't reconcile.
  if (!process.env.SHEETS_WEBAPP_URL || !process.env.SHEETS_SECRET) {
    return NextResponse.json(
      {
        error:
          "Online voucher purchases are temporarily offline while we finish migrating to our new payment system. Please email johannes@getluckygolfclub.com to buy a swing and we'll come right back to you.",
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
  const timestamp = new Date().toISOString();

  const sheetRow = {
    Timestamp: timestamp,
    Reference: reference,
    Status: "pending",
    Tier: tier.label,
    Amount: d.entryAmount,
    Prize: tier.prize,
    Course: d.course,
    "Buyer Name": d.fullName,
    "Buyer Email": d.email || "",
    "Buyer Mobile": d.mobile,
    For: d.purchaseFor,
    "Recipient Name": d.recipientName || "",
    "Recipient Email": d.recipientEmail || "",
    "Personal Message": d.personalMessage || "",
    "Promo Code": d.promoCode || "",
    "PayFast PaymentID": "",
  };

  // Record pending row first; payment confirmation arrives via /api/payfast/notify
  try {
    await appendSubmission("voucher", sheetRow);
  } catch (err) {
    console.error("Voucher pending row failed", err);
    // Continue anyway — payment can still proceed; we'll backfill on notify
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
