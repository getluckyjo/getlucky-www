import Image from "next/image";
import { ArrowRight, ArrowUpRight, Check, Gift } from "lucide-react";
import { MEMBERSHIP } from "@/lib/constants";
import { formatRand } from "@/lib/tiers";
import { INDWE_QUOTE_URL, MEMBERSHIP_JOIN_URL } from "@/lib/solutions";
import SectionHeader from "@/components/ui/SectionHeader";

const MEMBERSHIP_VALUE = MEMBERSHIP.amount * 12; // R149 × 12 = R1,788

const benefits = [
  "Unlimited swings on any Get Lucky challenge hole",
  `Win up to ${MEMBERSHIP.prize} for a hole-in-one`,
  "Exclusive golden bag tag",
  "Professional video of every hole-in-one",
  "No lock-in — cancel anytime",
  "Founding member perks for early joiners",
];

const quoteSteps = [
  "Tap the button and share a few details with Indwe.",
  "An Indwe broker prepares a no-obligation quote on your terms.",
  "Your 12-month Get Lucky Membership is unlocked — no payment required.",
];

const freePerks = [
  "Unlimited swings on every Get Lucky challenge hole",
  `Win up to ${MEMBERSHIP.prize} for a hole-in-one, every round`,
  "Exclusive golden bag tag + founding member perks",
];

/**
 * Two ways into the club, side by side like plans on a pricing page: pay
 * monthly, or get the year free through the headline sponsor's quote. The
 * offer keeps its #quote anchor for links already out in the world.
 */
export default function Membership() {
  return (
    <section id="membership" className="section bg-white scroll-mt-20">
      <div className="wrap">
        <SectionHeader
          kicker="Membership"
          title={
            <>
              Unlimited swings at {MEMBERSHIP.prize}.
              <br className="hidden sm:block" /> One monthly fee.
            </>
          }
          lede={`R${MEMBERSHIP.amount}/month at any Get Lucky partner course. Unlimited attempts on the challenge hole, every round you play.`}
        />

        <div className="mt-14 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-4">
          {/* Paid plan */}
          <div className="reveal on-dark relative overflow-hidden rounded-3xl bg-green-dark text-white p-7 sm:p-10 flex flex-col">
            <div
              aria-hidden
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-lime/10 blur-3xl"
            />
            <div className="relative flex items-center justify-between gap-3">
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
                {MEMBERSHIP.label}
              </span>
              <span className="chip-lime">Monthly</span>
            </div>
            <div className="relative mt-6 flex items-baseline gap-2">
              <span className="font-heading text-6xl sm:text-7xl leading-none">
                R{MEMBERSHIP.amount}
              </span>
              <span className="text-white/60 text-lg">/month</span>
            </div>
            <p className="relative mt-3 text-white/65">
              No lock-in contract. Cancel anytime. Start playing immediately.
            </p>

            <ul className="relative mt-8 space-y-3.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] text-white/80">
                  <Check className="w-4 h-4 text-lime shrink-0 mt-1" strokeWidth={2.5} />
                  {b}
                </li>
              ))}
            </ul>

            <dl className="relative mt-10 lg:mt-auto grid grid-cols-3 border-t border-white/10 pt-6">
              {[
                { v: "∞", l: "Swings a month" },
                { v: "R100K", l: "Per hole-in-one" },
                { v: "0", l: "Lock-in" },
              ].map((s, i) => (
                <div
                  key={s.l}
                  className={`flex flex-col-reverse justify-end ${i > 0 ? "pl-4 border-l border-white/10" : ""}`}
                >
                  <dt className="mt-1.5 text-[12px] text-white/55">{s.l}</dt>
                  <dd className="font-heading text-3xl leading-none text-lime">{s.v}</dd>
                </div>
              ))}
            </dl>

            <a
              href={`${MEMBERSHIP_JOIN_URL}/get-lucky`}
              className="relative btn-lime btn-lime--dark mt-8 self-start"
            >
              Join the club
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Sponsor offer */}
          <div
            id="quote"
            className="reveal relative rounded-3xl border border-line bg-paper p-7 sm:p-10 flex flex-col scroll-mt-24"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="chip-lime chip-lime--flag">
                <Gift className="w-3.5 h-3.5" />
                Exclusive sponsor offer
              </span>
              <Image
                src="/logos/brands/indwe.svg"
                alt="Indwe Risk Services"
                width={140}
                height={40}
                className="h-7 w-auto"
              />
            </div>

            <h3 className="mt-6 display-md text-ink">
              Get a free 12-month hole-in-one membership
            </h3>
            <p className="mt-3 text-muted">
              Request a no-obligation insurance quote from our headline
              sponsor, Indwe Risk Services, and qualify for a full year of Get
              Lucky Club membership — on us. That&apos;s{" "}
              <strong className="text-ink font-semibold">
                {formatRand(MEMBERSHIP_VALUE)} of membership, yours free
              </strong>{" "}
              (R{MEMBERSHIP.amount}/month × 12 months of unlimited swings at
              every Get Lucky partner course nationwide).
            </p>

            <ol className="mt-7 space-y-3">
              {quoteSteps.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-white border border-line text-green text-[12px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-[15px] text-ink/85 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-7 pt-6 border-t border-line">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                Your free membership includes
              </p>
              <ul className="mt-3 space-y-2">
                {freePerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-[14px] text-ink/80">
                    <Check className="w-4 h-4 text-green shrink-0 mt-0.5" strokeWidth={2.5} />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={INDWE_QUOTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ink"
              >
                Get my no-obligation quote
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <span className="text-[13px] text-muted">Takes 60 seconds</span>
            </div>

            <p className="mt-6 text-[12px] text-muted/80 leading-relaxed">
              Membership provided by Get Lucky Golf Club. Quote provided by
              Indwe Risk Services (FSP). Offer subject to standard terms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
