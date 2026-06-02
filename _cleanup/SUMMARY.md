# Cleanup / Tightening Pass — SUMMARY

**Repo:** `www` (live site, getluckygolf.co.za) · **Branch:** `cleanup/tightening-pass`
**Date:** 2026-06-02 · **Approach:** findings-first, reversible, nothing forced to main.

## ✅ Final verification (Phase 7)
| Check | Result |
|---|---|
| `tsc --noEmit` | **PASS** (zero errors) |
| `next build` | **PASS** (exit 0, compiled successfully) |
| `npm run lint` | **RUNS** (was crashing before; now exits 1 on 4 *pre-existing* errors — see below) |
| Working tree | **clean** |
| Commits on branch | 4 (phases 1+2, 3, 4, 6) — main untouched |

---

## What changed (by phase)

### Phase 0 — Snapshot / safety net
- Recorded baseline build + repo state. Worked entirely on `cleanup/tightening-pass`.
- 🔴 **Discovered iCloud was corrupting git** (SIGBUS on `.git` files). Relocated all
  4 repos off iCloud Desktop → `~/dev/getlucky/`. See `CRITICAL-icloud-git-corruption.md`.

### Phase 1 — Git / repo hygiene
- `.gitignore`: added `.claude/worktrees/`.
- Deleted 6 already-merged branches; removed 5 stale worktrees.
- Added a `README.md` (corrected: Sheets via Apps Script fetch + shared secret, **not**
  the googleapis SDK).

### Phase 2 — Dependencies / build config
- **Removed `googleapis`** (~194 MB, unused — Sheets is a fetch webhook).
- `npm audit`: vulnerabilities **7 → 2** (resolved the Next HIGH). Remaining 2 are
  transitive `postcss` inside Next — **do not** `audit fix --force` (downgrades to next@9).
- Relaxed over-tight patch pins; `npm update` → next 16.2.7 / react 19.2.7.

### Phase 3 — TypeScript / code health
- 🟢 Type safety excellent: no `any`, no `@ts-ignore`, clean client/server boundary.
- **Deleted** orphaned `src/components/SocialProof.tsx`.
- 🔴 **Wired PayFast ITN source-IP validation** (`isPayfastSourceIpValid`, **fail-open**)
  as defence-in-depth alongside signature + server-side postback.
- Trimmed 7 unused `*Input` type exports.
- 🔴 **Fixed the pre-existingly-broken `npm run lint`** — migrated `eslint.config.mjs`
  off `FlatCompat` to eslint-config-next's native flat config; dropped `@eslint/eslintrc`.

### Phase 4 — Environment variables
- 🟢 **No secret leak**: secret files untracked; `.env.example` holds only placeholders;
  only `NEXT_PUBLIC_` var is the (public) site URL.
- Added missing `OPS_ALERT_EMAIL` to `.env.example`.

### Phase 5 — Supabase safety
- **N/A for www** — no Supabase here (data lives in Google Sheets). See
  `RECOMMENDATION-supabase.md` for the migration recommendation.

### Phase 6 — Vercel / deploy config
- `vercel.json` + `next.config.ts` reviewed — all intentional.
- **Pinned Node to 22.x** (`.nvmrc` + `engines`) to stop local(25)/Vercel(22) drift.

---

## 🔜 DO THIS NEXT (recommended priority order)

### 🔴 High — data safety
1. **Migrate paid/PII data off Google Sheets → Supabase.** Vouchers, entries, and
   member PII currently live in a Sheet behind an Apps Script webhook. See
   `RECOMMENDATION-supabase.md`. (Already in your auto-memory as a reminder.)

### 🟡 Medium — confirm in dashboards (I can't see these from here)
2. **GitHub:** verify `main` branch protection is on.
3. **Vercel:** confirm project Node = **22.x**; confirm all env vars present in
   Production; **detach the unused Vercel KV integration** (Phase 4 #3).
4. **Local:** switch dev off Node 25 → **Node 22** (`nvm use` reads the new `.nvmrc`);
   update any tooling/aliases still pointing at old `~/Desktop` repo paths.
5. **`.env.local` cleanup:** remove unused `CRON_SECRET` and `KV_REST_API_*`.

### 🟡 Medium — code follow-ups (own tasks, behaviour-sensitive)
6. **Fix the 4 surfaced lint errors** (React-correctness pass):
   - `PartnerCourses.tsx:72` — `<a href="/">` → `<Link>`.
   - `ProposalFlipbook.tsx:126,174` — hoist `Viewer` out of render.
   - `CorporateForm.tsx:32` — derive value instead of `setState` in `useEffect`.
7. **Add security headers** (`headers()` in next.config: CSP, X-Frame-Options,
   Referrer-Policy) — test against GA4/GTM/PayFast.

### ⚪ Low — backlog
8. Shared `useFormSubmit()` hook to de-dupe the 6 form components.
9. Remove the 4 `/wp-*` proxy rewrites once the legacy WordPress site is retired.
10. Consider majors when ready: eslint 9→10, typescript 5→6, @types/node 20→25,
    Next 16.3.x (no longer urgent — HIGH vuln already resolved).

---

## How to ship this
```bash
# Review the whole diff vs main
git diff main..cleanup/tightening-pass
# Open a PR (nothing was pushed to main)
gh pr create --base main --head cleanup/tightening-pass
```
All changes are on the branch and reversible. `_cleanup/*.log` build logs are gitignored.
