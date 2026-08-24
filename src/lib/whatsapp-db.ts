/**
 * Read-only access to the Get Lucky WhatsApp project's database
 * (getluckyjo/twillio), a SEPARATE Neon Postgres from this site's Supabase.
 *
 * Its `lead_pushes` table holds one row per golfer who completed the WhatsApp
 * profiling conversation: the questions Indwe need to quote, answered by the
 * golfer, with explicit consent to their details being shared.
 *
 * Those leads had no route to Indwe at all. The WhatsApp app was built to push
 * them into `InternetLeads.asmx` and that push has never been written, because
 * the field mapping needs a WSDL Indwe have not supplied — so every completed
 * profile has sat in that table undelivered. This reads them into the feed
 * Indwe already poll, which needs no new contract from anyone.
 *
 * Same shape as subscriptions-db.ts, and for the same reason: configured via
 * its own env var so it stays optional. When WHATSAPP_DATABASE_URL is not set,
 * isWhatsappDbConfigured() returns false and /api/indwe/leads simply omits
 * these leads. Never expose the connection string to the client.
 */

import { neon } from "@neondatabase/serverless";

export function isWhatsappDbConfigured(): boolean {
  return Boolean((process.env.WHATSAPP_DATABASE_URL || "").trim());
}

function sql() {
  const url = (process.env.WHATSAPP_DATABASE_URL || "").trim();
  if (!url) throw new Error("WHATSAPP_DATABASE_URL not configured");

  // Checked here rather than left to the driver. `neon()` rejects a malformed
  // URL by throwing an error whose message contains the whole connection
  // string, password included — and that message goes straight into the
  // platform log. A typo should cost a redeploy, not a credential rotation.
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    throw new Error(
      "WHATSAPP_DATABASE_URL is not a valid connection string. Value withheld from this message.",
    );
  }

  // The specific typo worth naming: a placeholder left in from the setup notes.
  // Without this it presents as an unhelpful DNS failure.
  if (!host || host.startsWith("<") || host.endsWith(">")) {
    throw new Error(
      `WHATSAPP_DATABASE_URL still contains a placeholder host ("${host}"). Replace it with the real Neon hostname.`,
    );
  }

  return neon(url);
}

/** The profiling answers, keyed by step id. Absent keys mean the golfer was not asked. */
export type WhatsappAnswers = {
  /** car | home | both */
  cover?: string;
  /** Free text — suburb or town the vehicle is kept in. */
  area?: string;
  /** Free text — make and model. */
  vehicle?: string;
  /** garage | driveway | street */
  parking?: string;
  /** own | rent */
  tenure?: string;
  /** yes | no — currently insured. */
  insured?: string;
  /** morning | afternoon | anytime */
  call_time?: string;
  /** yes | no — consent to share with Indwe. Only "yes" ever reaches this table. */
  indwe_share?: string;
};

export type WhatsappLeadRow = {
  id: number;
  phone: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  course: string | null;
  answers: WhatsappAnswers;
  created_at: string;
};

type RawRow = {
  id: number;
  phone: string;
  payload: { firstName?: string | null; answers?: WhatsappAnswers } | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  course: string | null;
  created_at: string;
};

/**
 * The underwriting detail, flattened for the feed's free-form `raw` object.
 *
 * Every key is always present, empty when the golfer was not asked — an
 * integrator should not need two code paths for a missing key and a blank one.
 * `insured` and `call_time` are renamed to say what they mean without the
 * conversation as context.
 */
export function toIndweRaw(answers: WhatsappAnswers): Record<string, string> {
  return {
    cover: answers.cover ?? "",
    area: answers.area ?? "",
    vehicle: answers.vehicle ?? "",
    parking: answers.parking ?? "",
    tenure: answers.tenure ?? "",
    currently_insured: answers.insured ?? "",
    preferred_call_time: answers.call_time ?? "",
    channel: "whatsapp",
  };
}

/** Whatever name we actually have. A golfer who messaged us directly may have none. */
export function displayName(row: Pick<WhatsappLeadRow, "first_name" | "last_name">): string {
  return [row.first_name, row.last_name].filter(Boolean).join(" ");
}

/**
 * Completed profiles, newest first.
 *
 * Two things worth knowing about the query:
 *
 * The join to `entries` is a lateral pick of the golfer's most recent entry.
 * `lead_pushes` holds only what the conversation collected — a phone number and
 * a first name — while the email and the course they played live on the entry
 * that started the conversation. A golfer can enter more than once, so "most
 * recent" is the one that matters.
 *
 * The consent filter is belt and braces. The WhatsApp app already gates the
 * whole completion path on an explicit "yes" to sharing with Indwe, so every
 * row here has consented by construction. Asserting it in the query too means a
 * change on that side can never quietly start feeding unconsented golfers into
 * a sponsor's CRM.
 */
export async function listWhatsappLeads(sinceISO?: string): Promise<WhatsappLeadRow[]> {
  const since = sinceISO ?? "1970-01-01T00:00:00.000Z";

  const rows = (await sql()`
    select
      lp.id,
      lp.phone,
      lp.payload,
      lp.created_at,
      e.first_name,
      e.last_name,
      e.email,
      e.course
    from lead_pushes lp
    left join lateral (
      select first_name, last_name, email, course
      from entries
      where entries.phone = lp.phone
      order by entered_at desc
      limit 1
    ) e on true
    where lp.created_at >= ${since}
      and lp.payload -> 'answers' ->> 'indwe_share' = 'yes'
    order by lp.created_at desc
  `) as RawRow[];

  return rows.map((r) => ({
    id: r.id,
    phone: r.phone,
    // The entry is the better source for a name — it was typed into a form
    // rather than carried through a conversation — but a golfer messaging us
    // directly may have no entry at all.
    first_name: r.first_name ?? r.payload?.firstName ?? null,
    last_name: r.last_name,
    email: r.email,
    course: r.course,
    answers: r.payload?.answers ?? {},
    created_at: r.created_at,
  }));
}
