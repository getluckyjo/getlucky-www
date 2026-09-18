import { NextRequest, NextResponse } from "next/server";
import { listVouchers, listLeads, voucherToSheet, leadToSheet } from "@/lib/db";

export const runtime = "nodejs";

/** What a sponsor is allowed to ask for. */
type SponsorType = "partner" | "corporate" | "voucher";

const VALID_TYPES: SponsorType[] = ["partner", "corporate", "voucher"];

// Source records for a sponsor-visible type. Postgres only — the Sheets read
// that used to back this went with the Apps Script. Rows still come back
// Sheet-shaped, via the db adapters, so every caller is unchanged.
async function recordsForType(
  t: SponsorType,
  since?: string,
): Promise<Record<string, string>[]> {
  switch (t) {
    case "voucher":
      return (await listVouchers(since)).map(voucherToSheet);
    case "partner":
      return (await listLeads("partner", since)).map((r) => leadToSheet("partner", r));
    case "corporate":
      return (await listLeads("corporate", since)).map((r) => leadToSheet("corporate", r));
  }
}

export async function GET(req: NextRequest) {
  const expected = process.env.SPONSOR_API_KEY;
  if (!expected) {
    return NextResponse.json({ error: "Sponsor API not configured" }, { status: 503 });
  }

  const auth = req.headers.get("authorization") || "";
  const provided = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  if (provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const typeParam = (url.searchParams.get("type") || "voucher") as SponsorType;
  const since = url.searchParams.get("since") || undefined;

  if (!VALID_TYPES.includes(typeParam)) {
    return NextResponse.json(
      { error: `type must be one of: ${VALID_TYPES.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const records = await recordsForType(typeParam, since || undefined);
    // For voucher type, only return paid entries to sponsors by default
    const filtered = typeParam === "voucher"
      ? records.filter((r) => String(r.Status || "").toLowerCase() === "paid")
      : records;

    return NextResponse.json({
      type: typeParam,
      count: filtered.length,
      entries: filtered,
    });
  } catch (err) {
    console.error("Sponsor entries read failed", err);
    return NextResponse.json({ error: "Failed to read entries" }, { status: 500 });
  }
}
