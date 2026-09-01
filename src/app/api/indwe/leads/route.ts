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
import {
  displayName,
  isWhatsappDbConfigured,
  listWhatsappLeads,
  provinceLabel,
  toIndweRaw,
  type WhatsappLeadRow,
} from "@/lib/whatsapp-db";
import { personIdForMobile } from "@/lib/person-id";
import { LEAD_STAGE_BY_TYPE } from "@/lib/indwe-tiers";
import { safeErrorMessage } from "@/lib/redact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  type: "voucher" | "course-entry" | "free-entry" | "partner" | "corporate" | "charity" | "school" | "simulator" | "tour" | "risk-review" | "membership" | "whatsapp";
  timestamp: string;
  name: string;
  email: string;
  mobile: string;
  /**
   * The same golfer, however they reached us — see src/lib/person-id.ts.
   *
   * `id` identifies this lead; `personId` identifies the human behind it. A
   * golfer who entered at a golf day and later completed the WhatsApp
   * conversation is one person moving from Warm to Quote-Ready, not two
   * unrelated records.
   *
   * Empty means "cannot be linked", never "a new person" — two empty personIds
   * are not the same golfer and must not be collapsed.
   */
  personId: string;
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
  address: string;
  tier: string;
  amount: string;
  prize: string;
  date: string;
  payfastPaymentId: string;
  raw: Record<string, string>;
};

// Agency submissions are deliberately excluded — they go to a separate internal pipeline,
// not to the headline sponsor.
/**
 * A lead before its cross-route identity is attached.
 *
 * The mappers below build these; personId is derived in one place afterwards so
 * the three routes cannot drift apart on how a golfer is identified.
 */
type RawLead = Omit<Lead, "personId">;

type IndweType = Exclude<SubmissionType, "agency">;
const TYPES: IndweType[] = ["voucher", "entry", "freeEntry", "partner", "corporate", "charity", "school", "simulator", "tour", "riskReview"];

const TYPE_LABEL: Record<IndweType, Lead["type"]> = {
  voucher: "voucher",
  entry: "course-entry",
  freeEntry: "free-entry",
  partner: "partner",
  corporate: "corporate",
  charity: "charity",
  school: "school",
  simulator: "simulator",
  tour: "tour",
  riskReview: "risk-review",
};

// Canonical Indwe qualification tag per lead type — the single source of truth
// lives in src/lib/indwe-tiers.ts so the ops lead-quality report tiers leads
// exactly as this feed does. See docs/indwe/lead-tagging.md.

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
    case "school":
      return (await listLeads("school", since)).map((r) => leadToSheet("school", r));
    case "simulator":
      return (await listLeads("simulator", since)).map((r) => leadToSheet("simulator", r));
    case "tour":
      return (await listLeads("tour", since)).map((r) => leadToSheet("tour", r));
    case "riskReview":
      return (await listLeads("risk_review", since)).map((r) => leadToSheet("risk_review", r));
  }
}

/**
 * Can Indwe do anything with this lead?
 *
 * A name or an email is the bar. A mobile alone is not enough — that was the
 * complaint — but a Quote-Ready lead is never withheld for being thin.
 *
 * That exemption is deliberate. A `whatsapp` lead is a golfer who answered the
 * underwriting questions and consented explicitly to being shared, and its name
 * comes from a lateral join to `entries` that returns empty if it ever misses.
 * Losing the most valuable lead in the feed to a failed join, silently, is a
 * far worse outcome than passing on a thin one — and `personId` gives Indwe the
 * mobile in a form they can match on.
 */
function isDeliverable(l: Lead): boolean {
  if (l.name.trim() || l.email.trim()) return true;
  return l.leadStage === "Quote-Ready Lead";
}

function pick(row: Record<string, string>, keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  }
  return "";
}

