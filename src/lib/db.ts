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
  type: "partner" | "corporate" | "agency" | "free_entry" | "risk_review";
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
