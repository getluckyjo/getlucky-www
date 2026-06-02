# Phase 2 — Dependencies & Build Config (findings)

Status: **report only — no changes applied yet**
(Repo now at `~/dev/getlucky/www` after the iCloud relocation.)

## 🟢 Safe to REMOVE
| Package | Why | Impact |
|---|---|---|
| `googleapis` | **Not imported anywhere** in `src` (verified on both `cleanup` and `feat/wip-store-sync-cron` branches). Sheets uses plain `fetch` to an Apps Script webhook, not the SDK. | **Frees ~194 MB** from node_modules; smaller installs / faster CI. Zero runtime risk. |

> Note: my Phase-1 README lists `googleapis` as the Sheets mechanism — that's wrong;
> it's a `fetch` webhook. Will correct the README.

## 🟢 Safe to UPDATE (non-breaking)
| Action | Detail |
|---|---|
| `npm audit fix` | Resolves the **moderate** chain `qs` (DoS) and `uuid` (bounds check) → `svix` → `resend`. Non-breaking per npm. |
| Patch bumps (currently blocked by exact pins) | `next` 16.2.2→**16.2.7**, `react`/`react-dom` 19.2.4→**19.2.7** are pinned to exact versions in package.json, so `npm outdated` won't take them. These are patch releases (bugfix + security). |
| `lucide-react` ^1.7.0 → **1.17.0** | Allowed by the caret; large jump within v1 — smoke-test icons render. |
| `@tailwindcss/postcss` + `tailwindcss` 4.2.2 → **4.3.0** | Minor. |
| `@types/react` 19.2.14→19.2.16, `@types/node` patch | Types only. |

## 🔴 NEEDS YOUR CALL (breaking risk / decisions)
| Item | Risk | Recommendation |
|---|---|---|
| **Next.js HIGH security advisories** | The installed Next (16.2.2) is in the vulnerable range. Advisories include **DoS, Middleware/Proxy bypass, App Router XSS, RSC cache poisoning, Image-API DoS, SSRF via WebSocket upgrades**. Fix likely needs **16.3.x** (not just 16.2.7). | **Top priority** for a site taking payments. Upgrade Next on its own branch and test redirects/rewrites/middleware + PayFast flow carefully — `next.config.ts` relies on host-based redirects & WP rewrites that should be re-verified after upgrade. |
| `eslint` 9 → **10** (major) | Lint-only; flat-config API changes. | Optional; low runtime risk, do separately. |
| `typescript` 5 → **6** (major) | New strictness may surface type errors. | Defer until after Phase 3 type cleanup. |
| `@types/node` 20 → **25** (major) | Should match the Node version Vercel actually runs (verify in Phase 6). | Align with Vercel's Node, not local v25. |
| `googleapis` 171 → 173 | Moot — removing it (above). | n/a |

## ➕ Missing dependency (add)
| Package | Why |
|---|---|
| `@eslint/eslintrc` | Imported directly in `eslint.config.mjs` (`FlatCompat`) but only present transitively. Add as a direct **devDependency** so lint doesn't break if the transitive path changes. |

## Config files — reviewed, clean
- **`next.config.ts`** — well-commented. Host redirects (`.com`→`.co.za`), legacy WordPress path redirects, WP passthrough rewrites to `legacy.getluckygolfclub.com`, image `remotePatterns`. The WP passthrough is intentional migration scaffolding — leave for now, candidate to retire once legacy is fully off. **No `ignoreBuildErrors` / `ignoreDuringBuilds`** — nothing masking real errors. ✅
- **`tsconfig.json`** — `strict: true`, standard Next setup, `@/*` path alias. No issues. ✅
- **`postcss.config.mjs`** — single `@tailwindcss/postcss` plugin (Tailwind 4 style). ✅
- **`eslint.config.mjs`** — flat config extending `next/core-web-vitals` + `next/typescript`. ✅ (needs `@eslint/eslintrc` as direct dep, above.)
- No Prettier config present (relies on editor defaults / eslint). Optional to add.

---
## ✅ APPLIED (approved + done)
1. **Removed `googleapis`** → node_modules **684 MB → ~490 MB** (−194 MB).
2. **Added `@eslint/eslintrc`** (`^3.3.5`) as a direct devDependency.
3. **`npm audit fix`** — cleared the `resend`/`svix`/`uuid`/`qs` chain.
4. **Relaxed pins to patch ranges** (`~`) and `npm update`d:
   - `next` 16.2.2 → **16.2.7** (resolves the HIGH Next.js advisory)
   - `react` / `react-dom` 19.2.4 → **19.2.7**
   - `eslint-config-next` 16.2.2 → **16.2.7** (kept in lockstep with next)

### Result
- Vulnerabilities: **7 (1 high, 6 moderate) → 2 moderate.**
- The 2 remaining are the **same transitive `postcss` XSS bundled inside Next**
  (`node_modules/next/node_modules/postcss`). npm's only offered fix is
  `npm audit fix --force`, which **downgrades Next to 9.3.3** — a destructive
  false fix. **Do NOT run it.** Clears only when Next ships a patched postcss.
- **Build: ✅ PASS** (`_cleanup/_phase2-build.log`).
- Fixed README: Sheets is a `fetch` webhook, not the `googleapis` SDK.

## Still flagged for YOUR CALL (not applied)
- `eslint` 9→10, `typescript` 5→6, `@types/node` 20→25 (majors) — do separately.
- Optional deeper Next 16.3.x upgrade — **no longer urgent** now the HIGH is cleared,
  but would also retire the 2 residual moderate postcss advisories.
