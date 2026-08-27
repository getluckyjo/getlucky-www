/**
 * Read-only access to the Get Lucky WhatsApp project's database
 * (getluckyjo/twillio), a SEPARATE Neon Postgres from this site's Supabase.
 *
 * Its `lead_pushes` table holds one row per golfer who completed the WhatsApp
 * profiling conversation: the questions Indwe need to quote, answered by the
 * golfer, with explicit consent to their details being shared — and, since the
 * 27 August 2026 rewrite, a specific day and hour they were told an Indwe
 * Advisor would call.
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

/**
 * The profiling answers, keyed by step id. Absent keys mean the golfer was not
 * asked — the conversation branches, so a golfer wanting only personal cover
 * never sees the two business questions and vice versa.
 *
 * Rewritten 27 August 2026 alongside the WhatsApp journey. The previous shape
 * asked about a suburb, a vehicle, where it parked and whether the golfer owned
 * or rented; none of those questions exist any more. Nothing was lost with
 * them: no completed profile had ever reached Indwe under the old shape.
 */
export type WhatsappAnswers = {
  /** business | personal | both — which line of cover to quote. */
  line?: string;
  /** assets | liabilities | both — business only. */
  business_cover?: string;
  /** below_15000 | 15000_30000 | above_30000 — monthly, business only. */
  business_premium?: string;
  /** car | home | both — personal only. */
  cover?: string;
  /** below_2500 | 2500_5000 | above_5000 — monthly, personal only. */
  personal_premium?: string;
  /** Free text. A golfer with no cover answers "no" or "none". */
  insurer?: string;
  /** eastern_cape … western_cape — one of the nine. */
  province?: string;
  /** YYYY-MM-DD — the working day the golfer chose for their call. */
  call_date?: string;
  /** HH:00 — the hour that call starts. Slots run 08:00 to 16:00. */
  call_time?: string;
  /** yes | no — consent to share with Indwe. Only "yes" ever reaches this table. */
  indwe_share?: string;
};

/**
 * Stored values that do not read as English on a CRM screen.
 *
 * The same reasoning that renames `insured` to `currently_insured` on the way
 * out: a consultant reading this lead does not have the conversation as
 * context. `car`, `assets` and `both` are already words and pass through
 * untouched; `15000_30000` and `kwazulu_natal` are not, and would make someone
 * guess.
 */
const LABELS: Record<string, string> = {
  // Monthly premium bands, business.
  below_15000: "Below R15,000",
  "15000_30000": "R15,000 – R30,000",
  above_30000: "Above R30,000",
  // Monthly premium bands, personal.
  below_2500: "Below R2,500",
  "2500_5000": "R2,500 – R5,000",
  above_5000: "Above R5,000",
  // Provinces.
  eastern_cape: "Eastern Cape",
  free_state: "Free State",
  gauteng: "Gauteng",
  kwazulu_natal: "KwaZulu-Natal",
  limpopo: "Limpopo",
  mpumalanga: "Mpumalanga",
  north_west: "North West",
  northern_cape: "Northern Cape",
  western_cape: "Western Cape",
};

function label(value: string | undefined): string {
  if (!value) return "";
  return LABELS[value] ?? value;
}

/**
 * A province as a person would write it.
 *
 * Exported because the feed route puts it in the top-level `address` field,
 * where "kwazulu_natal" would be plainly wrong. An unrecognised value is
 * returned as-is rather than throwing — a golfer whose answer failed to parse
 * twice has their raw text stored, and that is still better than a blank.
 */
export function provinceLabel(province: string | undefined): string {
  return label(province);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * The appointment, as a consultant would read it: "Wed 2 Sep, 10:00–11:00".
 *
 * Empty rather than approximate when either half is missing or malformed. A
 * booking answer that could not be parsed twice is stored as the golfer's raw
 * text, and a slot string assembled out of that would read as an appointment
 * nobody actually holds — which is the one thing worth being strict about here,
 * because the golfer was told a specific time.
 */
function callSlot(answers: WhatsappAnswers): string {
  const date = answers.call_date ?? "";
  const time = answers.call_time ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:00$/.test(time)) return "";

  const [year, month, day] = date.split("-").map(Number);
  const at = new Date(Date.UTC(year, month - 1, day));
  // Date.UTC rolls an impossible date over (2026-02-31 becomes March), so check
  // the parts survived rather than trusting the regex alone.
  if (at.getUTCMonth() !== month - 1 || at.getUTCDate() !== day) return "";

  const hour = Number(time.slice(0, 2));
  const to = String(hour + 1).padStart(2, "0");
  return `${DAYS[at.getUTCDay()]} ${day} ${MONTHS[month - 1]}, ${time}–${to}:00`;
}

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
 * A golfer quoting on one line of cover leaves the other line's two keys empty,
 * which is the common case rather than the exception.
 *
 * `insurer` becomes `current_insurer` for the same reason `insured` used to
 * become `currently_insured`: the key has to mean something to someone who was
 * not in the conversation.
 *
 * `indwe_share` is deliberately absent. It is the consent gate, not
 * underwriting detail, and passing it through would invite it being read as a
 * field Indwe can act on.
 */
export function toIndweRaw(answers: WhatsappAnswers): Record<string, string> {
  return {
    line: answers.line ?? "",
    business_cover: answers.business_cover ?? "",
    business_premium: label(answers.business_premium),
    cover: answers.cover ?? "",
    personal_premium: label(answers.personal_premium),
    current_insurer: answers.insurer ?? "",
    province: provinceLabel(answers.province),
    // Both halves of the booking, raw, for anything that wants to sort or diary
    // by them...
    call_date: answers.call_date ?? "",
    call_time: answers.call_time ?? "",
    // ...and the same thing as a consultant would read it. This is the field
    // that matters: the golfer was told an Advisor would ring at this time.
    call_slot: callSlot(answers),
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
