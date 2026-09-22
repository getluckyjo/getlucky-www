"use client";

import { useState, useMemo, useEffect } from "react";
import { Flag, Users, TrendingUp } from "lucide-react";
import {
  setSimulatorQuote,
  SIMULATOR_ENTRY,
  SIMULATOR_PRIZE,
  VENUE_SHARE,
} from "@/lib/simulatorQuoteStore";

function formatRand(n: number): string {
  return "R" + n.toLocaleString("en-ZA");
}

export default function SimulatorRevenueCalculator() {
  const [swings, setSwings] = useState<number>(100);

  const breakdown = useMemo(() => {
    const totalRevenue = swings * SIMULATOR_ENTRY;
    const venueShare = Math.round(totalRevenue * VENUE_SHARE);
    return { totalRevenue, venueShare };
  }, [swings]);

  useEffect(() => {
    setSimulatorQuote({
      swings,
      totalRevenue: breakdown.totalRevenue,
      venueShare: breakdown.venueShare,
    });
  }, [swings, breakdown]);

  return (
    <div className="card bg-white rounded-3xl overflow-hidden card--hover">
      <div className="grid lg:grid-cols-[1fr_360px]">
        {/* Left: configurator */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* The fixed offer */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Flag className="w-4 h-4 text-green" />
              <h3 className="font-heading text-lg text-green uppercase">
                1. The Offer
              </h3>
            </div>
            <div className="rounded-2xl border-2 border-green bg-green/5 p-5">
              <p className="font-heading text-2xl text-green">
                R{SIMULATOR_ENTRY}{" "}
                <span className="text-sm font-sans text-charcoal-light/70">
                  for 3 shots
                </span>
              </p>
              <p className="text-sm text-charcoal-light/70 mt-1">
                Players pay R{SIMULATOR_ENTRY} for 3 attempts at a{" "}
                {SIMULATOR_PRIZE} hole-in-one — and you keep 10% of every swing.
              </p>
            </div>
          </div>

          {/* Swings sold */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-green" />
              <h3 className="font-heading text-lg text-green uppercase">
                2. Estimated Swings Per Month
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={20}
                max={500}
                step={5}
                value={swings}
                onChange={(e) => setSwings(Number(e.target.value))}
                className="flex-1 accent-green"
                aria-label="Estimated swings per month"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={5000}
                  value={swings}
                  onChange={(e) =>
                    setSwings(Math.max(1, Number(e.target.value) || 0))
                  }
                  className="w-20 text-center rounded-lg border border-green/15 px-3 py-2 font-semibold text-green focus:border-green focus:outline-none"
                  aria-label="Estimated swings per month (exact)"
                />
                <span className="text-sm text-charcoal-light/70">/ month</span>
              </div>
            </div>
            <p className="text-xs text-charcoal-light/60 mt-2">
              {formatRand(SIMULATOR_ENTRY)} per swing × {swings} ={" "}
              <span className="font-semibold text-green">
                {formatRand(breakdown.totalRevenue)}
              </span>{" "}
              in monthly swing sales
            </p>
          </div>

          {/* How the share works */}
          <div className="rounded-2xl bg-cream-dark/30 p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green" />
              <h3 className="font-heading text-base text-green uppercase">
                Your 10% Revenue Share
              </h3>
            </div>
            <p className="text-sm text-charcoal-light/80 leading-relaxed">
              You keep{" "}
              <span className="font-semibold text-green">10%</span> of every
              swing sold — passive revenue on the simulator you already own. Get
              Lucky covers the full activation and the Indwe-underwritten prize, so
              it costs your venue nothing and carries zero risk.
            </p>
          </div>
        </div>

        {/* Right: summary */}
        <div className="bg-green-dark text-white p-6 sm:p-8 lg:p-10 lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow eyebrow--dark">
            Your Revenue
          </p>
          <p className="font-heading text-3xl sm:text-4xl uppercase mt-1">
            You Earn
          </p>

          <div className="mt-6 bg-lime text-green rounded-xl p-5">
            <p className="eyebrow">
              Per Month
            </p>
            <p className="font-heading text-4xl sm:text-5xl mt-1">
              {formatRand(breakdown.venueShare)}
            </p>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-white/70">
                R{SIMULATOR_ENTRY} swing × {swings}
              </span>
              <span className="font-semibold">
                {formatRand(breakdown.totalRevenue)}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-white/70">Your share (10%)</span>
              <span className="font-semibold">
                {formatRand(breakdown.venueShare)}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-3">
              <span className="text-white/70">Prize on offer</span>
              <span className="font-semibold">{SIMULATOR_PRIZE}</span>
            </div>
          </div>

          <p className="text-white/60 text-xs mt-4 leading-relaxed">
            The prize is fully underwritten by{" "}
            <span className="text-lime font-semibold">Indwe Risk Services</span> —
            zero cost and zero risk to your venue. Get Lucky runs the whole
            activation; you keep 10% of every swing sold.
          </p>

          <a
            href="#enquire"
            className="btn-lime mt-6 w-full text-center"
          >
            Add It To Your Sim
          </a>
        </div>
      </div>
    </div>
  );
}
