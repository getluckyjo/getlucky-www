import { NextRequest, NextResponse } from "next/server";
import { updateVoucherStatus, readSubmissions, SubmissionType } from "@/lib/sheets";
import { sendSubmissionNotification, sendVoucherConfirmation, sendOpsAlert } from "@/lib/email";
import { verifyNotifySignature, validateNotifyServerSide, isPayfastSourceIpValid } from "@/lib/payfast";
import { PRIZE_TIERS } from "@/lib/constants";
import {
  isDbConfigured,
  markPaid,
  markStatus,
  getVoucher,
  getEntry,
  voucherToSheet,
  entryToSheet,
  backfillEntryContact,
  type EntryRow,
} from "@/lib/db";
import { notifyWhatsAppChannel } from "@/lib/whatsapp";

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
 *   1. signature matches — advisory: a mismatch alerts and continues, because
 *      PayFast has changed its ITN signature construction under us before
 *      (Aug 2026) and a signature we cannot reproduce is not proof the payment
 *      is fake. Step 2 is what actually proves the ITN genuine.
 *   2. server-side: post the body back to PayFast and expect "VALID"
 *   3. amount matches what we expected (trust the row in the Sheet)
 *   4. payment_status === "COMPLETE"
 *
 * Every rejection and every failed write sends an ops alert. This route ran
 * for three weeks in Aug 2026 rejecting real ITNs into a console warning
 * nobody read; ~30 entries sat `pending` as a result. Nothing here is allowed
 * to fail quietly again.
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

  // /form no longer asks for a name or an email — PayFast collects both on its
  // own checkout, which is a page the golfer is already on, and returns them
  // here. This is the only place they enter our records.
  const itnName = [fields.name_first, fields.name_last].filter(Boolean).join(" ").trim();
  const itnEmail = (fields.email_address || "").trim();

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

  // 1. Signature (advisory — see the note on this handler)
  const sig = verifyNotifySignature(rawBody, signature);
  if (!sig.ok) {
    console.warn("PayFast ITN signature mismatch", {
      reference,
      fields: sig.fieldNames.join(","),
      emptyFields: sig.emptyFieldNames.join(",") || "(none)",
      matchedWithoutPassphrase: sig.matchedWithoutPassphrase,
    });
    await sendOpsAlert({
      subject: `[ALERT] PayFast ITN signature mismatch (${reference || "no reference"})`,
      heading: "PayFast ITN signature could not be reproduced",
      body:
        "The notification was NOT dropped — it still has to pass PayFast's own server-side " +
        "validation below before anything is marked paid. But our signature construction no " +
        "longer matches PayFast's, which means the ITN payload or the passphrase has changed. " +
        "Fix that before it hides a real problem.",
      detail: {
        reference,
        payment_status: status,
        amount_gross: amountGross,
        pf_payment_id: pfPaymentId,
        source_ip: sourceIp,
        fields_received: sig.fieldNames.join(", "),
        empty_valued_fields: sig.emptyFieldNames.join(", ") || "(none)",
        matched_without_passphrase: sig.matchedWithoutPassphrase || "(no variant matched)",
      },
    });
  }

  // 2. Server-side validation — authoritative. PayFast confirms the payload is
  //    a real transaction of theirs, which is exactly the proof the signature
  //    was standing in for.
  const postback = await validateNotifyServerSide(rawBody);
  const genuine = postback.valid || (postback.reachable === false && sig.ok);
  if (!genuine) {
    console.warn("PayFast ITN rejected", {
      reference,
      postback: postback.detail,
      reachable: postback.reachable,
      signatureOk: sig.ok,
    });
    await sendOpsAlert({
      subject: `[ALERT] PayFast ITN rejected (${reference || "no reference"})`,
      heading: "A PayFast ITN was rejected and NOT recorded",
      body: postback.reachable
        ? "PayFast's server-side validation did not answer VALID for this notification."
        : "PayFast's validation endpoint was unreachable and the signature did not verify, " +
          "so we could not prove the notification is genuine.",
      detail: {
        reference,
        payment_status: status,
        amount_gross: amountGross,
        pf_payment_id: pfPaymentId,
        postback: postback.detail,
        postback_reachable: postback.reachable,
        signature_ok: sig.ok,
      },
    });
    return NextResponse.json({ error: "validation failed" }, { status: 400 });
  }

  // 3. Cross-check the row we recorded. Postgres is the read source-of-record
  //    when configured (fast + reliable, unlike the 8s Apps Script which can
  //    hang during a redeploy and drop a genuine paid notification); fall back
  //    to Sheets otherwise. Either path yields a Sheet-shaped `row` so the rest
  //    of this handler is unchanged.
  const tab = tabForReference(reference);
  let row: Record<string, string> | undefined;
  // Held alongside the Sheet-shaped view: the WhatsApp handoff needs the
  // consent tick, which entryToSheet does not carry.
  let entryRec: EntryRow | null = null;
  if (isDbConfigured()) {
    if (tab === "entry") {
      const rec = await getEntry(reference).catch((err) => {
        console.error("PayFast ITN DB getEntry failed", { reference, err });
        return null;
      });
      entryRec = rec;
      row = rec ? entryToSheet(rec) : undefined;
    } else {
      const rec = await getVoucher(reference).catch((err) => {
        console.error("PayFast ITN DB getVoucher failed", { reference, err });
        return null;
      });
      row = rec ? voucherToSheet(rec) : undefined;
    }
  } else {
    const rows = await readSubmissions(tab).catch(() => [] as Record<string, string>[]);
    row = rows.find((r) => r.Reference === reference);
  }

  if (!row) {
    console.warn("PayFast ITN unknown reference", { reference, tab });
    await sendOpsAlert({
      subject: `[ALERT] PayFast ITN for an unknown reference (${reference || "no reference"})`,
      heading: "Money moved for a reference we have no row for",
      body: "The ITN validated but there is no matching entry/voucher row, so nothing was marked paid.",
      detail: { reference, tab, payment_status: status, amount_gross: amountGross, pf_payment_id: pfPaymentId },
    });
    // Still respond 200 so PayFast doesn't keep retrying — we'll log
    return new Response("OK", { status: 200 });
  }

  const expected = Number(row.Amount || 0).toFixed(2);
  if (amountGross && Number(amountGross).toFixed(2) !== expected) {
    console.warn("PayFast ITN amount mismatch", { reference, expected, got: amountGross });
    await sendOpsAlert({
      subject: `[ALERT] PayFast ITN amount mismatch (${reference})`,
      heading: "A PayFast ITN was rejected on an amount mismatch",
      detail: { reference, tab, expected, received: amountGross, pf_payment_id: pfPaymentId },
    });
    return NextResponse.json({ error: "amount mismatch" }, { status: 400 });
  }

  // Postgres is the durable system-of-record; map the Sheet tab to its table.
  const dbTable = tab === "entry" ? "entries" : "vouchers";

  // 4. Status — only treat COMPLETE as paid
  if (status !== "COMPLETE") {
    const newStatus = status.toLowerCase() || "unknown";
    await updateVoucherStatus(reference, {
      Status: newStatus,
      "PayFast PaymentID": pfPaymentId,
    }).catch((err) => reportWriteFailure("Sheets status update", reference, tab, err));
    if (isDbConfigured()) {
      await markStatus(dbTable, reference, newStatus, pfPaymentId).catch((err) =>
        reportWriteFailure("Postgres markStatus", reference, tab, err),
      );
    }
    return new Response("OK", { status: 200 });
  }

  await updateVoucherStatus(reference, {
    Status: "paid",
    "PayFast PaymentID": pfPaymentId,
    // Entry rows are written with blank Name/Email and filled in here. Voucher
    // rows use different column names and already carry their buyer's details.
    ...(tab === "entry" && itnName ? { Name: itnName } : {}),
    ...(tab === "entry" && itnEmail ? { Email: itnEmail } : {}),
  }).catch((err) => reportWriteFailure("Sheets paid update", reference, tab, err));

  // Idempotency gate: markPaid returns true only on the first not-paid → paid
  // transition. PayFast resends ITNs, so without this gate a resend would
  // re-send the confirmation emails. When the DB isn't configured we keep the
  // legacy behaviour and always send. Fail-open on DB error: a DB hiccup should
  // not silently swallow a genuine paid customer's confirmation.
  let firstPaidTransition = true;
  if (isDbConfigured()) {
    firstPaidTransition = await markPaid(dbTable, reference, pfPaymentId).catch((err) => {
      console.error("PayFast ITN markPaid failed", { reference, err });
      void reportWriteFailure("Postgres markPaid", reference, tab, err);
      return true;
    });
  }
  if (!firstPaidTransition) {
    return new Response("OK", { status: 200 });
  }

  // Backfill Postgres before anything downstream reads the row: the ops
  // notification, the WhatsApp handoff and the Indwe feed all want a name.
  // Only fills what is empty — a value already on the row is never clobbered.
  if (tab === "entry" && entryRec && isDbConfigured()) {
    const patch: { name?: string; email?: string } = {};
    if (!entryRec.name && itnName) patch.name = itnName;
    if (!entryRec.email && itnEmail) patch.email = itnEmail;
    if (patch.name || patch.email) {
      const written = await backfillEntryContact(reference, patch).then(
        () => true,
        (err) => {
          console.error("PayFast ITN entry contact backfill failed", { reference, err });
          void reportWriteFailure("Postgres backfillEntryContact", reference, tab, err);
          return false;
        },
      );
      // Carry the values locally either way. The money is recorded and the
      // golfer is owed their confirmation; a failed write should not also
      // strip the name off the email and the WhatsApp handoff.
      entryRec = { ...entryRec, ...patch };
      row = entryToSheet(entryRec);
      if (!written) console.warn("PayFast ITN using un-persisted contact details", { reference });
    }
  }

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

  // Hand a PAID course entry to the WhatsApp channel. This is the moment the
  // golfer has actually entered — see the note in /api/forms/entry, where this
  // used to run on form submission and messaged people who never paid.
  //
  // Inside the first-paid-transition gate above, so a resent ITN cannot hand
  // the same golfer over twice. Handed over whether or not they opted in: the
  // channel records both and messages only the ones who did, which is how we
  // can show entering never required agreeing to WhatsApp.
  //
  // Runs alongside the emails rather than before them, so its 4s timeout does
  // not add to the ten seconds PayFast allows for this response.
  if (tab === "entry" && !entryRec) {
    // Sheets-only fallback: the Sheet has no consent column, so we cannot know
    // what the golfer chose and will not message them. Legacy path — Postgres
    // is configured in production — but say so rather than going quiet.
    console.warn("PayFast ITN: no DB entry row, skipping WhatsApp handoff", { reference });
  }

  const handoff =
    tab === "entry" && entryRec
      ? notifyWhatsAppChannel({
          name: entryRec.name || "",
          mobile: entryRec.mobile || "",
          email: entryRec.email,
          course: entryRec.course || "",
          whatsappOptIn: entryRec.consent_whatsapp === true,
          formVersion: entryRec.consent_form_version,
        })
      : Promise.resolve(null);

  const [emailResults, handoffResult] = await Promise.all([
    Promise.allSettled([
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
    ]),
    handoff,
  ]);

  // A paid golfer who never reaches the WhatsApp channel is a lead bought and
  // thrown away — quieter than a failed payment, but it is still money spent.
  if (handoffResult && !handoffResult.ok) {
    console.error("PayFast ITN WhatsApp handoff failed", {
      reference,
      detail: handoffResult.detail,
    });
    await sendOpsAlert({
      subject: `[ALERT] Paid entry recorded but the WhatsApp handoff failed (${reference})`,
      heading: "Payment recorded, WhatsApp channel never got the entry",
      body:
        "The golfer has paid and the entry is marked paid, so nothing is owed. But the " +
        "WhatsApp channel was never told, so they will not get the follow-up. Hand it over " +
        "by hand, or re-POST the entry to the channel's /api/entries.",
      detail: { reference, tab, detail: handoffResult.detail ?? "(no detail)" },
    });
  }

  // allSettled swallows rejections by design; say something when it does. A
  // paid golfer whose confirmation silently failed is invisible otherwise.
  const emailErrors = emailResults
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)));
  if (emailErrors.length) {
    console.error("PayFast ITN confirmation email failed", { reference, emailErrors });
    await sendOpsAlert({
      subject: `[ALERT] Paid ${tab} recorded but its confirmation email failed (${reference})`,
      heading: "Payment recorded, confirmation email did not send",
      detail: { reference, tab, recipient: recipientEmail, errors: emailErrors.join(" | ") },
    });
  }

  return new Response("OK", { status: 200 });
}

/**
 * A write that fails after the money has moved is the worst kind of silence:
 * PayFast is satisfied, the golfer is charged, and our records say pending.
 */
async function reportWriteFailure(what: string, reference: string, tab: string, err: unknown) {
  console.error(`PayFast ITN ${what} failed`, { reference, err });
  await sendOpsAlert({
    subject: `[ALERT] PayFast ITN could not record a payment (${reference})`,
    heading: `${what} failed after a PayFast payment`,
    body: "PayFast has confirmed this payment. Our record of it did not save — reconcile by hand.",
    detail: { reference, tab, failure: what, error: err instanceof Error ? err.message : String(err) },
  });
}
