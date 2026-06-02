# Phase 1 — Repository & Git Hygiene (findings)

Status: **report only — no fixes applied yet**

## ✅ Secrets — CLEAN (the important one)
- **No `.env` file was ever committed** in any branch's history. Only `.env.example` is tracked (correct — it's a placeholder template).
- **No hardcoded secret literals** in tracked source (scanned for Resend `re_`, Google `AIza`, JWTs, PEM blocks, inline passwords).
- **Conclusion: no key rotation required.** Your secrets have stayed in local `.env` only.

## `.gitignore` — good, one gap
Covers `.env*`, `.next/`, `node_modules/`, `.vercel/`, `.firecrawl/`, `.DS_Store`, logs, lockfiles. Solid.
- ⚠️ **Gap:** `.claude/worktrees/` (899 MB) is NOT ignored and is sitting untracked in the repo. Should be added to `.gitignore`.
- Minor: `_cleanup/` (this audit trail) is currently untracked — decide whether to ignore or keep.

## Branches — significant sprawl (13 local, 6 remote)
### Merged into `main` → safe to delete (6)
| Branch | Last commit |
|---|---|
| `claude/kind-faraday-0ba1f2` | 2026-05-15 |
| `claude/pensive-golick-fd0bdd` | 2026-05-15 |
| `claude/romantic-noyce-ba12bf` | 2026-05-14 |
| `www-pr-2-docs-cleanup` | 2026-05-12 |
| `www-pr-3-rename-form2` | 2026-05-12 |
| `www-pr-4-restore-form2` | 2026-05-12 |

### NOT merged → your call (deleting loses commits) (6)
| Branch | Last commit | Note |
|---|---|---|
| `feat/wip-store-sync-cron` | 2026-06-02 | **KEEP** — your in-progress work parked here today |
| `claude/relaxed-saha-a8e1c7` | 2026-05-19 | also on remote; likely abandoned experiment |
| `fix/join-club-redirect` | 2026-05-15 | on remote; unmerged fix — finished or abandoned? |
| `feat/require-email` | 2026-05-15 | on remote; unmerged feature |
| `fix/payfast-field-order` | 2026-05-15 | on remote; **note: a same-named change is already in main** — may be a dup |
| `claude/distracted-haslett-02268e` | 2026-05-14 | local-only experiment |

## Large files committed (real assets, but unoptimized)
| File | Size |
|---|---|
| `public/images/golf-day-video.mp4` | ~13.9 MB |
| `public/images/golf-day/IMG_4572.jpg` (+ ~10 more) | 4–7.5 MB each |
| `public/GLG_Golf_Course_Proposal_2026.pdf` | ~6.9 MB |
These belong in the repo (the site serves them) but the JPGs are full-res and
should be optimized/resized for web. Not a delete — a Phase 2/perf follow-up.

## README — MISSING
No `README.md` at all. A future you (or a dev) can't tell how to run this,
what env vars are needed, or how the Sheets/PayFast/Indwe pieces fit.
Recommend adding a short one (covered partly by the env matrix in Phase 4).

## main protection — verify in GitHub
Can't be checked from the local clone. **Action for you:** confirm branch
protection on `main` in GitHub settings (require PR, no direct force-push).

---
## Recommended safe fixes (await approval)
1. Add `.claude/worktrees/` to `.gitignore` (stops 899 MB from ever being staged).
2. Delete the 6 merged branches (local; remote deletion only if you confirm).
3. Add a minimal `README.md`.
4. Optionally `.gitignore` the `_cleanup/` audit folder.

**Not auto-doing:** deleting unmerged branches, image optimization, anything on the remote.
