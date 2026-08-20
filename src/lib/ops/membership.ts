/**
 * The membership growth funnel.
 *
 * The Q4 target is 48 members → 250. The question that decides whether that is
 * achievable is not "how many golfers do we reach" but "how many of the ones we
 * already reached can we lawfully contact" — and the answer is much smaller
 * than the raw lead count suggests.
 *
 * So this module measures the funnel end to end:
 *
 *   leads captured → unique golfers → consented → not already a member
 *
 * and builds an invite queue from the survivors. Consent is a hard gate, not a
 * filter that can be toggled: a golfer who declined, or who was never asked,
 * never enters the queue. Roughly three quarters of the historical list was
 * never asked, which is exactly why the entry forms now ask (see
 * CONSENT_FORM_VERSION in src/lib/whatsapp.ts).
 */

import { COURSE_SLUGS } from "@/lib/constants";
import { isSubsDbConfigured, listMembers } from "@/lib/subscriptions-db";
import { loadIndweReport, type IndweLead } from "@/lib/ops/indwe";
import type { DataSource } from "@/lib/ops/metrics";

const MEMBERSHIP_HOST = "https://membership.getluckygolfclub.com";

export type ConsentState = "consented" | "declined" | "never asked";

export type Golfer = {
  email: string;
  mobile: string;
  entries: number;
  consent: ConsentState;
  /** The course they engaged with most — used to personalise the join link. */
  homeCourse: string;
  joinUrl: string | null;
  lastSeen: string;
  isMember: boolean;
};

export type MembershipFunnel = {
  source: DataSource;
  error: string | null;
  membersKnown: boolean;
  /** Every lead row in the window. */
  leadRows: number;
  golfers: Golfer[];
  uniqueGolfers: number;
  consented: number;
  declined: number;
  neverAsked: number;
  alreadyMembers: number;
  /** Consented, contactable, not already a member. The only people we may invite. */
  queue: Golfer[];
  repeatInQueue: number;
  /**
   * How concentrated the queue is. A queue that is mostly one event's list is
   * far less useful than its size suggests, and reads as a broad base unless
   * you say otherwise.
   */
  queueConcentration: {
    topCourse: string;
    topCourseShare: number;
    topMonth: string;
    topMonthShare: number;
  } | null;
  members: {
    total: number;
    active: number;
    cancelled: number;
    failed: number;
    /** Active members with no payment recorded in 40 days — the win-back list. */
    stale: number;
  } | null;
};

/**
 * A golfer's consent is the best signal they ever gave us: an explicit yes on
 * any submission counts, an explicit no overrides silence, and silence means
 * they were never asked. A "no" can never be overridden by a later blank.
 */
function consentOf(rows: IndweLead[]): ConsentState {
  const values = rows.map((r) => r.consent.toLowerCase());
  if (values.some((v) => v.startsWith("n"))) return "declined";
  if (values.some((v) => v.startsWith("y"))) return "consented";
  return "never asked";
}

function joinUrlFor(course: string): string | null {
  const slug = COURSE_SLUGS[course as keyof typeof COURSE_SLUGS];
  return slug ? `${MEMBERSHIP_HOST}/join/${slug}` : null;
}

export async function loadMembershipFunnel(
  months = 6,
  now = new Date(),
): Promise<MembershipFunnel> {
  const report = await loadIndweReport(months, now);

  // Group every lead by the person who left it.
  const byEmail = new Map<string, IndweLead[]>();
  for (const l of report.leads) {
    if (!l.email) continue;
    const list = byEmail.get(l.email) ?? [];
    list.push(l);
    byEmail.set(l.email, list);
  }

  let memberEmails = new Set<string>();
  let members: MembershipFunnel["members"] = null;
  let membersKnown = false;
  if (isSubsDbConfigured()) {
    try {
      const rows = await listMembers();
      memberEmails = new Set(rows.map((m) => (m.email || "").trim().toLowerCase()).filter(Boolean));
      const staleBefore = new Date(now.getTime() - 40 * 86400000).toISOString();
      members = {
        total: rows.length,
        active: rows.filter((m) => m.subscription_status === "active").length,
        cancelled: rows.filter((m) => m.subscription_status === "cancelled").length,
        failed: rows.filter((m) => m.subscription_status === "failed").length,
        stale: rows.filter(
          (m) =>
            m.subscription_status === "active" &&
            (m.plan_type === "monthly" || m.plan_type === "monthly_freemonth") &&
            (!m.last_payment_date || m.last_payment_date < staleBefore),
        ).length,
      };
      membersKnown = true;
    } catch {
      // Without the members table we can still measure the funnel; we just
      // cannot subtract existing members, so the queue is reported as a
      // maximum rather than a target list. Flagged on the page.
    }
  }

  const golfers: Golfer[] = [...byEmail.entries()]
    .map(([email, rows]) => {
      const courses = new Map<string, number>();
      for (const r of rows) if (r.where) courses.set(r.where, (courses.get(r.where) ?? 0) + 1);
      const homeCourse = [...courses.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
      return {
        email,
        mobile: rows.find((r) => r.mobile)?.mobile ?? "",
        entries: rows.length,
        consent: consentOf(rows),
        homeCourse,
        joinUrl: joinUrlFor(homeCourse),
        lastSeen: rows.map((r) => r.ts).sort().reverse()[0] ?? "",
        isMember: memberEmails.has(email),
      };
    })
    .sort((a, b) => b.entries - a.entries || b.lastSeen.localeCompare(a.lastSeen));

  const queue = golfers.filter(
    (g) => g.consent === "consented" && !g.isMember && (g.email || g.mobile),
  );

  const share = (counts: Map<string, number>) => {
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return top ? { key: top[0], share: Math.round((top[1] / queue.length) * 100) } : null;
  };
  const courseCounts = new Map<string, number>();
  const monthCounts = new Map<string, number>();
  for (const g of queue) {
    if (g.homeCourse) courseCounts.set(g.homeCourse, (courseCounts.get(g.homeCourse) ?? 0) + 1);
    const m = g.lastSeen.slice(0, 7);
    if (m) monthCounts.set(m, (monthCounts.get(m) ?? 0) + 1);
  }
  const topCourse = share(courseCounts);
  const topMonth = share(monthCounts);

  return {
    source: report.source,
    error: report.error,
    membersKnown,
    leadRows: report.total,
    golfers,
    uniqueGolfers: golfers.length,
    consented: golfers.filter((g) => g.consent === "consented").length,
    declined: golfers.filter((g) => g.consent === "declined").length,
    neverAsked: golfers.filter((g) => g.consent === "never asked").length,
    alreadyMembers: golfers.filter((g) => g.isMember).length,
    queue,
    repeatInQueue: queue.filter((g) => g.entries > 1).length,
    queueConcentration:
      queue.length && topCourse && topMonth
        ? {
            topCourse: topCourse.key,
            topCourseShare: topCourse.share,
            topMonth: topMonth.key,
            topMonthShare: topMonth.share,
          }
        : null,
    members,
  };
}
