# Phase 0 — Snapshot & Safety Net

**Repo:** `www` (`get-lucky-golf-club-www`)
**Date:** 2026-06-02
**Branch created:** `cleanup/tightening-pass` (off `main` @ `2ee2ecf`)
**Remote:** `https://github.com/getluckyjo/getlucky-www.git`

## Pre-flight: dirty working tree handled
`main` had uncommitted in-progress work. Per user instruction, committed it to a
safety branch **`feat/wip-store-sync-cron`** before branching for cleanup:
- Modified: `.env.example`, `package.json`, `package-lock.json`,
  `src/app/api/forms/entry/route.ts`, `src/app/api/payfast/notify/route.ts`,
  `src/app/form/success/page.tsx`, `src/lib/sheets.ts`, `vercel.json`
- New: `src/lib/store.ts`, `src/lib/sync.ts`, `src/app/api/cron/sync-sheets/route.ts`,
  Indwe docs, `google-ads-campaign/` CSVs
- **Excluded** from commit: `.claude/worktrees/` (899 MB — must be gitignored, Phase 1)

## Environment
| Item | Value |
|---|---|
| Node | v25.4.0 (⚠️ non-LTS / odd major — Vercel likely runs different) |
| npm | 11.7.0 |
| Package manager | npm (only `package-lock.json` present) |
| node_modules | present |

## Stack (actual vs. assumed)
| Dep | Version | Note |
|---|---|---|
| next | 16.2.2 | ⚠️ assumed "Next.js 15" — actually **16** |
| react / react-dom | 19.2.4 | |
| tailwindcss | ^4 | via `@tailwindcss/postcss` |
| zod | ^4.4.3 | |
| googleapis | ^171.4.0 | Sheets integration |
| resend | ^6.12.2 | transactional email |
| eslint / eslint-config-next | ^9 / 16.2.2 | |
| typescript | ^5 | |

**No Supabase libraries present** — Phase 5 (Supabase review) is N/A for this repo.
Data layer = Google Sheets + Resend + PayFast (HTTP).

## Baseline build
`npm run build` → **PASS** (exit 0). Full log: `_cleanup/_baseline-build.log`.
Routes compiled include several form endpoints, PayFast notify/health,
Indwe leads, sponsor entries, plus static marketing pages. The repo builds
clean as-is — safe to proceed with the cleanup pass.
