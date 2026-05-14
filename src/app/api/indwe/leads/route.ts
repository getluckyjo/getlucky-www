import { NextRequest, NextResponse } from "next/server";
import { readSubmissions, SubmissionType } from "@/lib/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  type: "voucher" | "course-entry" | "free-entry" | "partner" | "corporate" | "agency";
  timestamp: string;
  name: string;
  email: string;
  mobile: string;
  course: string;
  event: string;
  status: "paid" | "lead" | "pending";
  source: string;
  raw: Record<string, string>;
};

const TYPES: SubmissionType[] = ["voucher", "entry", "freeEntry", "partner", "corporate", "agency"];

const TYPE_LABEL: Record<SubmissionType, Lead["type"]> = {
  voucher: "voucher",
  entry: "course-entry",
  freeEntry: "free-entry",
  partner: "partner",
  corporate: "corporate",
  agency: "agency",
};

function pick(row: Record<string, string>, keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  }
  return "";
}

function normalize(type: SubmissionType, row: Record<string, string>): Lead {
  const timestamp = pick(row, ["Timestamp"]);
  const reference = pick(row, ["Reference"]);
  const status = pick(row, ["Status"]).toLowerCase();
  const normalizedStatus: Lead["status"] =
    status === "paid" ? "paid" : status === "pending" ? "pending" : "lead";

  return {
    id: reference || `${type}-${timestamp}-${pick(row, ["Email", "Buyer Email", "Recipient Email"]) || pick(row, ["Mobile", "Buyer Mobile"]) || ""}`,
    type: TYPE_LABEL[type],
    timestamp,
    name: pick(row, ["Full Name", "Name", "Buyer Name", "Recipient Name"]),
    email: pick(row, ["Email", "Buyer Email", "Recipient Email"]),
    mobile: pick(row, ["Mobile", "Buyer Mobile"]),
    course: pick(row, ["Golf Course", "Course"]),
    event: pick(row, ["Event", "Golf Day Date"]),
    status: type === "voucher" || type === "entry" ? normalizedStatus : "lead",
    source: pick(row, ["Source"]) || (type === "entry" ? "qr-on-course" : type === "voucher" ? "online" : ""),
    raw: row,
  };
}

export async function GET(req: NextRequest) {
  const expected = process.env.INDWE_API_KEY;
  if (!expected) {
    return NextResponse.json({ error: "Indwe API not configured" }, { status: 503 });
  }

  const auth = req.headers.get("authorization") || "";
  const provided = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  if (provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const since = url.searchParams.get("since") || undefined;
  const typeFilter = url.searchParams.get("type") as Lead["type"] | null;

  const settled = await Promise.allSettled(
    TYPES.map(async (t) => {
      const rows = await readSubmissions(t, since);
      const filtered =
        t === "voucher" || t === "entry"
          ? rows.filter((r) => String(r.Status || "").toLowerCase() === "paid")
          : rows;
      return filtered.map((r) => normalize(t, r));
    }),
  );

  const failed: { type: SubmissionType; error: string }[] = [];
  const buckets: Lead[][] = [];
  settled.forEach((result, i) => {
    const t = TYPES[i];
    if (result.status === "fulfilled") {
      buckets.push(result.value);
    } else {
      const message = result.reason instanceof Error ? result.reason.message : String(result.reason);
      console.error(`Indwe leads read failed for type=${t}:`, message);
      failed.push({ type: t, error: message });
    }
  });

  if (failed.length === TYPES.length) {
    return NextResponse.json({ error: "Failed to read leads", failed }, { status: 500 });
  }

  let leads: Lead[] = buckets.flat();
  if (typeFilter) leads = leads.filter((l) => l.type === typeFilter);

  leads.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return NextResponse.json({
    count: leads.length,
    generatedAt: new Date().toISOString(),
    leads,
    ...(failed.length > 0 && { partial: true, failed }),
  });
}
