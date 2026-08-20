/**
 * Read-only access to the Get Lucky Subscriptions Supabase project
 * (membership.getluckygolfclub.com), a SEPARATE project from this site's
 * primary database. Its `indwe_leads` table holds the "switch your broker to
 * Indwe and we'll credit a 12-month membership" leads captured on the /claim
 * page and during PayFast signup.
 *
 * Historically those leads only reached Indwe by email. To give Indwe ONE
 * authenticated feed of every lead, /api/indwe/leads now also reads this table
 * and folds the rows into its response.
 *
 * Configured via its own env vars so it stays optional: when they aren't set,
 * isSubsDbConfigured() returns false and the Indwe API simply omits membership
 * leads (everything else keeps working). Never expose the service key to the
 * client — read it server-side only.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

// The Subscriptions project's Vercel env vars were stored with a stray trailing
// literal "\n" (see Get Lucky Subscriptions/api/_supabase.js). Strip it here too
// so a copy-pasted value can't break the client.
const cleanEnv = (k: string): string => (process.env[k] || "").replace(/\\n/g, "").trim();

export function isSubsDbConfigured(): boolean {
  return Boolean(
    cleanEnv("SUBSCRIPTIONS_SUPABASE_URL") && cleanEnv("SUBSCRIPTIONS_SUPABASE_SERVICE_ROLE_KEY"),
  );
}

function db(): SupabaseClient {
  const url = cleanEnv("SUBSCRIPTIONS_SUPABASE_URL");
  const key = cleanEnv("SUBSCRIPTIONS_SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error(
      "SUBSCRIPTIONS_SUPABASE_URL / SUBSCRIPTIONS_SUPABASE_SERVICE_ROLE_KEY not configured",
    );
  }
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

export type IndweLeadRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  mobile: string | null;
  club_id: string | null;
  source: string | null;
  capture_point: string | null;
  status: string | null;
  created_at: string;
};

const SELECT =
  "id, full_name, email, mobile, club_id, source, capture_point, status, created_at";

export async function listIndweLeads(sinceISO?: string): Promise<IndweLeadRow[]> {
  let q = db()
    .from("indwe_leads")
    .select(SELECT)
    .order("created_at", { ascending: false });
  if (sinceISO) q = q.gte("created_at", sinceISO);
  const { data, error } = await q;
  if (error) throw new Error(`subscriptions-db.listIndweLeads: ${error.message}`);
  return (data as IndweLeadRow[]) ?? [];
}

/* -------------------------------------------------------------------------- *
 * Members (read-only)
 *
 * The ops membership funnel needs to know who already belongs to the club, so
 * that an invite queue never targets an existing member and so the gap between
 * "golfers who gave us their details" and "golfers who joined" can be measured
 * at all. Read-only, and only the columns that question needs.
 * -------------------------------------------------------------------------- */

export type MemberRow = {
  email: string | null;
  subscription_status: string | null;
  plan_type: string | null;
  club_id: string | null;
  joined_date: string | null;
  last_payment_date: string | null;
};

const MEMBER_SELECT =
  "email, subscription_status, plan_type, club_id, joined_date, last_payment_date";

export async function listMembers(): Promise<MemberRow[]> {
  const { data, error } = await db()
    .from("members")
    .select(MEMBER_SELECT)
    .order("joined_date", { ascending: false });
  if (error) throw new Error(`subscriptions-db.listMembers: ${error.message}`);
  return (data as MemberRow[]) ?? [];
}
