/**
 * Live metrics for the ops dashboard.
 *
 * Reads Postgres when it is configured and falls back to the Google Sheet
 * mirror, exactly like the Indwe lead API does. Every loader is wrapped so a
 * dead upstream degrades to a labelled "no data" tile rather than a 500 — a
 * dashboard that fails closed is worse than useless on a Monday morning.
 */

import { isDbConfigured, listEntries } from "@/lib/db";
import { readSubmissions } from "@/lib/sheets";

export type DataSource = "postgres" | "sheets" | "unavailable";

/** One entry attempt, normalised across Postgres and the Sheet mirror. */
export type EntryPoint = {
  ts: string;
  month: string;
  status: string;
  paid: boolean;
  amount: number;
  course: string;
  tier: string;
  name: string;
  email: string;
  mobile: string;
  reference: string;
};

export type MonthPoint = { month: string; value: number };

export type EntryMetrics = {
  source: DataSource;
  error: string | null;
  all: EntryPoint[];
  /** Paid revenue by month, oldest first. */
  revenueByMonth: MonthPoint[];
  /** Payment completion percentage by month, oldest first. */
  completionByMonth: MonthPoint[];
  /** Attempts by month, oldest first — the denominator behind completion. */
  attemptsByMonth: MonthPoint[];
  currentMonthRevenue: number;
  /** Completion across the trailing 30 days. Null when there were no attempts. */
  completion30d: number | null;
  stuckPending: EntryPoint[];
  /** ISO date of the most recent entry that reached paid, or null. */
  lastPaidAt: string | null;
};

export type LeadMetrics = {
  source: DataSource;
  error: string | null;
  byMonth: MonthPoint[];
  currentMonth: number;
};

const monthOf = (iso: string): string => iso.slice(0, 7);

const num = (v: unknown): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const str = (v: unknown): string => (v === null || v === undefined ? "" : String(v));

/** Sheet rows and DB rows share column names via entryToSheet, so one shape fits both. */
function toEntryPoint(row: Record<string, string>): EntryPoint {
  const ts = str(row.Timestamp);
  const status = str(row.Status).toLowerCase();
  return {
    ts,
    month: monthOf(ts),
    status,
    paid: status === "paid",
    amount: num(row.Amount),
    course: str(row.Course),
    tier: str(row.Tier),
    name: str(row.Name),
    email: str(row.Email),
    mobile: str(row.Mobile),
    reference: str(row.Reference),
  };
}

/** Build a dense oldest-first series over the last `count` calendar months. */
function denseMonths(count: number, now: Date): string[] {
  const out: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    out.push(d.toISOString().slice(0, 7));
  }
  return out;
}

export async function loadEntryMetrics(months = 6, now = new Date()): Promise<EntryMetrics> {
  const window = denseMonths(months, now);
  const sinceISO = `${window[0]}-01T00:00:00.000Z`;

  let rows: Record<string, string>[] = [];
  let source: DataSource = "unavailable";
  let error: string | null = null;

  try {
    if (isDbConfigured()) {
      const { entryToSheet } = await import("@/lib/db");
      rows = (await listEntries(sinceISO)).map(entryToSheet);
      source = "postgres";
    } else {
      rows = await readSubmissions("entry", sinceISO);
      source = "sheets";
    }
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
    // Postgres configured but unreachable — try the Sheet mirror before giving up.
    if (source === "unavailable" || source === "postgres") {
      try {
        rows = await readSubmissions("entry", sinceISO);
        source = "sheets";
        error = null;
      } catch (e2) {
        error = e2 instanceof Error ? e2.message : String(e2);
        source = "unavailable";
      }
    }
  }

  const all = rows.map(toEntryPoint).filter((r) => r.ts);

  const revenueByMonth = window.map((m) => ({
    month: m,
    value: all.filter((r) => r.month === m && r.paid).reduce((s, r) => s + r.amount, 0),
  }));
  const attemptsByMonth = window.map((m) => ({
    month: m,
    value: all.filter((r) => r.month === m).length,
  }));
  const completionByMonth = window.map((m) => {
    const att = all.filter((r) => r.month === m);
    return {
      month: m,
      value: att.length === 0 ? 0 : Math.round((att.filter((r) => r.paid).length / att.length) * 100),
    };
  });

  const thisMonth = monthOf(now.toISOString());
  const cutoff = new Date(now.getTime() - 30 * 864e5).toISOString();
  const recent = all.filter((r) => r.ts >= cutoff);

  const paidRows = all.filter((r) => r.paid).sort((a, b) => b.ts.localeCompare(a.ts));

  return {
    source,
    error,
    all,
    revenueByMonth,
    completionByMonth,
    attemptsByMonth,
    currentMonthRevenue: revenueByMonth.find((p) => p.month === thisMonth)?.value ?? 0,
    completion30d:
      recent.length === 0
        ? null
        : Math.round((recent.filter((r) => r.paid).length / recent.length) * 100),
    stuckPending: all.filter((r) => !r.paid).sort((a, b) => b.ts.localeCompare(a.ts)),
    lastPaidAt: paidRows[0]?.ts ?? null,
  };
}

/**
 * Leads delivered to Indwe.
 *
 * Delegates to the lead-quality report so the dashboard and the report can
 * never disagree about what counts as a lead. An earlier version of this
 * function counted only the `leads` table and silently omitted paid entries and
 * vouchers — which the Indwe feed tags as General Leads and does send — so the
 * KPI under-reported the sponsor's actual delivery by roughly a fifth.
 */
export async function loadLeadMetrics(months = 6, now = new Date()): Promise<LeadMetrics> {
  const { loadIndweReport } = await import("@/lib/ops/indwe");
  const report = await loadIndweReport(months, now);
  return {
    source: report.source,
    error: report.error,
    byMonth: report.byMonth,
    currentMonth:
      report.byMonth.find((p) => p.month === monthOf(now.toISOString()))?.value ?? 0,
  };
}
