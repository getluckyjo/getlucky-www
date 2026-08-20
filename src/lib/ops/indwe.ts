/**
 * Lead-quality analysis for the Indwe / Santam renewal.
 *
 * The sponsorship is ~93% of revenue and renews for 2027. What Indwe buys is
 * access to golfers converted into advisory leads — so the renewal argument is
 * a lead-quality argument, and nobody had assembled one.
 *
 * This reads exactly the feed Indwe receives (same types, same tier map as
 * /api/indwe/leads, imported from one source of truth) and reports what we can
 * prove: how many, of what quality, how contactable, and how clean.
 *
 * What it deliberately CANNOT report is conversion — how many became quotes or
 * policies. Only Indwe holds that. The page asks for it explicitly rather than
 * inventing a proxy.
 */

import { isDbConfigured, listVouchers, listEntries, listLeads, type DbLeadType } from "@/lib/db";
import { isSubsDbConfigured, listIndweLeads } from "@/lib/subscriptions-db";
import { readSubmissions, type SubmissionType } from "@/lib/sheets";
import {
  LEAD_STAGE_BY_TYPE,
  TIERS_ASCENDING,
  type IndweLeadType,
  type IndweTier,
} from "@/lib/indwe-tiers";
import type { DataSource, MonthPoint } from "@/lib/ops/metrics";

export type IndweLead = {
  ts: string;
  month: string;
  type: IndweLeadType;
  tier: IndweTier;
  email: string;
  mobile: string;
  consent: string;
  /** Course or capture context, whichever the form recorded. */
  where: string;
  source: string;
};

/**
 * Every member of the Indwe feed, and where to read it from.
 *
 * Agency leads are deliberately absent — they go to a separate internal
 * pipeline, exactly as /api/indwe/leads excludes them.
 */
const FEED: { label: IndweLeadType; sheet: SubmissionType; db?: DbLeadType }[] = [
  { label: "course-entry", sheet: "entry" },
  { label: "voucher", sheet: "voucher" },
  { label: "free-entry", sheet: "freeEntry", db: "free_entry" },
  { label: "partner", sheet: "partner", db: "partner" },
  { label: "corporate", sheet: "corporate", db: "corporate" },
  { label: "charity", sheet: "charity", db: "charity" },
  { label: "school", sheet: "school", db: "school" },
  { label: "simulator", sheet: "simulator", db: "simulator" },
  { label: "tour", sheet: "tour", db: "tour" },
  { label: "risk-review", sheet: "riskReview", db: "risk_review" },
];

const s = (v: unknown): string => (v === null || v === undefined ? "" : String(v).trim());

function toLead(label: IndweLeadType, row: Record<string, string>): IndweLead {
  const ts = s(row.Timestamp);
  return {
    ts,
    month: ts.slice(0, 7),
    type: label,
    tier: LEAD_STAGE_BY_TYPE[label],
    email: s(row.Email || row["Buyer Email"]).toLowerCase(),
    mobile: s(row.Mobile || row["Buyer Mobile"]),
    consent: s(row.Consent),
    where: s(row.Course || row["Golf Course"] || row.Venue || row.Event),
    source: s(row.Source),
  };
}

function denseMonths(count: number, now: Date): string[] {
  const out: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    out.push(d.toISOString().slice(0, 7));
  }
  return out;
}

export type TierSeries = { month: string; counts: Record<IndweTier, number>; total: number };

export type IndweReport = {
  source: DataSource;
  error: string | null;
  months: string[];
  leads: IndweLead[];
  total: number;
  byMonth: MonthPoint[];
  byMonthTier: TierSeries[];
  byTier: { tier: IndweTier; count: number; pct: number }[];
  byType: { type: IndweLeadType; count: number }[];
  topWhere: { where: string; count: number }[];
  quality: {
    withEmail: number;
    withMobile: number;
    withEither: number;
    uniquePeople: number;
    duplicateRows: number;
    consentYes: number;
    consentNo: number;
    consentBlank: number;
  };
  /** Quote-Ready leads in the most recent complete month, and the peak month. */
  quoteReadyLatest: { month: string; count: number } | null;
  quoteReadyPeak: { month: string; count: number } | null;
};

