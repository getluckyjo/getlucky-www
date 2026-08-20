/**
 * /ops — the founders' scorecard.
 *
 * One page, read in thirty minutes on a Monday. Live numbers where a source
 * exists, honestly-labelled manual numbers where one does not, and a standing
 * revenue alarm at the top that fires when entries stop converting to paid.
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { KPIS, SCORECARD_SET_ON, type KpiDef } from "@/lib/ops/targets";
import { loadEntryMetrics, loadLeadMetrics, type EntryMetrics } from "@/lib/ops/metrics";
import { isOpsSessionValid, OPS_COOKIE } from "@/lib/ops/auth";
import {
  Bars,
  Meter,
  StatusChip,
  fmtValue,
  fmtZAR,
  progress,
  statusOf,
  type StatusKey,
} from "./parts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Ops scorecard",
  robots: { index: false, follow: false, nocache: true },
};

const SAST = "Africa/Johannesburg";

const stamp = (d: Date) =>
  d.toLocaleString("en-ZA", {
    timeZone: SAST,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const dayStamp = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZA", { timeZone: SAST, day: "numeric", month: "short" });

const daysSince = (iso: string, now: Date) =>
  Math.floor((now.getTime() - new Date(iso).getTime()) / 864e5);

export default async function OpsPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const jar = await cookies();
  if (!isOpsSessionValid(jar.get(OPS_COOKIE)?.value)) {
    const { e } = await searchParams;
    return <SignIn error={e} />;
  }

  const now = new Date();
  const [entries, leads] = await Promise.all([loadEntryMetrics(6, now), loadLeadMetrics(6, now)]);

  // Live values for the auto-sourced KPIs. Everything else comes from targets.ts.
  const live: Partial<Record<KpiDef["id"], number | null>> = {
    paymentCompletion: entries.completion30d,
    entryRevenue: entries.currentMonthRevenue,
    indweLeads: leads.currentMonth,
  };

  const rows = KPIS.map((k) => {
    const value = k.source === "auto" ? (live[k.id] ?? null) : (k.manualValue ?? null);
    const p = progress(value, k.target, k.direction);
    return { k, value, p, s: statusOf(p) as StatusKey };
  });

  const attention = rows.filter((r) => r.s === "off" || r.s === "risk").length;

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10">
      <header className="border-b-2 border-green pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Get Lucky Golf Club · Internal
        </p>
        <h1 className="mt-3 font-heading text-4xl leading-none text-green sm:text-5xl">
          Ops scorecard
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-charcoal-light">
          Q4 2026 targets, set {dayStamp(SCORECARD_SET_ON)}. {attention === 0
            ? "Everything is on track."
            : `${attention} of ${rows.length} need attention.`}{" "}
          Live figures refresh on every load.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-charcoal-light/70">
          <span>As at {stamp(now)} SAST</span>
          <span>Entries: {entries.source}</span>
          <span>Leads: {leads.source}</span>
        </div>
      </header>

      <RevenueAlarm entries={entries} now={now} />

      {/* --- scorecard ------------------------------------------------------ */}
      <section className="mt-10">
        <h2 className="font-heading text-xl text-green">The ten</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ k, value, p, s }) => (
            <article
              key={k.id}
              className="flex flex-col gap-3 rounded-md border border-cream-dark bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold leading-snug text-charcoal">{k.label}</h3>
                <StatusChip s={s} />
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-heading text-3xl leading-none text-green tabular-nums">
                  {fmtValue(value, k.kind)}
                </span>
                <span className="text-xs text-charcoal-light/70 tabular-nums">
                  / {fmtValue(k.target, k.kind)}
                </span>
              </div>

              <Meter p={p} s={s} />

              <p className="text-xs leading-relaxed text-charcoal-light/80">{k.note}</p>

              <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-cream-dark pt-2 text-[11px] text-charcoal-light/70">
                <span className="font-semibold text-charcoal-light">{k.owner}</span>
                <span>by {dayStamp(k.due)}</span>
                <span className="ml-auto uppercase tracking-wider">
                  {k.source === "auto" ? "live" : "manual"}
                </span>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-3 text-xs text-charcoal-light/70">
          &ldquo;Manual&rdquo; tiles are updated in{" "}
          <code className="rounded bg-cream-dark px-1">src/lib/ops/targets.ts</code> and deployed, so
          every change is in git with an author and a date.
        </p>
      </section>

      {/* --- trends --------------------------------------------------------- */}
      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-md border border-cream-dark bg-white p-5">
          <h2 className="font-heading text-xl text-green">Digital entry revenue</h2>
          <p className="mb-3 mt-1 text-xs text-charcoal-light/80">
            Paid website entries only. Excludes on-course Zapper and sponsorship.
          </p>
          <Bars
            data={entries.revenueByMonth}
            format={fmtZAR}
            caption="Paid website entry revenue by month"
          />
        </div>
        <div className="rounded-md border border-cream-dark bg-white p-5">
          <h2 className="font-heading text-xl text-green">Leads delivered to Indwe</h2>
          <p className="mb-3 mt-1 text-xs text-charcoal-light/80">
            Every lead type on the sponsor feed, plus membership leads. Agency excluded.
          </p>
          <Bars
            data={leads.byMonth}
            format={(n) => String(n)}
            caption="Leads on the Indwe feed by month"
          />
          <Link
            href="/ops/indwe"
            className="mt-3 inline-block text-sm font-semibold text-green underline"
          >
            Lead quality and the 2027 renewal →
          </Link>
          <Link
            href="/ops/membership"
            className="mt-1 block text-sm font-semibold text-green underline"
          >
            Membership funnel →
          </Link>
        </div>
      </section>

      {/* --- conversion ----------------------------------------------------- */}
      <section className="mt-8 rounded-md border border-cream-dark bg-white p-5">
        <h2 className="font-heading text-xl text-green">Entry payment completion</h2>
        <p className="mb-3 mt-1 text-xs text-charcoal-light/80">
          Share of entry attempts that reached paid, by month. Anything under 90% is money left at
          the checkout.
        </p>
        <Bars
          data={entries.completionByMonth}
          format={(n) => `${n}%`}
          caption="Percentage of entry attempts that reached paid, by month"
        />
      </section>

      {/* --- the actionable list -------------------------------------------- */}
      {entries.stuckPending.length > 0 && (
        <section className="mt-8">
          <h2 className="font-heading text-xl text-green">
            Unpaid entry attempts ({entries.stuckPending.length})
          </h2>
          <p className="mb-3 mt-1 text-sm text-charcoal-light">
            Golfers who started an entry and never reached paid. Each one is a real person who tried
            to give us money.
          </p>
          <div className="overflow-x-auto rounded-md border border-cream-dark bg-white">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="border-b border-cream-dark text-left text-[11px] uppercase tracking-wider text-charcoal-light/70">
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Name</th>
                  <th className="px-3 py-2 font-semibold">Contact</th>
                  <th className="px-3 py-2 font-semibold">Course</th>
                  <th className="px-3 py-2 font-semibold">Tier</th>
                  <th className="px-3 py-2 text-right font-semibold">Amount</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {entries.stuckPending.slice(0, 60).map((r) => (
                  <tr key={r.reference || r.ts} className="border-b border-cream-dark/60 last:border-0">
                    <td className="whitespace-nowrap px-3 py-2 tabular-nums">{dayStamp(r.ts)}</td>
                    <td className="px-3 py-2">{r.name || "—"}</td>
                    <td className="px-3 py-2">
                      <span className="block text-xs">{r.email || "—"}</span>
                      <span className="block text-xs text-charcoal-light/70 tabular-nums">
                        {r.mobile}
                      </span>
                    </td>
                    <td className="px-3 py-2">{r.course || "—"}</td>
                    <td className="px-3 py-2">{r.tier || "—"}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtZAR(r.amount)}</td>
                    <td className="px-3 py-2 text-xs uppercase tracking-wide">{r.status || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {entries.stuckPending.length > 60 && (
            <p className="mt-2 text-xs text-charcoal-light/70">
              Showing the 60 most recent of {entries.stuckPending.length}.
            </p>
          )}
        </section>
      )}

      {entries.error && (
        <p className="mt-8 rounded-md border border-cream-dark bg-white p-4 text-sm text-charcoal-light">
          Entry data could not be loaded: {entries.error}
        </p>
      )}

      <footer className="mt-14 border-t border-cream-dark pt-5 text-xs text-charcoal-light/70">
        <p>
          Targets from FOUNDERS-RESET-Q4-2026.md. Not indexed, not linked from the public site.{" "}
          <Link href="/" className="underline">
            Back to getluckygolf.co.za
          </Link>
        </p>
      </footer>
    </main>
  );
}

/**
 * The alarm that should have gone off on 2 August. Entries stopped reaching
 * paid on 31 July and nobody found out for nineteen days.
 */
function RevenueAlarm({ entries, now }: { entries: EntryMetrics; now: Date }) {
  if (entries.source === "unavailable") return null;

  const gap = entries.lastPaidAt ? daysSince(entries.lastPaidAt, now) : null;
  const unpaidSinceLastPaid = entries.lastPaidAt
    ? entries.stuckPending.filter((r) => r.ts > entries.lastPaidAt!).length
    : entries.stuckPending.length;

  const broken = unpaidSinceLastPaid >= 3 && (gap === null || gap >= 5);
  if (!broken) return null;

  const value = entries.stuckPending
    .filter((r) => !entries.lastPaidAt || r.ts > entries.lastPaidAt)
    .reduce((s, r) => s + r.amount, 0);

  return (
    <section
      role="alert"
      className="mt-6 rounded-md border-l-4 bg-white p-5"
      style={{ borderLeftColor: "#a3232a", boxShadow: "0 1px 0 #e8e0cc" }}
    >
      <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#a3232a" }}>
        Entry payments are not completing
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-charcoal">
        {gap === null
          ? "No entry has ever been recorded as paid."
          : `The last entry to reach paid was ${dayStamp(entries.lastPaidAt!)} — ${gap} days ago.`}{" "}
        Since then <strong>{unpaidSinceLastPaid} attempts</strong> worth{" "}
        <strong>{fmtZAR(value)}</strong> have stalled. Either golfers are being charged and we are
        not recording it, or the checkout is broken. Both need answering today.
      </p>
      <p className="mt-2 text-xs text-charcoal-light">
        Check the PayFast dashboard for successful payments against these references, then the ITN
        handler logs at <code className="rounded bg-cream-dark px-1">/api/payfast/notify</code>.
      </p>
    </section>
  );
}

function SignIn({ error }: { error?: string }) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-5 py-16">
      <h1 className="font-heading text-3xl text-green">Ops scorecard</h1>
      <p className="mt-2 text-sm text-charcoal-light">Internal. Founders only.</p>
      <form action="/api/ops/auth" method="post" className="mt-6 flex flex-col gap-3">
        <label htmlFor="key" className="text-sm font-medium text-charcoal">
          Passphrase
        </label>
        <input
          id="key"
          name="key"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-md border border-cream-dark bg-white px-3 py-2 text-base"
        />
        <button
          type="submit"
          className="rounded-md bg-green px-4 py-2 font-semibold text-cream hover:bg-green-dark"
        >
          Open
        </button>
      </form>
      {error === "denied" && (
        <p className="mt-3 text-sm" style={{ color: "#a3232a" }}>
          That passphrase is not right.
        </p>
      )}
      {error === "unconfigured" && (
        <p className="mt-3 text-sm" style={{ color: "#a3232a" }}>
          OPS_DASHBOARD_KEY is not set in the environment, so the dashboard cannot be opened.
        </p>
      )}
    </main>
  );
}
