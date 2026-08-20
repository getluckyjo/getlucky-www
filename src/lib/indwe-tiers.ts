/**
 * The Indwe qualification tiers — one source of truth.
 *
 * The tier tracks *insurance intent*, not payment:
 *   General Lead     — competition-entry intent, no explicit insurance signal
 *   Warm Lead        — engaged, in-person / sponsored context, consent captured
 *   Quote-Ready Lead — explicit quote / risk-review / broker-switch request
 *
 * See docs/indwe/lead-tagging.md for the mapping rationale and sign-off.
 *
 * This lives here rather than inside the API route because the ops lead-quality
 * report reads it too, and a report that tiers leads differently from the feed
 * Indwe actually receives is worse than no report.
 */

export type IndweLeadType =
  | "voucher"
  | "course-entry"
  | "free-entry"
  | "partner"
  | "corporate"
  | "charity"
  | "school"
  | "simulator"
  | "tour"
  | "risk-review"
  | "membership";

export type IndweTier = "General Lead" | "Warm Lead" | "Quote-Ready Lead";

export const LEAD_STAGE_BY_TYPE: Record<IndweLeadType, IndweTier> = {
  voucher: "General Lead",
  "course-entry": "General Lead",
  "free-entry": "Warm Lead",
  partner: "Warm Lead",
  corporate: "Warm Lead",
  charity: "Warm Lead",
  school: "Warm Lead",
  simulator: "Warm Lead",
  tour: "Warm Lead",
  "risk-review": "Quote-Ready Lead",
  membership: "Quote-Ready Lead",
};

/** Ascending insurance intent. Used to order the ramp and the tables. */
export const TIERS_ASCENDING: IndweTier[] = ["General Lead", "Warm Lead", "Quote-Ready Lead"];
