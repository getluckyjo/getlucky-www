import { NextRequest, NextResponse } from "next/server";
import { updateVoucherStatus, readSubmissions, SubmissionType } from "@/lib/sheets";
import { sendSubmissionNotification, sendVoucherConfirmation } from "@/lib/email";
import { verifyNotifySignature, validateNotifyServerSide, isPayfastSourceIpValid } from "@/lib/payfast";
import { PRIZE_TIERS } from "@/lib/constants";

export const runtime = "nodejs";

/**
 * Reference prefixes:
 *   GL-...  → online voucher purchase (/buy-a-swing)  → "voucher" tab
 *   GLE-... → in-person course entry  (/form)         → "entry" tab
 *
 * GLG-... (memberships) NEVER hit this webhook — they go directly to the
 * membership site's own webhook at membership.getluckygolfclub.com.
 */
function tabForReference(ref: string): SubmissionType {
  if (ref.startsWith("GLE-")) return "entry";
  return "voucher";
}

/**
 * PayFast Instant Transaction Notification (ITN) handler.
 * Per PayFast docs, validate:
 *   0. source IP resolves to a known PayFast host (defence-in-depth, fail-open)
 *   1. signature matches
 *   2. server-side: post the body back to PayFast and expect "VALID"
 *   3. amount matches what we expected (trust the row in the Sheet)
 *   4. payment_status === "COMPLETE"
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const params = new URLSearchParams(rawBody);
  const fields = Object.fromEntries(params.entries());

  const reference = fields.m_payment_id || "";
  const status = fields.payment_status || "";
  const signature = fields.signature || "";
  const amountGross = fields.amount_gross || "";
  const pfPaymentId = fields.pf_payment_id || "";

  // 0. Source IP (defence-in-depth). Vercel puts the real client IP first in
  //    x-forwarded-for. Only reject when we positively identify a non-PayFast
  //    IP — the check is fail-open (see isPayfastSourceIpValid) so a DNS hiccup
  //    can't drop a genuine paid-entry notification.
  const sourceIp = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim()
    || req.headers.get("x-real-ip");
  if (!(await isPayfastSourceIpValid(sourceIp))) {
    console.warn("PayFast ITN from non-PayFast source IP", { reference, sourceIp });
    return NextResponse.json({ error: "bad source" }, { status: 403 });
  }

  // 1. Signature
  if (!verifyNotifySignature(rawBody, signature)) {
    console.warn("PayFast ITN signature mismatch", { reference });
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  // 2. Server-side validation
  const validated = await validateNotifyServerSide(rawBody).catch(() => false);
  if (!validated) {
    console.warn("PayFast ITN server-side validation failed", { reference });
    return NextResponse.json({ error: "validation failed" }, { status: 400 });
  }

  // 3. Cross-check the row we recorded — look in the correct tab
  const tab = tabForReference(reference);
  const rows = await readSubmissions(tab).catch(() => [] as Record<string, string>[]);
  const row = rows.find((r) => r.Reference === reference);

  if (!row) {
    console.warn("PayFast ITN unknown reference", { reference, tab });
    // Still respond 200 so PayFast doesn't keep retrying — we'll log
    return new Response("OK", { status: 200 });
  }

  const expected = Number(row.Amount || 0).toFixed(2);
  if (amountGross && Number(amountGross).toFixed(2) !== expected) {
    console.warn("PayFast ITN amount mismatch", { reference, expected, got: amountGross });
    return NextResponse.json({ error: "amount mismatch" }, { status: 400 });
  }

  // 4. Status — only treat COMPLETE as paid
  if (status !== "COMPLETE") {
    await updateVoucherStatus(reference, {
      Status: status.toLowerCase() || "unknown",
      "PayFast PaymentID": pfPaymentId,
    }).catch(console.error);
    return new Response("OK", { status: 200 });
  }

  await updateVoucherStatus(reference, {
    Status: "paid",
    "PayFast PaymentID": pfPaymentId,
  }).catch(console.error);

  const tier = PRIZE_TIERS.find((t) => t.label === row.Tier);

  // Determine recipient: for entry rows the buyer IS the player; for voucher rows
  // it may be a gift to someone else.
  let recipientEmail: string;
  let recipientName: string;
  if (tab === "voucher") {
    const isGift = row.For === "someone-else";
    recipientEmail = isGift && row["Recipient Email"] ? row["Recipient Email"] : row["Buyer Email"];
    recipientName = isGift && row["Recipient Name"] ? row["Recipient Name"] : row["Buyer Name"];
  } else {
    recipientEmail = row.Email || "";
    recipientName = row.Name || "";
  }

  // Notification email body — shape it sensibly for the tab type
  const notifyPayload =
    tab === "voucher"
      ? {
          Reference: reference,
          Tier: row.Tier,
          Amount: row.Amount,
          Prize: row.Prize,
          Course: row.Course,
          "Buyer Name": row["Buyer Name"],
          "Buyer Email": row["Buyer Email"],
          "Buyer Mobile": row["Buyer Mobile"],
          For: row.For,
          "Recipient Name": row["Recipient Name"],
          "Recipient Email": row["Recipient Email"],
          "Personal Message": row["Personal Message"],
          "Promo Code": row["Promo Code"],
          "PayFast PaymentID": pfPaymentId,
        }
      : {
          Reference: reference,
          Source: "/form (course QR entry)",
          Date: row.Date,
          Tier: row.Tier,
          Amount: row.Amount,
          Prize: row.Prize,
          Course: row.Course,
          Name: row.Name,
          Email: row.Email,
          Mobile: row.Mobile,
          "PayFast PaymentID": pfPaymentId,
        };

  // For voucher purchases, also email a redeemable confirmation to the recipient.
  // For /form entries, the player is on-course right now — no voucher email needed.
  const shouldSendVoucherEmail = tab === "voucher" && recipientEmail && tier;

  await Promise.allSettled([
    sendSubmissionNotification("voucher", notifyPayload),
    shouldSendVoucherEmail
      ? sendVoucherConfirmation({
          to: recipientEmail,
          recipientName,
          tierLabel: tier!.label,
          prize: tier!.prize,
          course: row.Course,
          reference,
          amount: Number(row.Amount),
        })
      : Promise.resolve(),
  ]);

  return new Response("OK", { status: 200 });
}
