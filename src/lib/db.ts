/**
 * Supabase (Postgres) — the durable system-of-record for paid entries,
 * vouchers and leads. All access is server-side via the service-role key,
 * which bypasses RLS. The key must never be exposed to the client, so it is
 * read from SUPABASE_SERVICE_ROLE_KEY (NOT a NEXT_PUBLIC_ var).
 *
 * Phase A: routes write to Postgres first (idempotent upsert on the payment
 * reference) and keep writing to Google Sheets as a mirror. Every DB helper is
 * a no-op-safe wrapper the caller guards with isDbConfigured(), so the site
 * still runs Sheets-only until the Supabase env vars are set.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function isDbConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function db(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured");
  }
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

type PaidTable = "entries" | "vouchers";

export type EntryRecord = {
  reference: string;
  status?: string;
  entry_date?: string | null;
  tier?: string | null;
  amount?: number | null;
  prize?: string | null;
  course?: string | null;
  name?: string | null;
  email?: string | null;
  mobile?: string | null;
  source?: string | null;
};

export type VoucherRecord = {
  reference: string;
  status?: string;
  tier?: string | null;
  amount?: number | null;
  prize?: string | null;
  course?: string | null;
  buyer_name?: string | null;
  buyer_email?: string | null;
  buyer_mobile?: string | null;
  purchase_for?: string | null;
  recipient_name?: string | null;
  recipient_email?: string | null;
  personal_message?: string | null;
  promo_code?: string | null;
};

export type LeadRecord = {
  type: "partner" | "corporate" | "charity" | "school" | "simulator" | "agency" | "tour" | "free_entry" | "risk_review";
  full_name?: string | null;
  email?: string | null;
  mobile?: string | null;
  company?: string | null;
  message?: string | null;
  source?: string | null;
  consent_communication?: boolean;
  data?: Record<string, unknown>;
};

/**
 * Insert the pending entry/voucher row. Idempotent: a retry with the same
 * reference upserts rather than duplicating. References are freshly generated
 * per submission, so conflicts only arise on genuine retries.
 */
export async function createEntry(rec: EntryRecord): Promise<void> {
  const { error } = await db()
    .from("entries")
    .upsert({ status: "pending", ...rec }, { onConflict: "reference" });
  if (error) throw new Error(`db.createEntry: ${error.message}`);
}

export async function createVoucher(rec: VoucherRecord): Promise<void> {
  const { error } = await db()
    .from("vouchers")
    .upsert({ status: "pending", ...rec }, { onConflict: "reference" });
  if (error) throw new Error(`db.createVoucher: ${error.message}`);
}

/**
 * Mark a paid record COMPLETE, idempotently. Returns true ONLY when this call
 * is the one that transitioned the row from not-paid → paid. PayFast can resend
 * an ITN; the `status <> 'paid'` guard means a resend updates zero rows and
 * returns false, so the caller can skip re-sending confirmation emails.
 */
export async function markPaid(
  table: PaidTable,
  reference: string,
  pfPaymentId: string,
): Promise<boolean> {
  const { data, error } = await db()
    .from(table)
    .update({ status: "paid", pf_payment_id: pfPaymentId, paid_at: new Date().toISOString() })
    .eq("reference", reference)
    .neq("status", "paid")
    .select("reference");
  if (error) throw new Error(`db.markPaid: ${error.message}`);
  return (data?.length ?? 0) > 0;
}

/** Record a non-COMPLETE PayFast status (cancelled / failed / etc.). */
export async function markStatus(
  table: PaidTable,
  reference: string,
  status: string,
  pfPaymentId: string,
): Promise<void> {
  const { error } = await db()
    .from(table)
    .update({ status, pf_payment_id: pfPaymentId })
    .eq("reference", reference);
  if (error) throw new Error(`db.markStatus: ${error.message}`);
}

export async function insertLead(rec: LeadRecord): Promise<void> {
  const { error } = await db().from("leads").insert({ data: {}, ...rec });
  if (error) throw new Error(`db.insertLead: ${error.message}`);
}

/* -------------------------------------------------------------------------- *
 * Reads (Phase B)
 *
 * Postgres is now the read source for the PayFast notify amount cross-check
 * and the Indwe / sponsor lead APIs. The DB rows are reshaped into the legacy
 * Google Sheet column shape by the *ToSheet adapters below, so every existing
 * consumer (which was written against Sheet column names) keeps working
 * unchanged. Callers guard with isDbConfigured() and fall back to Sheets when
 * the DB env vars aren't set.
 * -------------------------------------------------------------------------- */

