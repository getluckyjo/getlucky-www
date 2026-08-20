/**
 * /ops/membership — the growth funnel from golfer to member.
 *
 * The target is 48 → 250 by 31 December. This page exists to answer whether the
 * list we already hold can get us there, and to make the answer impossible to
 * misread. It cannot: consent, not reach, is the binding constraint.
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isOpsSessionValid, OPS_COOKIE } from "@/lib/ops/auth";
import { loadMembershipFunnel } from "@/lib/ops/membership";
import { KPIS } from "@/lib/ops/targets";
import { Funnel } from "../parts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Membership funnel",
  robots: { index: false, follow: false, nocache: true },
};

/** A generous but not fantastical cold-invite conversion, for the arithmetic. */
const OPTIMISTIC_CONVERSION = 0.2;

export default async function MembershipPage() {
  const jar = await cookies();
  if (!isOpsSessionValid(jar.get(OPS_COOKIE)?.value)) redirect("/ops");

  const f = await loadMembershipFunnel(6, new Date());
  const target = KPIS.find((k) => k.id === "members")?.target ?? 250;
  const current = f.members?.active ?? KPIS.find((k) => k.id === "members")?.manualValue ?? 0;

  const bestCase = Math.round(f.queue.length * OPTIMISTIC_CONVERSION);
  const reachable = current + bestCase;
  const shortfall = Math.max(0, target - reachable);

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10">
      <header className="border-b-2 border-green pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Get Lucky Golf Club · Internal
        </p>
        <h1 className="mt-3 font-heading text-4xl leading-none text-green sm:text-5xl">
          Membership funnel
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-charcoal-light">
          From golfers who gave us their details to golfers who joined the club. Consent is a hard
          gate everywhere on this page — a golfer who declined, or who was never asked, is never in
          the queue.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-charcoal-light/70">
          <span>Source: {f.source}</span>
          <span>Members: {f.membersKnown ? "live" : "not connected"}</span>
          <Link href="/ops" className="underline">
            Back to the scorecard
          </Link>
        </div>
      </header>

      {/* --- the funnel ----------------------------------------------------- */}
      <section className="mt-8 rounded-md border border-cream-dark bg-white p-5">
        <h2 className="font-heading text-xl text-green">Where the funnel actually narrows</h2>
        <p className="mb-4 mt-1 max-w-2xl text-xs text-charcoal-light/80">
          It is not reach. It is permission.
        </p>
        <Funnel
          stages={[
            { label: "Lead submissions captured", value: f.leadRows },
            {
              label: "Unique golfers",
              value: f.uniqueGolfers,
              note: "The same golfer often enters more than once.",
            },
            {
              label: "Gave consent to be contacted",
              value: f.consented,
              note: `${f.declined} declined outright · ${f.neverAsked} were never asked, because the forms did not ask until 13 August.`,
            },
            {
              label: "Consented and not already a member",
              value: f.queue.length,
              note: f.membersKnown
                ? `${f.alreadyMembers} of our golfers already belong to the club.`
                : "Members database not connected, so existing members are not subtracted — treat this as a maximum.",
            },
          ]}
        />
      </section>

      {/* --- the arithmetic ------------------------------------------------- */}
      <section className="mt-6 rounded-md border-l-4 border-gold bg-white p-5">
        <h2 className="font-heading text-xl text-green">
          The existing list cannot reach {target}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-charcoal">
          There are <strong>{f.queue.length} golfers</strong> we may lawfully invite. At a generous{" "}
          {Math.round(OPTIMISTIC_CONVERSION * 100)}% conversion — heroic for a cold invite — that is{" "}
          <strong>{bestCase} new members</strong>, taking us from {current} to about {reachable}.
          {shortfall > 0 ? (
            <>
              {" "}
              Against a target of {target} that leaves <strong>{shortfall} short</strong>.
            </>
          ) : (
            <> That clears the target, which is worth sanity-checking before relying on it.</>
          )}
        </p>
        <p className="mt-2 max-w-3xl text-sm text-charcoal-light">
          Worth being blunt about, because it changes what Q4 should spend its time on. Working this
          list is worth doing and will not close the gap. The gap closes on new acquisition with
          consent captured at the point of entry — which is what makes the PGA Show
          (18–21 September, 1,000 leads targeted) the single most important membership event of the
          quarter, not a branding exercise.
        </p>
      </section>

      {/* --- members ------------------------------------------------------- */}
      {f.members && (
        <section className="mt-10">
          <h2 className="font-heading text-xl text-green">The members we have</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Active" value={f.members.active} />
            <Stat label="Cancelled" value={f.members.cancelled} />
            <Stat label="Failed payment" value={f.members.failed} />
            <Stat
              label="Stale"
              value={f.members.stale}
              note="active but no payment in 40 days"
              warn={f.members.stale >= 3}
            />
          </div>
          {f.members.stale >= 3 && (
            <p className="mt-3 rounded-md border border-cream-dark bg-white p-3 text-xs text-charcoal-light">
              <strong className="text-charcoal">{f.members.stale} active members have not paid in
              40 days.</strong>{" "}
              Some of that is the webhook outage that stopped recording payments until 20 August; the
              rest is genuine churn. Worth separating the two before chasing anybody.
            </p>
          )}
        </section>
      )}

      {/* --- the queue ------------------------------------------------------ */}
      <section className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-heading text-xl text-green">
            Invite queue ({f.queue.length})
          </h2>
          {f.queue.length > 0 && (
            <a href="/api/ops/invites" className="text-sm font-semibold text-green underline">
              Download as CSV →
            </a>
          )}
        </div>
        <p className="mb-3 mt-1 max-w-3xl text-sm text-charcoal-light">
          Every golfer here gave explicit consent and is not already a member. The join link is
          personalised to the course they played most, so the invite lands them on their own club&apos;s
          page rather than a generic form. <strong>{f.repeatInQueue}</strong> of them entered more
          than once — start with those.
        </p>
        {f.queueConcentration && f.queueConcentration.topCourseShare >= 40 && (
          <p className="mb-3 rounded-md border border-cream-dark bg-white p-3 text-xs text-charcoal-light">
            <strong className="text-charcoal">
              This queue is narrower than its size suggests.
            </strong>{" "}
            {f.queueConcentration.topCourseShare}% of it played{" "}
            {f.queueConcentration.topCourse}, and {f.queueConcentration.topMonthShare}% were last
            seen in {f.queueConcentration.topMonth}. It is largely one activation&apos;s list rather
            than a broad consented base — which is a reason to invite them soon, while they still
            remember playing, and a reason not to read {f.queue.length} as steady-state demand.
          </p>
        )}
        <div className="overflow-x-auto rounded-md border border-cream-dark bg-white">
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="border-b border-cream-dark text-left text-[11px] uppercase tracking-wider text-charcoal-light/70">
                <th className="px-3 py-2 font-semibold">Golfer</th>
                <th className="px-3 py-2 text-right font-semibold">Entries</th>
                <th className="px-3 py-2 font-semibold">Home course</th>
                <th className="px-3 py-2 font-semibold">Join link</th>
                <th className="px-3 py-2 font-semibold">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {f.queue.slice(0, 60).map((g) => (
                <tr key={g.email} className="border-b border-cream-dark/60 last:border-0">
                  <td className="px-3 py-2">
                    <span className="block text-xs">{g.email}</span>
                    <span className="block text-xs tabular-nums text-charcoal-light/70">{g.mobile}</span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{g.entries}</td>
                  <td className="px-3 py-2">{g.homeCourse || "—"}</td>
                  <td className="px-3 py-2 text-xs">
                    {g.joinUrl ? (
                      <span className="text-charcoal-light">/join/{g.joinUrl.split("/join/")[1]}</span>
                    ) : (
                      <span className="text-charcoal-light/60">no club page</span>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap tabular-nums">{g.lastSeen.slice(0, 10)}</td>
                </tr>
              ))}
              {f.queue.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-charcoal-light/70" colSpan={5}>
                    Nobody in the window consented and is not already a member.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {f.queue.length > 60 && (
          <p className="mt-2 text-xs text-charcoal-light/70">
            Showing the 60 most engaged of {f.queue.length}. The CSV has all of them.
          </p>
        )}
      </section>

      {/* --- why nothing sends itself --------------------------------------- */}
      <section className="mt-10 rounded-md border border-cream-dark bg-white p-5">
        <h2 className="font-heading text-xl text-green">Nothing here sends itself</h2>
        <p className="mt-2 max-w-3xl text-sm text-charcoal">
          This page builds the queue; it does not mail it. Inviting real golfers is an outward-facing
          action against a consent record that is patchy for historical rows, so it stays a decision
          you take rather than something that happens on a cron.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-charcoal-light">
          When you want to run it: download the CSV, send from Resend or the WhatsApp channel with
          the personalised join link, and watch the members tile move. If it converts, wiring it to
          send on a schedule is a small change — but it should earn that on evidence first.
        </p>
      </section>

      <footer className="mt-14 border-t border-cream-dark pt-5 text-xs text-charcoal-light/70">
        <p>
          Consent is read from every submission a golfer ever made: an explicit no always wins, an
          explicit yes beats silence, and silence means never asked. Not indexed, not linked from the
          public site.
        </p>
      </footer>
    </main>
  );
}

function Stat({
  label,
  value,
  note,
  warn,
}: {
  label: string;
  value: number;
  note?: string;
  warn?: boolean;
}) {
  return (
    <article className="rounded-md border border-cream-dark bg-white p-4">
      <h3 className="text-sm font-semibold text-charcoal">{label}</h3>
      <p
        className="mt-2 font-heading text-3xl leading-none tabular-nums"
        style={{ color: warn ? "#a3232a" : "#335231" }}
      >
        {value.toLocaleString("en-ZA")}
      </p>
      {note && <p className="mt-1 text-xs text-charcoal-light/70">{note}</p>}
    </article>
  );
}
