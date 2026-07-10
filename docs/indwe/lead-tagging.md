# Indwe — Lead Tagging Spec

Status: **IMPLEMENTED** (2026-07-07) — signed off by Johannes
Owner: Johannes · Consumer: Indwe (Wilhelm) via `GET /api/indwe/leads`

## Purpose

GLG want every lead we hand to Indwe stamped with a qualification tag so Wilhelm's
team can prioritise. The three tiers GLG communicated are:

- **General Lead** — top-of-funnel, competition-entry intent, no explicit insurance signal.
- **Warm Lead** — engaged, in-person / sponsored context, consent captured.
- **Quote-Ready Lead** — explicit insurance intent (requested a quote / risk review / broker switch).

## Where the tag lives (technical)

Indwe reads one field on each lead from `GET /api/indwe/leads`: **`leadStage`**.

`leadStage` is populated from a `"Lead Stage"` value written at capture time:
- **Sheets path:** the `"Lead Stage"` column on each submission tab.
- **Postgres path:** `data.lead_stage` on the `leads` row, surfaced by `leadToSheet()`.

### Current reality (as of this draft)

| Form type (`type`) | Entry point | `leadStage` today |
|--------------------|-------------|-------------------|
| `risk-review`  | Indwe microsite (banner) | `Direct Warm Lead` ✅ |
| `membership`   | R149 membership / broker switch | pipeline status (`pending`…) 🟡 |
| `voucher`      | Online competition purchase | *(empty)* ❌ |
| `course-entry` | On-course paid QR entry | *(empty)* ❌ |
| `free-entry`   | `/form-2` sponsored golf-day entry | *(empty)* ❌ |
| `partner`      | Course partner enquiry | *(empty)* ❌ |
| `corporate`    | Corporate golf-day enquiry | *(empty)* ❌ |
| `charity`      | Charity golf-day enquiry | *(empty)* ❌ |
| `simulator`    | Simulator venue enquiry | *(empty)* ❌ |

Two gaps block "tag every form":
1. No per-form `leadStage` value is written (except risk-review).
2. `leadToSheet()` only surfaces `data.lead_stage` for the `risk_review` case, so even
   if we wrote it for other types it wouldn't reach Indwe. **Fix:** promote `"Lead Stage"`
   into the shared `base` object in `leadToSheet()`.

## Proposed tag mapping

Canonical `leadStage` strings: `General Lead` · `Warm Lead` · `Quote-Ready Lead`.

| Form type      | Entry point | Proposed `leadStage` |
|----------------|-------------|----------------------|
| `voucher`      | Online competition purchase | **General Lead** |
| `course-entry` | On-course paid QR entry | **General Lead** |
| `free-entry`   | `/form-2` sponsored golf-day entry | **Warm Lead** |
| `partner`      | Course partner enquiry | **Warm Lead** |
| `corporate`    | Corporate golf-day enquiry | **Warm Lead** |
| `charity`      | Charity golf-day enquiry | **Warm Lead** |
| `school`       | School fundraising golf-day enquiry | **Warm Lead** |
| `simulator`    | Simulator venue enquiry | **Warm Lead** |
| `risk-review`  | Indwe microsite (banner) | **Quote-Ready Lead** |
| `membership`   | R149 membership / broker switch | **Quote-Ready Lead** |

Rationale: the tier tracks *insurance intent*, not payment. A voucher buyer entered a
competition (General); a golf-day / sponsored / partner contact engaged us in person with
consent (Warm); a risk-review or broker-switch is an explicit quote request (Quote-Ready).

## Decisions (resolved 2026-07-07)

1. **Label wording** → **Use the 3 exact strings.** `General Lead / Warm Lead / Quote-Ready Lead`.
   Risk-review's old `Direct Warm Lead` is retired in favour of `Quote-Ready Lead`.
   *Action item: confirm Wilhelm isn't filtering on the old string on his side.*
2. **Voucher tier** → **General Lead** (competition-entry intent, no insurance signal).
3. **Membership field** → **`leadStage = "Quote-Ready Lead"`**, pipeline state kept in `raw.status`.

## Implementation (done)

The tag is derived from the **lead type** in `api/indwe/leads/route.ts` via a single
`LEAD_STAGE_BY_TYPE` map — one source of truth, so every lead (including historical rows)
emits exactly one canonical tier string with no per-Sheet-tab migration required.

- [x] `LEAD_STAGE_BY_TYPE` map added in `api/indwe/leads/route.ts`.
- [x] `normalize()` sets `leadStage` from the type map.
- [x] `membershipToLead()` sets `leadStage = "Quote-Ready Lead"`; pipeline state stays in `raw.status`.
- [x] `risk-review` route stores `"Quote-Ready Lead"` for Sheet/DB readability.
- [x] `docs/indwe/api.md` field reference documents the `leadStage` enum.

### Optional follow-ups (not required for Indwe to see the tag)

- [ ] Backfill the `"Lead Stage"` column on the non-risk-review Sheet tabs (Apps Script)
      if the team wants the tag visible directly in the raw Google Sheets too. The Indwe
      API already returns the correct tag regardless.
