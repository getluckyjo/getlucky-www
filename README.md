# Get Lucky Golf Club — Website (`www`)

Public marketing + entry site for the Get Lucky Hole-in-One Challenge.
Live repo: `getluckyjo/getlucky-www`.

## Stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)
- **Resend** — transactional / notification email
- **PayFast** — payments (vouchers + paid entries)
- **Supabase (Postgres)** — the store for submissions & paid records
- Hosted on **Vercel**

> Supabase is the system-of-record and is **required**. The Google Sheets mirror
> (a shared-secret Apps Script endpoint) was removed in September 2026: its 8s
> timeout had been failing paid entries, and every read path had already moved to
> Postgres. Routes that take money refuse rather than proceed when the database
> is not configured. The historical Sheet still exists as a document; nothing
> writes to it.

## Running locally
```bash
npm install
npm run dev      # starts on http://localhost:3001
```
Other scripts: `npm run build`, `npm run start`, `npm run lint`.

Create a `.env.local` from `.env.example` and fill in real values (never commit it).

## Environment variables
See `.env.example` for the full list. Summary (full matrix produced in Phase 4):

| Var | Purpose | Scope |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | client + server |
| `RESEND_API_KEY` | Resend email sending | server |
| `EMAIL_FROM` / `EMAIL_REPLY_TO` / `EMAIL_NOTIFY_TO` | Email addressing | server |
| `OPS_ALERT_EMAIL` | Ops alerting (health canary) | server |
| `PAYFAST_MERCHANT_ID` / `PAYFAST_MERCHANT_KEY` / `PAYFAST_PASSPHRASE` | PayFast credentials | server |
| `PAYFAST_MODE` | `sandbox` vs `live` | server |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Postgres system-of-record (**required**) | server |
| `INDWE_API_KEY` | Auth for Indwe leads API | server |
| `SPONSOR_API_KEY` | Auth for sponsor entries API | server |

**All secrets are server-only.** Only `NEXT_PUBLIC_*` vars are exposed to the browser.

## Key paths
- `src/lib/db.ts` — Supabase reads/writes, and the `*ToSheet` row adapters
- `src/lib/payfast.ts` — PayFast signing + payment helpers
- `src/lib/email.ts` — Resend wrappers
- `src/app/api/payfast/notify/` — PayFast ITN (payment confirmation) handler
- `src/app/api/forms/` — form submission endpoints
- `src/app/pga-golf-show/` — free simulator entry at the PGA Golf & Lifestyle Show (`docs/pga-golf-show.md`)
- `src/app/api/health/payfast/` — daily PayFast health canary (Vercel cron, 06:00 UTC)
- `src/app/api/indwe/`, `src/app/api/sponsor/` — partner lead APIs

## Deployment
Auto-deploys via Vercel from GitHub. Build: `next build`. Vercel cron config in
`vercel.json`. Set all env vars in the Vercel dashboard for **Production** and
**Preview** environments.
