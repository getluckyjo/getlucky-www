/**
 * The founders' Q4 2026 scorecard.
 *
 * Targets, owners and due dates come from FOUNDERS-RESET-Q4-2026.md in the
 * getluckyprojectplan repo. Change them HERE and redeploy — the dashboard has no
 * admin UI on purpose, so every target change lands in git with an author and a
 * date.
 *
 * `manual` values are the KPIs with no automated source yet. Update the number,
 * commit, done. Each one carries a `sourceNote` saying what would have to exist
 * for it to become automatic.
 */

export type KpiId =
  | "indweRenewal"
  | "indweLeads"
  | "paymentCompletion"
  | "entryRevenue"
  | "members"
  | "golfDays"
  | "operatingCost"
  | "runwayMonths"
  | "appLive"
  | "pgaLeads";

export type Owner = "Johannes" | "Andrew";

/** How a value is displayed, and how it is compared against target. */
export type KpiKind = "currency" | "number" | "percent" | "months" | "milestone";

export type KpiDef = {
  id: KpiId;
  label: string;
  /** What the number means, in one line, for the person reading it at 08:00 on a Monday. */
  note: string;
  kind: KpiKind;
  /** Baseline recorded when the scorecard was set, 19 Aug 2026. */
  baseline: number | null;
  target: number;
  /** "up" = higher is better. "down" = lower is better. */
  direction: "up" | "down";
  due: string;
  owner: Owner;
  /** Where the live value comes from. */
  source: "auto" | "manual";
  /** Present only for manual KPIs. */
  manualValue?: number;
  sourceNote?: string;
};

export const SCORECARD_SET_ON = "2026-08-19";

export const KPIS: KpiDef[] = [
  {
    id: "indweRenewal",
    label: "Indwe 2027 renewal",
    note: "Year two of three. The single most important number in the business.",
    kind: "milestone",
    baseline: 0,
    target: 1,
    direction: "up",
    due: "2026-11-30",
    owner: "Andrew",
    source: "manual",
    manualValue: 0,
    sourceNote: "Flip to 1 when the 2027 agreement is signed.",
  },
  {
    id: "indweLeads",
    label: "Leads to Indwe / month",
    note: "What the sponsorship actually buys. Counted from the live lead feed.",
    kind: "number",
    // 267 is the true average across complete months May–Jul, corrected 20 Aug:
    // the first version of this metric counted only the `leads` table and
    // omitted paid entries and vouchers, which the feed tags General Lead and
    // does send. The target is therefore "hold the pre-retrenchment run rate"
    // rather than a growth number — August is tracking well below it.
    baseline: 267,
    target: 250,
    direction: "up",
    due: "2026-10-31",
    owner: "Andrew",
    source: "auto",
  },
  {
    id: "paymentCompletion",
    label: "Entry payment completion",
    note: "Share of entry attempts that reach paid. Below 90% means we are losing money at checkout.",
    kind: "percent",
    baseline: 83,
    target: 95,
    direction: "up",
    due: "2026-09-15",
    owner: "Johannes",
    source: "auto",
  },
  {
    id: "entryRevenue",
    label: "Digital entry revenue / month",
    note: "Paid website entries only. Excludes on-course Zapper and sponsorship.",
    kind: "currency",
    baseline: 7300,
    target: 30000,
    direction: "up",
    due: "2026-12-31",
    owner: "Johannes",
    source: "auto",
  },
  {
    id: "members",
    label: "Paid members",
    note: "Active R149/month subscriptions.",
    kind: "number",
    baseline: 48,
    target: 250,
    direction: "up",
    due: "2026-12-31",
    owner: "Johannes",
    source: "manual",
    manualValue: 48,
    sourceNote:
      "Becomes automatic once the subscriptions Supabase project exposes an active-subscription table to SUBSCRIPTIONS_SUPABASE_URL (today it only exposes indwe_leads).",
  },
  {
    id: "golfDays",
    label: "Golf days booked",
    note: "Confirmed Pay Before You Play days.",
    kind: "number",
    baseline: 0,
    target: 40,
    direction: "up",
    due: "2026-12-31",
    owner: "Andrew",
    source: "manual",
    manualValue: 0,
    sourceNote: "Becomes automatic when Golf Day Pro exposes a confirmed-bookings feed.",
  },
  {
    id: "operatingCost",
    label: "Monthly operating cost",
    note: "Post-retrenchment run rate.",
    kind: "currency",
    baseline: 250000,
    target: 150000,
    direction: "down",
    due: "2026-09-30",
    owner: "Johannes",
    source: "manual",
    manualValue: 250000,
    sourceNote: "Becomes automatic against the Xero profit-and-loss expense total.",
  },
  {
    id: "runwayMonths",
    label: "Cash runway",
    note: "Months of cover at the current run rate.",
    kind: "months",
    baseline: 2,
    target: 6,
    direction: "up",
    due: "2026-10-31",
    owner: "Johannes",
    source: "manual",
    manualValue: 2,
    sourceNote: "Becomes automatic against the Xero cash position and the cost run rate.",
  },
  {
    id: "appLive",
    label: "App v1 live",
    note: "Pick course, pick stake, pay, film, submit, ace feed.",
    kind: "milestone",
    baseline: 0,
    target: 1,
    direction: "up",
    due: "2026-10-31",
    owner: "Johannes",
    source: "manual",
    manualValue: 0,
    sourceNote: "Flip to 1 on ship.",
  },
  {
    id: "pgaLeads",
    label: "PGA Show leads",
    note: "18–21 September. The biggest single capture opportunity of the quarter.",
    kind: "number",
    baseline: 0,
    target: 1000,
    direction: "up",
    due: "2026-09-21",
    owner: "Andrew",
    source: "manual",
    manualValue: 0,
    sourceNote:
      "Becomes automatic once show entries carry a dedicated source tag on the free-entry form.",
  },
];
