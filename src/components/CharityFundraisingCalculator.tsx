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

function formatRand(n: number): string {
  return "R" + n.toLocaleString("en-ZA");
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
    <div className="bg-white rounded-3xl shadow-sm border border-green-dark/10 overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_360px]">
        {/* Left: configurator */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Swing selector */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flag className="w-4 h-4 text-gold" />
              <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide">
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
                        ? "border-gold bg-gold/5 shadow-sm"
                        : "border-green-dark/10 hover:border-green-dark/30"
                    }`}
                  >
                    {active && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-dark" strokeWidth={3} />
                      </span>
                    )}
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-green-dark/50">
                      {opt.label}
                    </p>
                    <p className="font-heading text-2xl text-green-dark mt-1">
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
              <Users className="w-4 h-4 text-gold" />
              <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide">
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
                className="flex-1 accent-gold"
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
                  className="w-20 text-center rounded-lg border border-green-dark/15 px-3 py-2 font-semibold text-green-dark focus:border-gold focus:outline-none"
                  aria-label="Estimated swings sold (exact)"
                />
                <span className="text-sm text-charcoal-light/70">swings</span>
              </div>
            </div>
            <p className="text-xs text-charcoal-light/60 mt-2">
              {formatRand(swing.entryAmount)} per swing × {swings} ={" "}
              <span className="font-semibold text-green-dark">
                {formatRand(breakdown.totalRaised)}
              </span>{" "}
              in swing sales
            </p>
          </div>

          {/* How the split works */}
          <div className="rounded-2xl bg-cream-dark/30 p-5">
            <div className="flex items-center gap-2 mb-2">
              <HeartHandshake className="w-4 h-4 text-gold" />
              <h3 className="font-heading text-base text-green-dark uppercase tracking-wide">
                The 50/50 Split
              </h3>
            </div>
            <p className="text-sm text-charcoal-light/80 leading-relaxed">
              You keep <span className="font-semibold text-green-dark">half</span>{" "}
              of every swing sold. The other half covers the full Get Lucky
              activation and the Indwe-underwritten prize — so the day costs your{" "}
              {beneficiary} nothing and carries zero risk.
            </p>
          </div>
        </div>

        {/* Right: summary */}
        <div className="bg-green-dark text-cream p-6 sm:p-8 lg:p-10 lg:sticky lg:top-24 lg:self-start">
          <p className="text-gold text-[10px] font-semibold uppercase tracking-widest">
            Your Fundraiser
          </p>
          <p className="font-heading text-3xl sm:text-4xl uppercase tracking-wide mt-1">
            You Raise
          </p>

          <div className="mt-6 bg-gold text-green-dark rounded-xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
              {beneficiary === "school" ? "For Your School" : "For Your Cause"}
            </p>
            <p className="font-heading text-4xl sm:text-5xl mt-1">
              {formatRand(breakdown.charityShare)}
            </p>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between border-b border-cream/10 pb-3">
              <span className="text-cream/70">
                {swing.swing} swing × {swings}
              </span>
              <span className="font-semibold">
                {formatRand(breakdown.totalRaised)}
              </span>
            </div>
            <div className="flex justify-between border-b border-cream/10 pb-3">
              <span className="text-cream/70">Your share (50%)</span>
              <span className="font-semibold">
                {formatRand(breakdown.charityShare)}
              </span>
            </div>
            <div className="flex justify-between border-b border-cream/10 pb-3">
              <span className="text-cream/70">Prize on offer</span>
              <span className="font-semibold">{swing.prize}</span>
            </div>
          </div>

          <p className="text-cream/60 text-xs mt-4 leading-relaxed">
            The prize is fully underwritten by{" "}
            <span className="text-gold font-semibold">Indwe Risk Services</span>{" "}
            — zero cost and zero risk to your {beneficiary}. Get Lucky runs the
            whole activation; you keep half of every swing sold.
          </p>

          <a
            href="#enquire"
            className="mt-6 block w-full text-center bg-cream hover:bg-white text-green-dark font-bold text-base px-6 py-4 rounded-full transition-all"
          >
            {beneficiary === "school" ? "Lock In Your School Day" : "Lock In Your Charity Day"}
          </a>
        </div>
      </div>
    </div>
  );
}
