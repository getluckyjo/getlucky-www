# Phase 4 — Environment Variables (findings)

Status: **report only — no fixes applied yet**

## 🟢 Secret exposure — clean
- **`.env.local` and `.env.production.local` are NOT tracked by git** (ignored via
  `.env*.local` in `.gitignore`). No live secrets in history.
- **`.env.example` IS tracked** (correct — it's the template) and contains **only
  blank placeholders** for every secret (`RESEND_API_KEY=`, `SHEETS_SECRET=`,
  `PAYFAST_*=`, `SPONSOR_API_KEY=`, `INDWE_API_KEY=`). No real values committed.
- **Only one `NEXT_PUBLIC_` var** — `NEXT_PUBLIC_SITE_URL` — which is public by
  design. **No secret is exposed to the client** (confirmed again in Phase 3).

## Var → usage matrix (14 vars referenced in code)
All are **runtime** (server-side route/lib), not build-time. ✅ = present in `.env.example`.

| Var | Where used | Secret? | In `.env.example` |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `lib/payfast.ts:33`, health | no (public) | ✅ |
| `RESEND_API_KEY` | `lib/email.ts:7`, health:151 | 🔑 yes | ✅ |
| `EMAIL_FROM` | `lib/email.ts:13` | no | ✅ |
| `EMAIL_NOTIFY_TO` | `lib/email.ts:14` | no | ✅ |
| `EMAIL_REPLY_TO` | `lib/email.ts:15` | no | ✅ |
| `SHEETS_WEBAPP_URL` | `lib/sheets.ts:101`, entry/voucher/health | 🔑 yes | ✅ |
| `SHEETS_SECRET` | `lib/sheets.ts:102`, entry:11, voucher:20 | 🔑 yes | ✅ |
| `PAYFAST_MODE` | `lib/payfast.ts:8`, health:111 | no | ✅ |
| `PAYFAST_MERCHANT_ID` | `lib/payfast.ts:20`, health:74 | semi | ✅ |
| `PAYFAST_MERCHANT_KEY` | `lib/payfast.ts:25`, health:75 | 🔑 yes | ✅ |
| `PAYFAST_PASSPHRASE` | `lib/payfast.ts:30` | 🔑 yes | ✅ |
| `SPONSOR_API_KEY` | `api/sponsor/entries:9` | 🔑 yes | ✅ |
| `INDWE_API_KEY` | `api/indwe/leads:85` | 🔑 yes | ✅ |
| `OPS_ALERT_EMAIL` | `api/health/payfast:19` | no | 🔴 **MISSING** |

## 🟡 Findings

### 1. `OPS_ALERT_EMAIL` used but missing from `.env.example`
`api/health/payfast/route.ts:19` reads it with a **hardcoded fallback**:
`process.env.OPS_ALERT_EMAIL || "johannes@getluckygolfclub.com"`.
Not a crash risk (fallback covers it), but the var is undocumented and the fallback
bakes a personal address into source. **Recommendation:** add
`OPS_ALERT_EMAIL=johannes@getluckygolfclub.com` to `.env.example`.

### 2. `CRON_SECRET` set in `.env.local` but never used
The Vercel cron (`vercel.json` → `/api/health/payfast` daily at 06:00) hits an
endpoint that is **deliberately public** — `route.ts:47-50` documents: *"Public
read-only endpoint. Vercel Cron and the Claude daily routine both hit it without
auth."* So `CRON_SECRET` is **dead config**. **Recommendation (your call):**
- *Either* remove `CRON_SECRET` from `.env.local` (it does nothing), **or**
- gate the endpoint with it (`Authorization: Bearer $CRON_SECRET`) — but that breaks
  the unauthenticated "Claude daily routine" caller, so probably not worth it.
- ⚠️ Editing `.env.local` touches a local secrets file — **flagged, not auto-changed.**

### 3. `KV_REST_API_TOKEN` / `KV_REST_API_URL` set in `.env.local` but never used
No `@vercel/kv` import or `KV_REST_API*` reference anywhere in `src`. Almost
certainly leftover from a Vercel KV integration that was attached then abandoned (or
auto-injected by a still-attached integration). **Recommendation:** if no KV
integration is attached in the Vercel dashboard, remove these two from `.env.local`;
if one is attached, detach it (Phase 6 / Vercel) or leave — harmless but noisy.
⚠️ Touches `.env.local` + Vercel dashboard — **flagged, not auto-changed.**

### 4. (Info) Public health endpoint discloses missing-env-var **names** on failure
On failure the endpoint returns a 503 listing which required env vars are missing
(names only, never values). Deliberate, low risk — noted for completeness, no action
recommended.

## ✅ APPLIED (approved)
1. 🟡 **Added `OPS_ALERT_EMAIL` to `.env.example`** (with the fallback address as the
   example value + a comment noting it's optional). Doc-only, no behaviour change.

## ⚪ YOUR TODO (flagged — touches `.env.local` / Vercel, not auto-changed)
- **Remove unused `CRON_SECRET`** from `.env.local` — the cron health endpoint is
  deliberately public and never reads it, so it's dead config.
- **Remove / detach unused Vercel KV vars** (`KV_REST_API_TOKEN`, `KV_REST_API_URL`)
  — no `@vercel/kv` usage in code. Remove from `.env.local` and, if a KV integration
  is still attached, detach it in the Vercel dashboard.
