import { NextRequest, NextResponse } from "next/server";
import { readSubmissions, SubmissionType } from "@/lib/sheets";

export const runtime = "nodejs";

const VALID_TYPES: SubmissionType[] = ["partner", "corporate", "voucher"];

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
  const typeParam = (url.searchParams.get("type") || "voucher") as SubmissionType;
  const since = url.searchParams.get("since") || undefined;

  if (!VALID_TYPES.includes(typeParam)) {
    return NextResponse.json(
      { error: `type must be one of: ${VALID_TYPES.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const records = await readSubmissions(typeParam, since || undefined);
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