export type DbLeadType = LeadRecord["type"];

type VoucherRow = {
  reference: string;
  status: string | null;
  tier: string | null;
  amount: number | null;
  prize: string | null;
  course: string | null;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_mobile: string | null;
  purchase_for: string | null;
  recipient_name: string | null;
  recipient_email: string | null;
  personal_message: string | null;
  promo_code: string | null;
  pf_payment_id: string | null;
  created_at: string;
};

type EntryRow = {
  reference: string;
  status: string | null;
  entry_date: string | null;
  tier: string | null;
  amount: number | null;
  prize: string | null;
  course: string | null;
  name: string | null;
  email: string | null;
  mobile: string | null;
  source: string | null;
  pf_payment_id: string | null;
  created_at: string;
};

type LeadRow = {
  type: DbLeadType;
  full_name: string | null;
  email: string | null;
  mobile: string | null;
  company: string | null;
  message: string | null;
  source: string | null;
  consent_communication: boolean | null;
  data: Record<string, unknown> | null;
  created_at: string;
};

const s = (v: unknown): string => (v === null || v === undefined ? "" : String(v));

export async function getVoucher(reference: string): Promise<VoucherRow | null> {
  const { data, error } = await db()
    .from("vouchers")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw new Error(`db.getVoucher: ${error.message}`);
  return (data as VoucherRow) ?? null;
}

export async function getEntry(reference: string): Promise<EntryRow | null> {
  const { data, error } = await db()
    .from("entries")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw new Error(`db.getEntry: ${error.message}`);
  return (data as EntryRow) ?? null;
}

export async function listVouchers(sinceISO?: string): Promise<VoucherRow[]> {
  let q = db().from("vouchers").select("*").order("created_at", { ascending: false });
  if (sinceISO) q = q.gte("created_at", sinceISO);
  const { data, error } = await q;
  if (error) throw new Error(`db.listVouchers: ${error.message}`);
  return (data as VoucherRow[]) ?? [];
}

export async function listEntries(sinceISO?: string): Promise<EntryRow[]> {
  let q = db().from("entries").select("*").order("created_at", { ascending: false });
  if (sinceISO) q = q.gte("created_at", sinceISO);
  const { data, error } = await q;
  if (error) throw new Error(`db.listEntries: ${error.message}`);
  return (data as EntryRow[]) ?? [];
}

export async function listLeads(type: DbLeadType, sinceISO?: string): Promise<LeadRow[]> {
  let q = db()
    .from("leads")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false });
  if (sinceISO) q = q.gte("created_at", sinceISO);
  const { data, error } = await q;
  if (error) throw new Error(`db.listLeads: ${error.message}`);
  return (data as LeadRow[]) ?? [];
}

// --- Sheet-shape adapters: DB row -> legacy Sheet column object -------------

export function voucherToSheet(r: VoucherRow): Record<string, string> {
  return {
    Timestamp: s(r.created_at),
    Reference: s(r.reference),
    Status: s(r.status),
    Tier: s(r.tier),
    Amount: s(r.amount),
    Prize: s(r.prize),
    Course: s(r.course),
    "Buyer Name": s(r.buyer_name),
    "Buyer Email": s(r.buyer_email),
    "Buyer Mobile": s(r.buyer_mobile),
    For: s(r.purchase_for),
    "Recipient Name": s(r.recipient_name),
    "Recipient Email": s(r.recipient_email),
    "Personal Message": s(r.personal_message),
    "Promo Code": s(r.promo_code),
    "PayFast PaymentID": s(r.pf_payment_id),
  };
}

export function entryToSheet(r: EntryRow): Record<string, string> {
  return {
    Timestamp: s(r.created_at),
    Reference: s(r.reference),
    Status: s(r.status),
    Date: s(r.entry_date),
    Tier: s(r.tier),
    Amount: s(r.amount),
    Prize: s(r.prize),
    Course: s(r.course),
    Name: s(r.name),
    Email: s(r.email),
    Mobile: s(r.mobile),
    Source: s(r.source),
    "PayFast PaymentID": s(r.pf_payment_id),
  };
}