export async function loadIndweReport(months = 6, now = new Date()): Promise<IndweReport> {
  const window = denseMonths(months, now);
  const sinceISO = `${window[0]}-01T00:00:00.000Z`;

  const leads: IndweLead[] = [];
  let source: DataSource = "unavailable";
  let error: string | null = null;

  try {
    if (isDbConfigured()) {
      const { voucherToSheet, entryToSheet, leadToSheet } = await import("@/lib/db");
      for (const f of FEED) {
        if (f.label === "voucher") {
          for (const r of await listVouchers(sinceISO)) leads.push(toLead(f.label, voucherToSheet(r)));
        } else if (f.label === "course-entry") {
          for (const r of await listEntries(sinceISO)) leads.push(toLead(f.label, entryToSheet(r)));
        } else if (f.db) {
          for (const r of await listLeads(f.db, sinceISO)) leads.push(toLead(f.label, leadToSheet(f.db, r)));
        }
      }
      source = "postgres";
    } else {
      for (const f of FEED) {
        for (const r of await readSubmissions(f.sheet, sinceISO)) leads.push(toLead(f.label, r));
      }
      source = "sheets";
    }
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    source = "unavailable";
  }

  // Membership leads live in the separate subscriptions project and are folded
  // into the same sponsor feed. Optional — a missing feed must not blank the page.
  if (isSubsDbConfigured()) {
    try {
      for (const r of await listIndweLeads(sinceISO)) {
        leads.push(
          toLead("membership", {
            Timestamp: r.created_at,
            Email: s(r.email),
            Mobile: s(r.mobile),
            Course: s(r.club_id),
            Source: s(r.source || r.capture_point),
            Consent: "",
          }),
        );
      }
    } catch {
      // Membership leads are additive; their absence is not worth failing the page.
    }
  }

  const valid = leads.filter((l) => /^\d{4}-\d{2}-\d{2}/.test(l.ts));

  const byMonth: MonthPoint[] = window.map((m) => ({
    month: m,
    value: valid.filter((l) => l.month === m).length,
  }));

  const byMonthTier: TierSeries[] = window.map((m) => {
    const rows = valid.filter((l) => l.month === m);
    const counts = Object.fromEntries(
      TIERS_ASCENDING.map((t) => [t, rows.filter((l) => l.tier === t).length]),
    ) as Record<IndweTier, number>;
    return { month: m, counts, total: rows.length };
  });

  const byTier = TIERS_ASCENDING.map((tier) => {
    const count = valid.filter((l) => l.tier === tier).length;
    return { tier, count, pct: valid.length ? Math.round((count / valid.length) * 100) : 0 };
  }).reverse(); // highest intent first — that is the order the renewal cares about

  const typeCounts = new Map<IndweLeadType, number>();
  for (const l of valid) typeCounts.set(l.type, (typeCounts.get(l.type) ?? 0) + 1);
  const byType = [...typeCounts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const whereCounts = new Map<string, number>();
  for (const l of valid) if (l.where) whereCounts.set(l.where, (whereCounts.get(l.where) ?? 0) + 1);
  const topWhere = [...whereCounts.entries()]
    .map(([where, count]) => ({ where, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const emails = valid.filter((l) => l.email).map((l) => l.email);
  const quality = {
    withEmail: emails.length,
    withMobile: valid.filter((l) => l.mobile).length,
    withEither: valid.filter((l) => l.email || l.mobile).length,
    uniquePeople: new Set(emails).size,
    duplicateRows: emails.length - new Set(emails).size,
    consentYes: valid.filter((l) => /^y/i.test(l.consent)).length,
    consentNo: valid.filter((l) => /^n/i.test(l.consent)).length,
    consentBlank: valid.filter((l) => !l.consent).length,
  };

  // The current month is partial, so the "latest" quote-ready figure uses the
  // last COMPLETE month — quoting a part-month against a full one flatters or
  // damns unfairly, and this number is going in front of a sponsor.
  const complete = byMonthTier.filter((m) => m.month !== now.toISOString().slice(0, 7));
  const latest = complete[complete.length - 1];
  const peak = [...byMonthTier].sort(
    (a, b) => b.counts["Quote-Ready Lead"] - a.counts["Quote-Ready Lead"],
  )[0];

  return {
    source,
    error,
    months: window,
    leads: valid,
    total: valid.length,
    byMonth,
    byMonthTier,
    byTier,
    byType,
    topWhere,
    quality,
    quoteReadyLatest: latest ? { month: latest.month, count: latest.counts["Quote-Ready Lead"] } : null,
    quoteReadyPeak: peak ? { month: peak.month, count: peak.counts["Quote-Ready Lead"] } : null,
  };
}
