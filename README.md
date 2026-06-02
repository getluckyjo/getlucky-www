# Get Lucky Golf Club — Website (`www`)

Public marketing + entry site for the Get Lucky Hole-in-One Challenge.
Live repo: `getluckyjo/getlucky-www`.

## Stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (via `@tailwindcss/postcss`)
- **Resend** — transactional / notification email
- **PayFast** — payments (vouchers + paid entries)
- **Google Sheets** (Apps Script Web App, called via `fetch` + shared secret) — current store for submissions & paid records
- Hosted on **Vercel**

> No database yet — submissions and paid records are written to Google Sheets via a
> shared-secret Apps Script endpoint (`src/lib/sheets.ts`). See
> `_cleanup/RECOMMENDATION-supabase.md` for the case to move paid/PII data to Supabase.

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
| `SHEETS_WEBAPP_URL` / `SHEETS_SECRET` | Apps Script endpoint + shared secret | server |
| `INDWE_API_KEY` | Auth for Indwe leads API | server |
| `SPONSOR_API_KEY` | Auth for sponsor entries API | server |

**All secrets are server-only.** Only `NEXT_PUBLIC_*` vars are exposed to the browser.

## Key paths
- `src/lib/sheets.ts` — Google Sheets submission/read layer
- `src/lib/payfast.ts` — PayFast signing + payment helpers
- `src/lib/email.ts` — Resend wrappers
- `src/app/api/payfast/notify/` — PayFast ITN (payment confirmation) handler
- `src/app/api/forms/` — form submission endpoints
- `src/app/api/health/payfast/` — daily PayFast health canary (Vercel cron, 06:00 UTC)
- `src/app/api/indwe/`, `src/app/api/sponsor/` — partner lead APIs

## Deployment
Auto-deploys via Vercel from GitHub. Build: `next build`. Vercel cron config in
`vercel.json`. Set all env vars in the Vercel dashboard for **Production** and
**Preview** environments.
