import { NextRequest, NextResponse } from "next/server";
import { entrySchema } from "@/lib/validation";
import { appendSubmission } from "@/lib/sheets";
import { isDbConfigured, createEntry } from "@/lib/db";
import { buildPaymentRequest, processUrl } from "@/lib/payfast";
import { PRIZE_TIERS } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Same Sheets guard as /api/forms/voucher — don't accept money we can't record
  if (!process.env.SHEETS_WEBAPP_URL || !process.env.SHEETS_SECRET) {
    return NextResponse.json(
      {
        error:
          "Online entries are temporarily offline while we finish migrating to our new payment system. Please ask a marshal at the tee or email johannes@getluckygolfclub.com.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = entrySchema.safeParse(body);
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
  if (!tier) return NextResponse.json({ error: "Invalid entry amount" }, { status: 400 });

  const reference = makeReference();
  const now = new Date();
  const timestamp = now.toISOString();
  // Entry date is auto-captured (the form no longer asks). Use the request
  // wall-clock as the play date — accurate enough for QR-at-the-tee usage.
  const entryDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const sheetRow = {
    Timestamp: timestamp,
    Reference: reference,
    Status: "pending",
    Date: entryDate,
    Tier: tier.label,
    Amount: d.entryAmount,
    Prize: tier.prize,
    Course: d.course,
    Name: d.name,
    Email: d.email || "",
    Mobile: d.mobile,
    "PayFast PaymentID": "",
  };

  // Postgres is the durable system-of-record (Sheets is now a mirror). Write it
  // first and fail closed: if we can't record the pending row, don't take the
  // payment. Skipped entirely until Supabase is configured, so the Sheets-only
  // flow keeps working during rollout.
  if (isDbConfigured()) {
    try {
      await createEntry({
        reference,
        status: "pending",
        entry_date: entryDate,
        tier: tier.label,
        amount: d.entryAmount,
        prize: tier.prize,
        course: d.course,
        name: d.name,
        email: d.email || null,
        mobile: d.mobile,
      });
    } catch (err) {
      console.error("Entry DB write failed", err);
      return NextResponse.json(
        {
          error:
            "We couldn't record your entry just now. Please try again in a moment, or ask a marshal at the tee.",
        },
        { status: 503 },
      );
    }
  }

  // Fail closed: if we can't record the pending row, don't take the payment.
  // The env-var guard above only proves the env is set, not that Sheets is up.
  try {
    await appendSubmission("entry", sheetRow);
  } catch (err) {
    console.error("Entry pending row failed", err);
    return NextResponse.json(
      {
        error:
          "We couldn't record your entry just now. Please try again in a moment, or ask a marshal at the tee.",
      },
      { status: 503 },
    );
  }

  let fields: Record<string, string>;
  try {
    fields = buildPaymentRequest({
      amount: d.entryAmount,
      itemName: `${tier.label} — Get Lucky Hole-in-One Challenge`,
      itemDescription: `Course entry for ${d.course} on ${entryDate}, win ${tier.prize}`,
      reference,
      buyerName: d.name,
      buyerEmail: d.email || "",
      buyerMobile: d.mobile,
      customStr1: d.course,
      customStr2: `entry:${entryDate}`,
      returnPath: "/form/success",
      cancelPath: "/form/cancel",
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
  return `GLE-${ts}-${rand}`;
}

function flattenErrors(fe: Record<string, string[] | undefined>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fe)) if (v?.[0]) out[k] = v[0];
  return out;
}