export function leadToSheet(type: DbLeadType, r: LeadRow): Record<string, string> {
  const d = r.data ?? {};
  const base = {
    Timestamp: s(r.created_at),
    Email: s(r.email),
    Mobile: s(r.mobile),
    Source: s(r.source),
  };
  switch (type) {
    case "partner":
      return {
        ...base,
        "Full Name": s(r.full_name),
        "Golf Course": s(d.golf_course),
        Message: s(r.message),
      };
    case "corporate":
      return {
        ...base,
        "Full Name": s(r.full_name),
        Company: s(r.company),
        "Golf Course": s(d.golf_course),
        "Golf Day Date": s(d.golf_day_date),
        Message: s(r.message),
      };
    case "charity":
      return {
        ...base,
        "Full Name": s(r.full_name),
        Charity: s(r.company),
        "Golf Course": s(d.golf_course),
        "Golf Day Date": s(d.golf_day_date),
        Message: s(r.message),
      };
    case "school":
      return {
        ...base,
        "Full Name": s(r.full_name),
        School: s(r.company),
        "Golf Course": s(d.golf_course),
        "Golf Day Date": s(d.golf_day_date),
        Message: s(r.message),
      };
    case "simulator":
      return {
        ...base,
        "Full Name": s(r.full_name),
        Venue: s(r.company),
        Location: s(d.location),
        Message: s(r.message),
      };
    case "agency":
      return {
        ...base,
        "Full Name": s(r.full_name),
        Company: s(r.company),
        Industry: s(d.industry),
        "Budget Range": s(d.budget_range),
        Message: s(r.message),
      };
    case "tour":
      return {
        ...base,
        "Full Name": s(r.full_name),
        Company: s(r.company),
        "Tours Per Year": s(d.tours_per_year),
        Message: s(r.message),
      };
    case "free_entry":
      return {
        ...base,
        Name: s(r.full_name),
        Course: s(d.course),
        Event: s(d.event),
      };
    case "risk_review":
      return {
        ...base,
        "Full Name": s(r.full_name),
        Address: s(d.address),
        "Schedule File": s(d.schedule_file),
        Consent: r.consent_communication ? "Yes" : "No",
        "Lead Stage": s(d.lead_stage),
      };
  }
}

/* -------------------------------------------------------------------------- *
 * Payment-flow health
 *
 * "Is the entry money path still working?" cannot be answered by checking that
 * PayFast is reachable and the signature helper still returns a hash — that is
 * what the canary checked while every ITN was being rejected for three weeks in
 * Aug 2026. The only honest signal is the outcome: entries are being created,
 * and entries are being marked paid.
 * -------------------------------------------------------------------------- */

export type EntryPaymentHealth = {
  /** Entries created in the window. */
  created: number;
  /** Entries whose paid_at falls in the window. */
  paid: number;
  /**
   * Entries old enough to have paid but still `pending`, counted only inside a
   * bounded recent window. This is the number that can still be acted on.
   */
  stuckPending: number;
  /**
   * Every `pending` row past the stuck cutoff, with no lower bound.
   *
   * Informational only, and never alarms. An abandoned checkout stays `pending`
   * for ever, so this number only ever grows — alerting on it means alerting
   * every day regardless of whether anything is wrong.
   */
  pendingBacklog: number;
};

export async function getEntryPaymentHealth(
  sinceISO: string,
  stuckBeforeISO: string,
  stuckAfterISO: string,
): Promise<EntryPaymentHealth> {
  const client = db();
  const [createdRes, paidRes, stuckRes, backlogRes] = await Promise.all([
    client
      .from("entries")
      .select("reference", { count: "exact", head: true })
      .gte("created_at", sinceISO),
    client
      .from("entries")
      .select("reference", { count: "exact", head: true })
      .gte("paid_at", sinceISO),
    // Bounded on both sides: old enough to have paid, recent enough to matter.
    client
      .from("entries")
      .select("reference", { count: "exact", head: true })
      .eq("status", "pending")
      .lt("created_at", stuckBeforeISO)
      .gte("created_at", stuckAfterISO),
    client
      .from("entries")
      .select("reference", { count: "exact", head: true })
      .eq("status", "pending")
      .lt("created_at", stuckBeforeISO),
  ]);

  for (const res of [createdRes, paidRes, stuckRes, backlogRes]) {
    if (res.error) throw new Error(`db.getEntryPaymentHealth: ${res.error.message}`);
  }

  return {
    created: createdRes.count ?? 0,
    paid: paidRes.count ?? 0,
    stuckPending: stuckRes.count ?? 0,
    pendingBacklog: backlogRes.count ?? 0,
  };
}
