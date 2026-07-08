"use client";

import { useState, useMemo, useEffect } from "react";
import { Users, CalendarRange, HandCoins } from "lucide-react";
import { setTourQuote } from "@/lib/tourQuoteStore";

// Fixed tour-operator offer: R100 entries, R100,000 prize on a defined par-3.
const ENTRY_PRICE = 100;
const PRIZE_LABEL = "R100,000";
const OPERATOR_SHARE = 0.2;

function formatRand(n: number): string {
  return "R" + n.toLocaleString("en-ZA");
}

export default function TourRevenueCalculator() {
  const [entries, setEntries] = useState<number>(60);
  const [tours, setTours] = useState<number>(48);

  const breakdown = useMemo(() => {
    const revenuePerTour = entries * ENTRY_PRICE;
    const operatorSharePerTour = Math.round(revenuePerTour * OPERATOR_SHARE);
    const operatorSharePerYear = operatorSharePerTour * tours;
    return { revenuePerTour, operatorSharePerTour, operatorSharePerYear };
  }, [entries, tours]);

  useEffect(() => {
    setTourQuote({
      entriesPerTour: entries,
      toursPerYear: tours,
      revenuePerTour: breakdown.revenuePerTour,
      operatorSharePerTour: breakdown.operatorSharePerTour,
      operatorSharePerYear: breakdown.operatorSharePerYear,
    });
  }, [entries, tours, breakdown]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-green-dark/10 overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_360px]">
        {/* Left: configurator */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Entries per tour */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gold" />
              <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide">
                1. Entries Sold Per Tour
              </h3>
            </div>
            <p className="text-xs text-charcoal-light/60 mb-4">
              Entries are R100 each for a shot at {PRIZE_LABEL}. Most golfers
              take two or three across a tour — 20 golfers easily means 40–60
              entries.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={10}
                max={300}
                step={5}
                value={entries}
                onChange={(e) => setEntries(Number(e.target.value))}
                className="flex-1 accent-gold"
                aria-label="Entries sold per tour"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={entries}
                  onChange={(e) =>
                    setEntries(Math.max(1, Number(e.target.value) || 0))
                  }
                  className="w-20 text-center rounded-lg border border-green-dark/15 px-3 py-2 font-semibold text-green-dark focus:border-gold focus:outline-none"
                  aria-label="Entries sold per tour (exact)"
                />
                <span className="text-sm text-charcoal-light/70">entries</span>
              </div>
            </div>
            <p className="text-xs text-charcoal-light/60 mt-2">
              R100 per entry × {entries} ={" "}
              <span className="font-semibold text-green-dark">
                {formatRand(breakdown.revenuePerTour)}
              </span>{" "}
              in entry sales per tour
            </p>
          </div>

          {/* Tours per year */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CalendarRange className="w-4 h-4 text-gold" />
              <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide">
                2. Tours Per Year
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={100}
                step={1}
                value={tours}
                onChange={(e) => setTours(Number(e.target.value))}
                className="flex-1 accent-gold"
                aria-label="Tours per year"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={tours}
                  onChange={(e) =>
                    setTours(Math.max(1, Number(e.target.value) || 0))
                  }
                  className="w-20 text-center rounded-lg border border-green-dark/15 px-3 py-2 font-semibold text-green-dark focus:border-gold focus:outline-none"
                  aria-label="Tours per year (exact)"
                />
                <span className="text-sm text-charcoal-light/70">tours</span>
              </div>
            </div>
          </div>

          {/* How the split works */}
          <div className="rounded-2xl bg-cream-dark/30 p-5">
            <div className="flex items-center gap-2 mb-2">
              <HandCoins className="w-4 h-4 text-gold" />
              <h3 className="font-heading text-base text-green-dark uppercase tracking-wide">
                Your 20% Commission
              </h3>
            </div>
            <p className="text-sm text-charcoal-light/80 leading-relaxed">
              You earn{" "}
              <span className="font-semibold text-green-dark">
                20% commission
              </span>{" "}
              on every entry sold. The rest covers the Indwe-underwritten{" "}
              {PRIZE_LABEL} prize — so if someone holes it, the payout is real
              and it never touches your pocket.
            </p>
          </div>
        </div>

        {/* Right: summary */}
        <div className="bg-green-dark text-cream p-6 sm:p-8 lg:p-10 lg:sticky lg:top-24 lg:self-start">
          <p className="text-gold text-[10px] font-semibold uppercase tracking-widest">
            Your New Revenue Line
          </p>
          <p className="font-heading text-3xl sm:text-4xl uppercase tracking-wide mt-1">
            You Earn
          </p>

          <div className="mt-6 bg-gold text-green-dark rounded-xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
              Per Year, Across {tours} {tours === 1 ? "Tour" : "Tours"}
            </p>
            <p className="font-heading text-4xl sm:text-5xl mt-1">
              {formatRand(breakdown.operatorSharePerYear)}
            </p>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between border-b border-cream/10 pb-3">
              <span className="text-cream/70">R100 entry × {entries}</span>
              <span className="font-semibold">
                {formatRand(breakdown.revenuePerTour)} / tour
              </span>
            </div>
            <div className="flex justify-between border-b border-cream/10 pb-3">
              <span className="text-cream/70">Your commission (20%)</span>
              <span className="font-semibold">
                {formatRand(breakdown.operatorSharePerTour)} / tour
              </span>
            </div>
            <div className="flex justify-between border-b border-cream/10 pb-3">
              <span className="text-cream/70">Prize on offer</span>
              <span className="font-semibold">{PRIZE_LABEL}</span>
            </div>
          </div>

          <p className="text-cream/60 text-xs mt-4 leading-relaxed">
            The prize is fully underwritten by{" "}
            <span className="text-gold font-semibold">Indwe Risk Services</span>{" "}
            — zero cost and zero risk to your business. You sell the entries;
            we carry the {PRIZE_LABEL}.
          </p>

          <a
            href="#enquire"
            className="mt-6 block w-full text-center bg-cream hover:bg-white text-green-dark font-bold text-base px-6 py-4 rounded-full transition-all"
          >
            Add It To Your Tours
          </a>
        </div>
      </div>
    </div>
  );
}
