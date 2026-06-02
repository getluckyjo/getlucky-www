# Phase 3 — TypeScript & Code Health (findings)

Status: **report only — no fixes applied yet**

## 🟢 Type safety — excellent
- **`tsc --noEmit`: PASS, zero errors.**
- **No real `any`** in `src` (the single grep hit is the word "any" in a comment).
- **No `@ts-ignore` / `@ts-expect-error` / `eslint-disable`** anywhere. Nothing suppressed.

## 🟢 Client/server boundary — clean
- 11 `"use client"` files, all components/forms (appropriate).
- **No server env vars** (`process.env.*` without `NEXT_PUBLIC_`) referenced in any client component — no secret leak.
- **No server-only libs** (`lib/sheets`, `lib/payfast`, `lib/email`) imported by any client component — server code stays server-side.

## Dead code
| Item | Status | Recommendation |
|---|---|---|
| `src/components/SocialProof.tsx` | **Truly orphaned** — defined, never imported or rendered anywhere. | 🟢 **Safe to delete** (whole file). |
| `payfastNotifyHosts()` — `src/lib/payfast.ts:208` | Exported, **never called**. | 🔴 **Your call — likely a missing security wire-up, not dead code** (see below). |
| 7 unused validation type exports in `src/lib/validation.ts`: `VoucherInput`, `MembershipInput`, `PartnerInput`, `RiskReviewInput`, `AgencyInput`, `CorporateInput`, `FreeEntryInput` | Exported `z.infer` types, unused outside `validation.ts`. (`EntryInput` IS used.) | 🟡 Optional — harmless dead type exports; remove the `export` keyword or leave for API clarity. Zero runtime impact. |

> ts-prune also flagged every `page.tsx`/`layout.tsx` `default`+`metadata`,
> `next.config.ts`, `robots.ts`, `sitemap.ts` — all **false positives** (Next.js
> App Router framework-convention exports). Ignored.

## 🔴 Security note — PayFast ITN host validation not wired
`src/app/api/payfast/notify/route.ts` **does** verify the ITN **signature**
(`verifyNotifySignature`) — good. But `payfastNotifyHosts()` exists to validate the
notify request actually originates from a **PayFast source IP/host**, and it's
**never called**. PayFast's own guidance recommends *both* signature verification
**and** source-IP validation. So this isn't dead code to delete — it's a
defence-in-depth check that was written but never connected.
**Recommendation:** wire `payfastNotifyHosts()` into the notify route as an
additional guard (reject ITNs from non-PayFast hosts), or consciously decide to
drop it. Flagging for your decision — touches payment security, so not auto-changing.

## Duplicated logic (optional refactor, not a fix)
All 6 form components (`AgencyForm`, `CorporateForm`, `EntryForm`, `FreeEntryForm`,
`PartnerForm`, `VoucherForm`) each roll their **own** submit/fetch + loading/error
handling — no shared helper. A `useFormSubmit()` hook would DRY this up, but it's a
behaviour-affecting refactor, so it's out of scope for a tightening pass. Noted for later.

## ✅ RESOLVED — `npm run lint` was BROKEN (pre-existing), now fixed
> Original finding below is kept for the record. **Fix applied** — see APPLIED #4.

### Pre-existing finding — `npm run lint` is BROKEN (not caused by this pass)
`npm run lint` crashes for **both** eslint-config-next 16.2.2 (original `main`) and
16.2.7 — verified by isolation test — so this is **pre-existing**, independent of the
cleanup changes:
```
Oops! Something went wrong! :(
TypeError: Converting circular structure to JSON
  at config-validator.js:308 (@eslint/eslintrc 3.3.5)
```
Cause: ESLint 9 flat config via `FlatCompat` (`eslint.config.mjs`) loading
`next/core-web-vitals` → eslint-plugin-react's flat config contains circular refs
that the legacy `@eslint/eslintrc` validator can't serialize when reporting.
**Impact:** linting hasn't been runnable on this repo. `tsc` + `build` are unaffected.
**Fix (own task):** migrate `eslint.config.mjs` to eslint-config-next's native flat
config (drop `FlatCompat`), or pin a compatible eslint/eslintrc combo. Flagged — not
done here, as it's a config migration worth doing deliberately.

---
## ✅ APPLIED (approved)
1. 🟢 **Deleted `src/components/SocialProof.tsx`** (dead file).
2. 🔴 **Wired PayFast source-IP validation** — added `isPayfastSourceIpValid()` in
   `src/lib/payfast.ts` (uses `payfastNotifyHosts()`, so that export is no longer
   dead) and called it as step 0 in `notify/route.ts`. **Fail-open by design**: only
   rejects a positively-identified non-PayFast IP; a DNS hiccup or missing IP won't
   drop a real paid notification (signature + server-side postback already prove
   authenticity).
3. 🟡 **Removed 7 unused `*Input` type exports** from `validation.ts` (kept
   `EntryInput`, which is used).
4. 🔴 **Fixed the broken `npm run lint`** — migrated `eslint.config.mjs` off
   `@eslint/eslintrc`'s `FlatCompat` to eslint-config-next's **native flat config**
   (`import coreWebVitals from "eslint-config-next/core-web-vitals"` +
   `eslint-config-next/typescript`, spread directly). This sidesteps the circular-ref
   crash in the legacy validator. Also **removed `@eslint/eslintrc`** from
   `devDependencies` (was only there for FlatCompat; no longer referenced).
   `npm run lint` now **runs** instead of crashing.

**Verification:** `tsc --noEmit` clean ✅ · `next build` PASS ✅ · `npm run lint`
**now executes** ✅ (was crashing before).

## 🟡 Surfaced by the lint fix — 4 pre-existing lint errors (now visible)
Because lint was crashing before, these real findings were **never reported**. They
are **pre-existing code patterns** (the app builds & runs fine), and all 4 are
**behaviour-sensitive React refactors** — out of scope for a tightening pass, so
**not auto-fixed**. Flagged for a deliberate follow-up:

| File:line | Rule | Note |
|---|---|---|
| `src/components/PartnerCourses.tsx:72` | `@next/next/no-html-link-for-pages` | `<a href="/">` should be `<Link href="/">`. Lowest-risk of the four. |
| `src/components/ProposalFlipbook.tsx:126` | `react-hooks/static-components` | `Viewer` component declared **inside** render → resets state each render. Hoist it out. |
| `src/components/ProposalFlipbook.tsx:174` | `react-hooks/static-components` | Same pattern (second occurrence). |
| `src/components/forms/CorporateForm.tsx:32` | `react-hooks/set-state-in-effect` | `setMessage()` called synchronously in `useEffect` → cascading renders. Derive the value instead. |

**Recommendation:** address these in a focused React-correctness pass (own task),
not bundled into the cleanup — refactoring working components risks behaviour change.

## ⚪ Backlog (not part of cleanup)
- Shared `useFormSubmit()` hook to de-dupe the 6 form components' submit logic.
- React-correctness pass for the 4 lint errors surfaced above (1 Next `<Link>`
  swap, 2 hoist-component-out-of-render, 1 derive-instead-of-setState-in-effect).
