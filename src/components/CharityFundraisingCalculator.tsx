"use client";

import { useState, useMemo, useEffect } from "react";
import { Check, Flag, Users, HeartHandshake } from "lucide-react";
import { setCharityQuote } from "@/lib/charityQuoteStore";

type SwingOption = {
  swing: string;
  entryAmount: number;
  prize: string;
  label: string;
};

// Curated subset of the standard swing tiers (see PRIZE_TIERS in constants.ts).
// Each option sets both the price golfers pay and the prize on offer.
const SWING_OPTIONS: SwingOption[] = [
  { swing: "R50", entryAmount: 50, prize: "R25,000", label: "Bronze Swing" },
  { swing: "R100", entryAmount: 100, prize: "R60,000", label: "Silver Swing" },
  { swing: "R150", entryAmount: 150, prize: "R100,000", label: "Birdie Swing" },
  { swing: "R250", entryAmount: 250, prize: "R200,000", label: "Gold Swing" },
];

const CHARITY_SHARE = 0.5;

// Pinned to comma grouping (R12,000) so the server render and the browser
// agree; "en-ZA" groups with a space in Node and a comma in some browsers,
// which broke hydration.
function formatRand(n: number): string {
  return "R" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// `beneficiary` swaps the wording (and CTA) so the school fundraising page can
// reuse the same calculator and quote store without duplicating the component.
export default function CharityFundraisingCalculator({
  beneficiary = "charity",
}: {
  beneficiary?: "charity" | "school";
}) {
  const [swing, setSwing] = useState<SwingOption>(SWING_OPTIONS[2]);
  const [swings, setSwings] = useState<number>(100);

  const breakdown = useMemo(() => {
    const totalRaised = swings * swing.entryAmount;
    const charityShare = Math.round(totalRaised * CHARITY_SHARE);
    const getLuckyShare = totalRaised - charityShare;
    return { totalRaised, charityShare, getLuckyShare };
  }, [swings, swing]);

  useEffect(() => {
    setCharityQuote({
      swing: swing.swing,
      entryAmount: swing.entryAmount,
      prize: swing.prize,
      swings,
      totalRaised: breakdown.totalRaised,
      charityShare: breakdown.charityShare,
    });
  }, [swing, swings, breakdown]);

  return (
    <div className="card bg-white rounded-3xl overflow-clip card--hover">
      <div className="grid lg:grid-cols-[1fr_360px]">
        {/* Left: configurator */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Swing selector */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flag className="w-4 h-4 text-green" />
              <h3 className="font-heading text-lg text-green uppercase">
                1. Choose Your Swing
              </h3>
            </div>
            <p className="text-xs text-charcoal-light/60 mb-4">
              The swing price sets what golfers pay and the prize on offer at
              your day.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {SWING_OPTIONS.map((opt) => {
                const active = opt.entryAmount === swing.entryAmount;
                return (
                  <button
                    key={opt.entryAmount}
                    type="button"
                    onClick={() => setSwing(opt)}
                    className={`relative text-left rounded-2xl p-4 border-2 transition-all ${
                      active
                        ? "border-green bg-lime/5 shadow-sm"
                        : "border-green-dark/10 hover:border-green-dark/30"
                    }`}
                  >
                    {active && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-lime flex items-center justify-center">
                        <Check className="w-3 h-3 text-green" strokeWidth={3} />
                      </span>
                    )}
                    <p className="eyebrow">
                      {opt.label}
                    </p>
                    <p className="font-heading text-2xl text-green mt-1">
                      {opt.swing}{" "}
                      <span className="text-sm font-sans text-charcoal-light/70">
                        / swing
                      </span>
                    </p>
                    <p className="text-xs text-charcoal-light/70 mt-2">
                      {opt.prize} hole-in-one prize
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Swings sold */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-green" />
              <h3 className="font-heading text-lg text-green uppercase">
                2. Estimated Swings Sold
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={20}
                max={300}
                step={5}
                value={swings}
                onChange={(e) => setSwings(Number(e.target.value))}
                className="flex-1 accent-green"
                aria-label="Estimated swings sold"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={swings}
                  onChange={(e) =>
                    setSwings(Math.max(1, Number(e.target.value) || 0))
                  }
                  className="w-20 text-center rounded-lg border border-green/15 px-3 py-2 font-semibold text-green focus:border-green focus:outline-none"
                  aria-label="Estimated swings sold (exact)"
                />
                <span className="text-sm text-charcoal-light/70">swings</span>
              </div>
            </div>
            <p className="text-xs text-charcoal-light/60 mt-2">
              {formatRand(swing.entryAmount)} per swing × {swings} ={" "}
              <span className="font-semibold text-green">
                {formatRand(breakdown.totalRaised)}
              </span>{" "}
              in swing sales
            </p>
          </div>

          {/* How the split works */}
          <div className="rounded-2xl bg-cream-dark/30 p-5">
            <div className="flex items-center gap-2 mb-2">
              <HeartHandshake className="w-4 h-4 text-green" />
              <h3 className="font-heading text-base text-green uppercase">
                The 50/50 Split
              </h3>
            </div>
            <p className="text-sm text-charcoal-light/80 leading-relaxed">
              You keep <span className="font-semibold text-green">half</span>{" "}
              of every swing sold. The other half covers the full Get Lucky
              activation and the Indwe-underwritten prize — so the day costs your{" "}
              {beneficiary} nothing and carries zero risk.
            </p>
          </div>
        </div>

        {/* Right: summary */}
        <div className="bg-green-dark text-white">
          <div className="p-6 sm:p-8 lg:p-10 lg:sticky lg:top-24">
            <p className="eyebrow eyebrow--dark">
              Your Fundraiser
            </p>
            <p className="font-heading text-3xl sm:text-4xl uppercase mt-1">
              You Raise
            </p>

            <div className="mt-6 bg-lime text-green rounded-xl p-5">
              <p className="eyebrow">
                {beneficiary === "school" ? "For Your School" : "For Your Cause"}
              </p>
              <p className="font-heading text-4xl sm:text-5xl mt-1">
                {formatRand(breakdown.charityShare)}
              </p>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-white/70">
                  {swing.swing} swing × {swings}
                </span>
                <span className="font-semibold">
                  {formatRand(breakdown.totalRaised)}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-white/70">Your share (50%)</span>
                <span className="font-semibold">
                  {formatRand(breakdown.charityShare)}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-white/70">Prize on offer</span>
                <span className="font-semibold">{swing.prize}</span>
              </div>
            </div>

            <p className="text-white/60 text-xs mt-4 leading-relaxed">
              The prize is fully underwritten by{" "}
              <span className="text-lime font-semibold">Indwe Risk Services</span>{" "}
              — zero cost and zero risk to your {beneficiary}. Get Lucky runs the
              whole activation; you keep half of every swing sold.
            </p>

            <a
              href="#enquire"
              className="btn-lime btn-lime--dark mt-6 w-full text-center"
            >
              {beneficiary === "school" ? "Lock In Your School Day" : "Lock In Your Charity Day"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
