# Phase 6 — Vercel & Deploy Config (findings)

Status: **report only — no fixes applied yet**

## 🟢 `vercel.json` — minimal and valid
- Has `$schema`, one cron: `/api/health/payfast` at `0 6 * * *` (daily 06:00 UTC).
- No custom regions/functions/build overrides → uses Vercel defaults (fine for this app).
- Cron target is a **deliberately public** endpoint (see Phase 4 #4) — no auth needed.

## 🟢 `next.config.ts` — intentional, well-commented
- **Image `remotePatterns`** cover both brand domains (`getluckygolfclub.com`,
  `getluckygolf.co.za` + www/legacy). Correct.
- **`redirects()`** — legacy `.com` → primary `.co.za` (301, path-preserving) + old
  WordPress URLs → new pages. All `permanent: true`. Sensible SEO migration.
- **`rewrites()` (beforeFiles)** — `/wp-admin`, `/wp-content`, `/wp-includes`,
  `/wp-json` proxied to `legacy.getluckygolfclub.com`. Intentional during migration.

## 🟡 Findings

### 1. No Node version pinned — build reproducibility gap
- **No `engines.node` in package.json, no `.nvmrc`.** Local is **Node v25.4.0**.
- Vercel picks its own default (currently **Node 22.x**) — and Vercel only supports
  even LTS majors (18/20/22), **not 25**. So local dev (25) and the Vercel build (22)
  are on **different majors** with nothing pinning either.
- Low risk today (build passes), but a silent drift waiting to bite.
- **Recommendation:** add a pin that matches Vercel's runtime — e.g. `.nvmrc` with
  `22` and/or `"engines": { "node": "22.x" }` in package.json. ⚠️ Must match the
  Node version set in the **Vercel project settings** — confirm there first, since a
  mismatched `engines` can *fail* the Vercel build.

### 2. No security headers (CSP / X-Frame-Options / Referrer-Policy)
- No `headers()` block in `next.config.ts` and none in `vercel.json`.
- Vercel adds `Strict-Transport-Security` on its domains automatically, but **CSP,
  X-Frame-Options, X-Content-Type-Options, Referrer-Policy are NOT set.**
- This is a payment/PII-handling site, so defence-in-depth headers are worth having.
- **Recommendation (own task):** add a `headers()` block. ⚠️ Behaviour-affecting —
  a strict CSP can break inline scripts / GA4 / GTM / PayFast redirects, so it needs
  deliberate testing. **Out of scope for a tightening pass — flagged, not auto-applied.**

### 3. WordPress proxy rewrites — remove post-migration
- The `/wp-*` rewrites keep a live dependency on `legacy.getluckygolfclub.com` and
  expose proxy paths (incl. `/wp-admin`). Intentional *during* the WP→Next migration.
- **Recommendation:** once the legacy site is fully retired, delete these 4 rewrites.
  Not now — they're load-bearing during migration. Backlog item.

## ✅ APPLIED (approved)
1. 🟡 **Pinned Node to 22.x** — added `.nvmrc` (`22`) + `"engines": { "node": "22.x" }`
   in package.json. Aligns the repo with Vercel's LTS default. **⚠️ Action for you:**
   confirm the Vercel project's Node setting is 22.x, and switch local dev off Node 25
   to 22 (`nvm use` will now read `.nvmrc`).

## ⚪ Backlog / YOUR TODO (not auto-changed)
- **Security headers** (#2) — add a `headers()` block (CSP, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy). Behaviour-sensitive (CSP vs GA4/GTM/
  PayFast) — needs a deliberate, tested task.
- **WordPress proxy rewrites** (#3) — delete the 4 `/wp-*` rewrites once the legacy
  site is retired.
- **Vercel dashboard checks** (I can't see these from here): Node version = 22.x,
  the unused KV integration (Phase 4 #3), domains, env vars present in Production.

> ℹ️ I can't read the Vercel **dashboard** (project Node version, env vars, domains,
> KV integration from Phase 4 #3) from here without the Vercel CLI / your login.
> Those checks are flagged for you to confirm in the dashboard.
