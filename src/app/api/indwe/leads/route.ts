import { NextRequest, NextResponse } from "next/server";
import { readSubmissions, SubmissionType } from "@/lib/sheets";
import {
  isDbConfigured,
  listVouchers,
  listEntries,
  listLeads,
  voucherToSheet,
  entryToSheet,
  leadToSheet,
} from "@/lib/db";
import { isSubsDbConfigured, listIndweLeads, type IndweLeadRow } from "@/lib/subscriptions-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  type: "voucher" | "course-entry" | "free-entry" | "partner" | "corporate" | "charity" | "risk-review" | "membership";
  timestamp: string;
  name: string;
  email: string;
  mobile: string;
  course: string;
  event: string;
  status: "paid" | "lead" | "pending";
  source: string;
  // Promoted from raw so integrators don't need to dig — empty string when not
  // applicable to a given lead type. Adding new top-level fields here is a
  // non-breaking change; raw is still returned unchanged below.
  consent: string;
  leadStage: string;
  scheduleFile: string;
  tier: string;
  amount: string;
  prize: string;
  date: string;
  payfastPaymentId: string;
  raw: Record<string, string>;
};

// Agency submissions are deliberately excluded — they go to a separate internal pipeline,
// not to the headline sponsor.
type IndweType = Exclude<SubmissionType, "agency">;
const TYPES: IndweType[] = ["voucher", "entry", "freeEntry", "partner", "corporate", "charity", "riskReview"];

const TYPE_LABEL: Record<IndweType, Lead["type"]> = {
  voucher: "voucher",
  entry: "course-entry",
  freeEntry: "free-entry",
  partner: "partner",
  corporate: "corporate",
  charity: "charity",
  riskReview: "risk-review",
};

// Source rows for a given type. Postgres when configured (Sheet-shaped via the
// db adapters so normalize() is unchanged), else the legacy Sheets read.
async function rowsForType(t: IndweType, since?: string): Promise<Record<string, string>[]> {
  if (!isDbConfigured()) return readSubmissions(t, since);
  switch (t) {
    case "voucher":
      return (await listVouchers(since)).map(voucherToSheet);
    case "entry":
      return (await listEntries(since)).map(entryToSheet);
    case "freeEntry":
      return (await listLeads("free_entry", since)).map((r) => leadToSheet("free_entry", r));
    case "partner":
      return (await listLeads("partner", since)).map((r) => leadToSheet("partner", r));
    case "corporate":
      return (await listLeads("corporate", since)).map((r) => leadToSheet("corporate", r));
    case "charity":
      return (await listLeads("charity", since)).map((r) => leadToSheet("charity", r));
    case "riskReview":
      return (await listLeads("risk_review", since)).map((r) => leadToSheet("risk_review", r));
  }
}

function pick(row: Record<string, string>, keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  }
  return "";
}

function normalize(type: IndweType, row: Record<string, string>): Lead {
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
    // Entries now record a real Source ("on-course") at capture time; the
    // fallback only covers legacy rows written before that column existed.
    source: pick(row, ["Source"]) || (type === "entry" ? "on-course" : type === "voucher" ? "online" : ""),
    consent: pick(row, ["Consent"]),
    leadStage: pick(row, ["Lead Stage"]),
    scheduleFile: pick(row, ["Schedule File"]),
    tier: pick(row, ["Tier"]),
    amount: pick(row, ["Amount"]),
    prize: pick(row, ["Prize"]),
    date: pick(row, ["Date"]),
    payfastPaymentId: pick(row, ["PayFast PaymentID"]),
    raw: row,
  };
}

// Membership "switch your broker to Indwe" leads live in the separate
// Subscriptions Supabase project. Fold them into the same Lead shape so Indwe
// pulls every lead — course entries, vouchers, sponsored entries, partner,
// corporate, risk-review AND membership — from this one endpoint. The internal
// source/capture_point are normalized to a single clean "membership-offer" tag;
// the raw values are preserved under `raw` for anyone who wants the detail.
function membershipToLead(row: IndweLeadRow): Lead {
  return {
    id: row.id || `membership-${row.created_at}-${row.email || row.mobile || ""}`,
    type: "membership",
    timestamp: row.created_at || "",
    name: row.full_name || "",
    email: row.email || "",
    mobile: row.mobile || "",
    course: "",
    event: "",
    status: "lead",
    source: "membership-offer",
    consent: "",
    // Surface the broker-switch pipeline state (pending → proof_received →
    // verified → credited / rejected) so Indwe sees where the lead is.
    leadStage: row.status || "",
    scheduleFile: "",
    tier: "",
    amount: "",
    prize: "",
    date: "",
    payfastPaymentId: "",
    raw: {
      club_id: row.club_id ?? "",
      capture_point: row.capture_point ?? "",
      internal_source: row.source ?? "",
      status: row.status ?? "",
    },
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
      const rows = await rowsForType(t, since);
      // Payment is not a prerequisite for a lead. Vouchers and course entries
      // flow to Indwe the moment they're captured, carrying their real status
      // ("pending" until PayFast confirms, then "paid"), so Indwe sees the whole
      // funnel — not just completed purchases. (Previously these two types were
      // filtered to Status === "paid".)
      return rows.map((r) => normalize(t, r));
    }),
  );

  const failed: { type: string; error: string }[] = [];
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

  // Supplemental: membership "switch to Indwe" leads from the Subscriptions
  // project. Optional (skipped when its env vars aren't set) and best-effort —
  // a read failure here degrades to `partial` rather than failing the whole
  // response, since the core lead types above already succeeded.
  if (isSubsDbConfigured()) {
    try {
      const rows = await listIndweLeads(since);
      leads = leads.concat(rows.map(membershipToLead));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Indwe leads read failed for type=membership:", message);
      failed.push({ type: "membership", error: message });
    }
  }

  if (typeFilter) leads = leads.filter((l) => l.type === typeFilter);

  leads.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return NextResponse.json({
    count: leads.length,
    generatedAt: new Date().toISOString(),
    leads,
    ...(failed.length > 0 && { partial: true, failed }),
  });
}