function normalize(type: IndweType, row: Record<string, string>): RawLead {
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
    // Tag is derived from the lead type — the single source of truth — so every
    // lead (including historical rows) emits exactly one canonical tier string.
    leadStage: LEAD_STAGE_BY_TYPE[TYPE_LABEL[type]],
    scheduleFile: pick(row, ["Schedule File"]),
    address: pick(row, ["Address"]),
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
function membershipToLead(row: IndweLeadRow): RawLead {
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
    // Requesting an Indwe quote (the broker switch) is the qualifying action,
    // so the tier is always Quote-Ready. The broker-switch pipeline state
    // (pending → proof_received → verified → credited / rejected) stays
    // available under raw.status for anyone who wants the funnel position.
    leadStage: LEAD_STAGE_BY_TYPE.membership,
    scheduleFile: "",
    address: "",
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

/**
 * Golfers who completed the WhatsApp profiling conversation, from the separate
 * WhatsApp project's database.
 *
 * These are the most qualified leads in the feed, and until now they reached
 * Indwe by no route at all — the WhatsApp app was built to push them into
 * `InternetLeads.asmx`, and that push is still unwritten because the field
 * mapping needs a WSDL nobody has supplied. Folding them in here delivers them
 * over a contract that already exists and that Indwe already poll.
 *
 * The profiling answers go in `raw` rather than becoming new top-level fields.
 * They are underwriting detail — business or personal, what needs covering,
 * what it currently costs a month, who they are insured with — and their shape
 * belongs to the conversation, which changes as questions are cut. `raw` is
 * documented as free-form, so nothing in Indwe's integration breaks when it
 * does, and the 27 August 2026 rewrite changed nearly all of it.
 *
 * One thing about these leads is different in kind from every other type in
 * this feed: the golfer holds an appointment. The last message they received
 * names a specific day and hour, chosen from real working days inside office
 * hours. Nothing books it — not here, and not on the WhatsApp side — so
 * `raw.call_slot` is a commitment somebody at Indwe has to keep.
 */
function whatsappToLead(row: WhatsappLeadRow): RawLead {
  return {
    id: `whatsapp-${row.id}`,
    type: "whatsapp",
    timestamp: row.created_at,
    name: displayName(row),
    email: row.email ?? "",
    mobile: row.phone,
    course: row.course ?? "",
    event: "",
    status: "lead",
    source: "whatsapp-profiling",
    // Captured in the conversation against the exact wording the golfer was
    // shown — stronger evidence than a ticked box, and only consented profiles
    // are readable at all.
    consent: "Yes",
    leadStage: LEAD_STAGE_BY_TYPE.whatsapp,
    scheduleFile: "",
    // The conversation asks for a province rather than a suburb now. It is the
    // only location we hold, and it is what routes the lead to an Advisor.
    address: provinceLabel(row.answers.province),
    tier: "",
    amount: "",
    prize: "",
    date: "",
    payfastPaymentId: "",
    raw: toIndweRaw(row.answers),
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
  const buckets: RawLead[][] = [];
  settled.forEach((result, i) => {
    const t = TYPES[i];
    if (result.status === "fulfilled") {
      buckets.push(result.value);
    } else {
      const message = safeErrorMessage(result.reason);
      console.error(`Indwe leads read failed for type=${t}:`, message);
      failed.push({ type: t, error: message });
    }
  });

  if (failed.length === TYPES.length) {
    return NextResponse.json({ error: "Failed to read leads", failed }, { status: 500 });
  }

  let raw: RawLead[] = buckets.flat();

  // Supplemental: membership "switch to Indwe" leads from the Subscriptions
  // project. Optional (skipped when its env vars aren't set) and best-effort —
  // a read failure here degrades to `partial` rather than failing the whole
  // response, since the core lead types above already succeeded.
  if (isSubsDbConfigured()) {
    try {
      const rows = await listIndweLeads(since);
      raw = raw.concat(rows.map(membershipToLead));
    } catch (err) {
      const message = safeErrorMessage(err);
      console.error("Indwe leads read failed for type=membership:", message);
      failed.push({ type: "membership", error: message });
    }
  }

  // Completed WhatsApp profiles, from the WhatsApp project's database. Optional
  // and best-effort for the same reason as membership above: a read failure
  // here degrades the response to `partial` rather than failing the types that
  // already succeeded.
  if (isWhatsappDbConfigured()) {
    try {
      const rows = await listWhatsappLeads(since);
      raw = raw.concat(rows.map(whatsappToLead));
    } catch (err) {
      const message = safeErrorMessage(err);
      console.error("Indwe leads read failed for type=whatsapp:", message);
      failed.push({ type: "whatsapp", error: message });
    }
  }

  // One derivation for every route, so a golfer cannot be identified one way as
  // a course entry and another way as a completed WhatsApp profile.
  let leads: Lead[] = raw.map((l) => ({ ...l, personId: personIdForMobile(l.mobile) }));

  // Withhold a lead nobody can act on.
  //
  // /form stopped asking for a name and an email on 31 Aug 2026 — PayFast
  // returns both, and they are written onto the entry when the payment lands.
  // But the entry row is created at form submit, so for the minute or two
  // between submitting and paying it holds a mobile number and nothing else.
  // This feed deliberately sends pending entries so Indwe see the whole funnel,
  // and Indwe poll every twelve to fifteen minutes — so any entry submitted
  // shortly before a poll is captured in that state, including one that goes on
  // to pay perfectly. It is a race, not only an abandoned checkout.
  //
  // Indwe reported six such leads on 1 Sep. Five shared one mobile and were
  // captured 08:58–09:00 SAST, which is 06:58–07:00 UTC — the same three
  // minutes in which four PayFast notifications arrived and were accepted. They
  // were caught mid-payment, not after walking away.
  //
  // Sending the whole funnel was decided when a pending entry still carried a
  // name, an email and a mobile — a lead somebody could work. That premise
  // changed; this restores it rather than reversing the decision. Contactable
  // pending entries still flow, and a withheld one appears on the next poll
  // once payment fills in the missing detail.
  const withheld = leads.filter((l) => !isDeliverable(l)).length;
  leads = leads.filter(isDeliverable);

  if (typeFilter) leads = leads.filter((l) => l.type === typeFilter);

  leads.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return NextResponse.json({
    count: leads.length,
    generatedAt: new Date().toISOString(),
    // Reported rather than dropped quietly. A feed that silently sheds rows is
    // how this project has lost things before; a number here means the next
    // person to ask "where did that lead go" has an answer.
    withheldIncomplete: withheld,
    leads,
    ...(failed.length > 0 && { partial: true, failed }),
  });
}
