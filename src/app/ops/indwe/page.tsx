/**
 * /ops/indwe — the lead-quality report for the Santam / Indwe renewal.
 *
 * The sponsorship is ~93% of revenue. What Indwe buys is golfers converted into
 * advisory leads, so the renewal argument is a lead-quality argument. This page
 * is that argument, built from the same feed Indwe actually receives.
 *
 * It reports what we can prove and asks for what we cannot. Conversion lives
 * with Indwe; inventing a proxy for it would be the fastest way to lose an
 * argument we should win.
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isOpsSessionValid, OPS_COOKIE } from "@/lib/ops/auth";
import { loadIndweReport } from "@/lib/ops/indwe";
import { TIERS_ASCENDING } from "@/lib/indwe-tiers";
import { StackedBars, TIER_RAMP, monthLabel } from "../parts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Indwe lead quality",
  robots: { index: false, follow: false, nocache: true },
};

const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

export default async function IndwePage() {
  const jar = await cookies();
  if (!isOpsSessionValid(jar.get(OPS_COOKIE)?.value)) redirect("/ops");

  const now = new Date();
  const r = await loadIndweReport(6, now);
  const q = r.quality;
  const thisMonth = now.toISOString().slice(0, 7);
  // Average only over complete months from the first month that carried any
  // lead. The window is six months but the feed only starts when the forms went
  // live, and averaging in the structurally-empty months ahead of that
  // understates delivery — not a number to get wrong in front of a sponsor.
  const firstWithData = r.byMonth.findIndex((m) => m.value > 0);
  const complete =
    firstWithData === -1 ? [] : r.byMonth.slice(firstWithData).filter((m) => m.month !== thisMonth);
  const avgComplete = complete.length
    ? Math.round(complete.reduce((s, m) => s + m.value, 0) / complete.length)
    : 0;

  const quoteReadyFallen =
    r.quoteReadyPeak && r.quoteReadyLatest && r.quoteReadyPeak.count >= 10 && r.quoteReadyLatest.count < r.quoteReadyPeak.count / 4;

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10">
      <header className="border-b-2 border-green pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Get Lucky Golf Club · Internal
        </p>
        <h1 className="mt-3 font-heading text-4xl leading-none text-green sm:text-5xl">
          Indwe lead quality
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-charcoal-light">
          What we delivered to the headline sponsor, and how good it was. Built from the same feed
          Indwe reads at <code className="rounded bg-cream-dark px-1">/api/indwe/leads</code>, tiered
          by the same map. Evidence for the 2027 renewal.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-charcoal-light/70">
          <span>Source: {r.source}</span>
          <span>
            {r.months[0]} to {r.months[r.months.length - 1]}
          </span>
          <Link href="/ops" className="underline">
            Back to the scorecard
          </Link>
        </div>
      </header>

      {r.source === "unavailable" && (
        <p className="mt-6 rounded-md border border-cream-dark bg-white p-4 text-sm">
          Lead data could not be loaded{r.error ? `: ${r.error}` : "."}
        </p>
      )}

      {/* --- headline ------------------------------------------------------- */}
      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Leads delivered" value={r.total.toLocaleString("en-ZA")} note={`across ${r.months.length} months`} />
        <Stat
          label="Average per complete month"
          value={avgComplete.toLocaleString("en-ZA")}
          note={
            complete.length
              ? `${complete.length} complete month${complete.length === 1 ? "" : "s"} · ${thisMonth} still in progress`
              : "no complete month yet"
          }
        />
        <Stat
          label="Reachable"
          value={`${pct(q.withEither, r.total)}%`}
          note={`${q.withEither.toLocaleString("en-ZA")} with a phone number or email`}
        />
      </section>

      {/* --- the quality mix ------------------------------------------------ */}
      <section className="mt-10 rounded-md border border-cream-dark bg-white p-5">
        <h2 className="font-heading text-xl text-green">Volume and quality by month</h2>
        <p className="mb-4 mt-1 max-w-2xl text-xs text-charcoal-light/80">
          Tier tracks insurance intent, not payment. Quote-Ready sits on the baseline because it is
          the tier the renewal turns on.
        </p>
        <StackedBars
          data={r.byMonthTier}
          order={[...TIERS_ASCENDING].reverse()}
          caption="Leads delivered to Indwe each month, split by qualification tier"
        />
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {r.byTier.map((t) => (
          <article key={t.tier} className="rounded-md border border-cream-dark bg-white p-4">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-[2px]"
                style={{ background: TIER_RAMP[t.tier] }}
                aria-hidden="true"
              />
              <h3 className="text-sm font-semibold text-charcoal">{t.tier}</h3>
            </div>
            <p className="mt-2 font-heading text-3xl leading-none text-green tabular-nums">
              {t.count.toLocaleString("en-ZA")}
            </p>
            <p className="mt-1 text-xs text-charcoal-light/70">{t.pct}% of everything delivered</p>
          </article>
        ))}
      </section>

      {quoteReadyFallen && r.quoteReadyPeak && r.quoteReadyLatest && (
        <section
          role="alert"
          className="mt-6 rounded-md border-l-4 bg-white p-5"
          style={{ borderLeftColor: "#a3232a" }}
        >
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#a3232a" }}>
            Quote-Ready leads have collapsed
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-charcoal">
            {monthLabel(r.quoteReadyPeak.month)} delivered{" "}
            <strong>{r.quoteReadyPeak.count} Quote-Ready leads</strong>; {monthLabel(r.quoteReadyLatest.month)}{" "}
            delivered <strong>{r.quoteReadyLatest.count}</strong>. That tier is explicit insurance
            intent — a risk review or a broker switch — and it is the one Indwe can actually convert.
            It is event-driven, and the events stopped.
          </p>
          <p className="mt-2 text-xs text-charcoal-light">
            Worth raising before Indwe raises it. Total volume holding up while Quote-Ready goes to
            zero is a worse renewal story than lower volume with intent intact.
          </p>
        </section>
      )}

      {/* --- data quality --------------------------------------------------- */}
      <section className="mt-10">
        <h2 className="font-heading text-xl text-green">Data quality</h2>
        <p className="mb-4 mt-1 max-w-2xl text-sm text-charcoal-light">
          The things a sponsor&apos;s call centre notices first.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat small label="Mobile number" value={`${pct(q.withMobile, r.total)}%`} note={`${q.withMobile} of ${r.total}`} />
          <Stat small label="Email address" value={`${pct(q.withEmail, r.total)}%`} note={`${q.withEmail} of ${r.total}`} />
          <Stat
            small
            label="Unique people"
            value={q.uniquePeople.toLocaleString("en-ZA")}
            note={`${q.duplicateRows} repeat submissions`}
          />
          <Stat
            small
            label="Consent recorded"
            value={`${pct(q.consentYes, r.total)}%`}
            note={`${q.consentYes} yes · ${q.consentNo} no · ${q.consentBlank} not asked`}
          />
        </div>
        {q.duplicateRows > r.total * 0.2 && (
          <p className="mt-3 rounded-md border border-cream-dark bg-white p-3 text-xs text-charcoal-light">
            <strong className="text-charcoal">{pct(q.duplicateRows, q.withEmail)}% of rows repeat an email
            already in the feed.</strong>{" "}
            Mostly the same golfer entering more than once, which is good for us and noise for
            Indwe&apos;s dialler. Worth agreeing whether they want the feed de-duplicated before it
            becomes their complaint.
          </p>
        )}
        {q.consentBlank > r.total * 0.5 && (
          <p className="mt-2 rounded-md border border-cream-dark bg-white p-3 text-xs text-charcoal-light">
            <strong className="text-charcoal">{q.consentBlank} rows carry no consent value.</strong>{" "}
            Most forms never asked, so this is a gap in what we capture rather than a POPIA breach —
            but it is the kind of thing worth closing before a sponsor&apos;s compliance team asks.
          </p>
        )}
      </section>

      {/* --- where they come from ------------------------------------------- */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-xl text-green">By form</h2>
          <div className="mt-3 overflow-x-auto rounded-md border border-cream-dark bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-dark text-left text-[11px] uppercase tracking-wider text-charcoal-light/70">
                  <th className="px-3 py-2 font-semibold">Form</th>
                  <th className="px-3 py-2 text-right font-semibold">Leads</th>
                  <th className="px-3 py-2 text-right font-semibold">Share</th>
                </tr>
              </thead>
              <tbody>
                {r.byType.map((t) => (
                  <tr key={t.type} className="border-b border-cream-dark/60 last:border-0">
                    <td className="px-3 py-2">{t.type}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{t.count}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-charcoal-light/70">
                      {pct(t.count, r.total)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="font-heading text-xl text-green">By course</h2>
          <div className="mt-3 overflow-x-auto rounded-md border border-cream-dark bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-dark text-left text-[11px] uppercase tracking-wider text-charcoal-light/70">
                  <th className="px-3 py-2 font-semibold">Where</th>
                  <th className="px-3 py-2 text-right font-semibold">Leads</th>
                </tr>
              </thead>
              <tbody>
                {r.topWhere.map((w) => (
                  <tr key={w.where} className="border-b border-cream-dark/60 last:border-0">
                    <td className="px-3 py-2">{w.where}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{w.count}</td>
                  </tr>
                ))}
                {r.topWhere.length === 0 && (
                  <tr>
                    <td className="px-3 py-3 text-charcoal-light/70" colSpan={2}>
                      No course recorded on these rows.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- the ask -------------------------------------------------------- */}
      <section className="mt-10 rounded-md border-l-4 border-gold bg-white p-5">
        <h2 className="font-heading text-xl text-green">What we need from Indwe</h2>
        <p className="mt-2 max-w-3xl text-sm text-charcoal">
          Everything above is our side of the ledger. The half that decides the renewal is theirs,
          and we have never asked for it. Four numbers, for the same period:
        </p>
        <ol className="mt-3 max-w-3xl list-decimal space-y-1 pl-5 text-sm text-charcoal">
          <li>How many of these leads were contacted?</li>
          <li>How many reached a quote?</li>
          <li>How many bound a policy?</li>
          <li>What premium did those policies write?</li>
        </ol>
        <p className="mt-3 max-w-3xl text-sm text-charcoal-light">
          Split by tier, so we can prove which of our channels is worth paying for. If a
          Quote-Ready lead converts at a materially better rate than a General one — and it should —
          then the renewal conversation stops being about how many golfers we reach and starts being
          about how many policies we originate. That is a far better argument, and it is also the
          argument that tells us what to build next.
        </p>
        <p className="mt-3 text-xs text-charcoal-light/70">
          Ask on the weekly GLG · Indwe · Stratitude call, and put it in writing after.
        </p>
      </section>

      <footer className="mt-14 border-t border-cream-dark pt-5 text-xs text-charcoal-light/70">
        <p>
          Conversion figures are not shown because we do not hold them. Every other number here is
          computed from the live feed at read time. Not indexed, not linked from the public site.
        </p>
      </footer>
    </main>
  );
}

function Stat({
  label,
  value,
  note,
  small,
}: {
  label: string;
  value: string;
  note?: string;
  small?: boolean;
}) {
  return (
    <article className="rounded-md border border-cream-dark bg-white p-4">
      <h3 className="text-sm font-semibold text-charcoal">{label}</h3>
      <p
        className={`mt-2 font-heading leading-none text-green tabular-nums ${small ? "text-2xl" : "text-4xl"}`}
      >
        {value}
      </p>
      {note && <p className="mt-1 text-xs text-charcoal-light/70">{note}</p>}
    </article>
  );
}
