# Should `www` add Supabase? — Recommendation

**Short answer: Yes — as the durable system-of-record for paid entries, vouchers
and leads. Keep Google Sheets as a human-friendly mirror, not the database.**

## How data flows today
- All form submissions **and paid records** (vouchers + entries, including
  PayFast PaymentID, buyer name/email/mobile, amount, status) are written to
  **Google Sheets** via a single Apps Script Web App, protected by a shared secret
  (`SHEETS_WEBAPP_URL` + `SHEETS_SECRET`). See `src/lib/sheets.ts`.
- The code already documents the fragility: the Apps Script `/exec` endpoint
  "can hang rather than error" (hence the 8s `SCRIPT_TIMEOUT_MS` and the recent
  commit *"time out Apps Script calls so hangs fail fast"*).
- The in-progress WIP branch (`store.ts` / `sync.ts` / `cron/sync-sheets`) is you
  **hand-rolling a reliability layer** around Sheets — a strong signal Sheets is
  being pushed past what it's good for.

## Why Sheets-as-database is risky here
1. **You can lose paid-entry records.** PayFast's notify (ITN) handler writes to
   Sheets; if the Apps Script hangs/times out, that write can be dropped while the
   customer has already paid.
2. **No idempotency.** PayFast can resend ITNs; a blind `append` double-records.
   A DB unique constraint on `reference` / `m_payment_id` prevents duplicates.
3. **POPIA exposure.** Names, emails, mobiles + payment data live in a spreadsheet
   behind a shared secret. The site already publishes a POPIA notice — a real DB
   with access control is a much defensible posture than a Sheet.
4. **No transactions, constraints, or real queries** for reporting/reconciliation.

## Why Supabase specifically (low marginal cost for you)
- You **already run Supabase** on `website` and `Get Lucky Subscriptions` — no new
  vendor, no new learning curve, possibly a reusable project/org.
- Postgres gives you unique constraints (idempotency), proper types, and RLS.

## Recommended shape (phased, low-risk)
- **Phase A — DB as write target.** Create `entries`, `vouchers`, `leads` tables.
  API routes (PayFast notify, forms) write to Postgres first; idempotent upsert on
  `reference`/`m_payment_id`. This is the durability win.
  - **RLS: enable on every table, allow NO public access.** All access is
    server-side via the **service-role key (server-only, never `NEXT_PUBLIC_`)**.
    There's no client-side read/write, so anon policies stay empty/denied.
- **Phase B — Sheets becomes a mirror.** Reuse the cron/sync you're building to
  push DB → Sheet so the team keeps its familiar spreadsheet view, but the Sheet
  is now a *read-only export*, not the source of truth.
- **Phase C (optional)** — migrate contact/partner/agency leads too.

## When NOT to bother
If volumes are genuinely tiny and you'd rather not add infra, the alternative is
to **harden the Sheets path** instead: add idempotency keys + a retry/outbox queue
so a hung Apps Script call can't drop a paid record. Cheaper, but you keep the
POPIA and "spreadsheet as DB" downsides.

**My lean: do Phase A.** Real money + PII flowing through a spreadsheet webhook is
the kind of thing that works until the day it quietly doesn't.

> Note: this is a recommendation, not part of the cleanup branch's changes. Adding
> Supabase is a feature, not a tightening fix — do it as its own piece of work.
