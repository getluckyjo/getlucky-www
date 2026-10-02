"use client";

import { useState, useMemo, useEffect } from "react";
import { Users, CalendarRange, HandCoins } from "lucide-react";
import { setTourQuote } from "@/lib/tourQuoteStore";
import ExactNumberInput from "@/components/ui/ExactNumberInput";

// Fixed tour-operator offer: R100 entries, R100,000 prize on a defined par-3.
const ENTRY_PRICE = 100;
const PRIZE_LABEL = "R100,000";
const OPERATOR_SHARE = 0.2;

// Pinned to comma grouping (R12,000) so the server render and the browser
// agree; "en-ZA" groups with a space in Node and a comma in some browsers,
// which broke hydration.
function formatRand(n: number): string {
  return "R" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
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
    <div className="card bg-white rounded-3xl overflow-clip card--hover">
      <div className="grid lg:grid-cols-[1fr_360px]">
        {/* Left: configurator */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Entries per tour */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-green" />
              <h3 className="font-heading text-lg text-green uppercase">
                1. Entries Sold Per Tour
              </h3>
            </div>
            <p className="text-xs text-muted mb-4">
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
                className="flex-1 accent-green"
                aria-label="Entries sold per tour"
              />
              <div className="flex items-center gap-2">
                <ExactNumberInput
                  value={entries}
                  min={1}
                  max={1000}
                  onChange={setEntries}
                  label="Entries sold per tour (exact)"
                />
                <span className="text-sm text-muted">entries</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-2">
              R100 per entry × {entries} ={" "}
              <span className="font-semibold text-green">
                {formatRand(breakdown.revenuePerTour)}
              </span>{" "}
              in entry sales per tour
            </p>
          </div>

          {/* Tours per year */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CalendarRange className="w-4 h-4 text-green" />
              <h3 className="font-heading text-lg text-green uppercase">
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
                className="flex-1 accent-green"
                aria-label="Tours per year"
              />
              <div className="flex items-center gap-2">
                <ExactNumberInput
                  value={tours}
                  min={1}
                  max={200}
                  onChange={setTours}
                  label="Tours per year (exact)"
                />
                <span className="text-sm text-muted">tours</span>
              </div>
            </div>
          </div>

          {/* How the split works */}
          <div className="rounded-2xl bg-cream-dark/30 p-5">
            <div className="flex items-center gap-2 mb-2">
              <HandCoins className="w-4 h-4 text-green" />
              <h3 className="font-heading text-base text-green uppercase">
                Your 20% Commission
              </h3>
            </div>
            <p className="text-sm text-charcoal-light/80 leading-relaxed">
              You earn{" "}
              <span className="font-semibold text-green">
                20% commission
              </span>{" "}
              on every entry sold. The rest covers the insured{" "}
              {PRIZE_LABEL} prize — so if someone holes it, the payout is real
              and it never touches your pocket.
            </p>
          </div>
        </div>

        {/* Right: summary */}
        <div className="bg-green-dark text-white">
          <div className="p-6 sm:p-8 lg:p-10 lg:sticky lg:top-24">
            <p className="eyebrow eyebrow--dark">
              Your New Revenue Line
            </p>
            <p className="font-heading text-3xl sm:text-4xl uppercase mt-1">
              You Earn
            </p>

            <div className="mt-6 bg-lime text-green rounded-xl p-5">
              <p className="eyebrow">
                Per Year, Across {tours} {tours === 1 ? "Tour" : "Tours"}
              </p>
              <p className="font-heading text-4xl sm:text-5xl mt-1">
                {formatRand(breakdown.operatorSharePerYear)}
              </p>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-white/70">R100 entry × {entries}</span>
                <span className="font-semibold">
                  {formatRand(breakdown.revenuePerTour)} / tour
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-white/70">Your commission (20%)</span>
                <span className="font-semibold">
                  {formatRand(breakdown.operatorSharePerTour)} / tour
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-white/70">Prize on offer</span>
                <span className="font-semibold">{PRIZE_LABEL}</span>
              </div>
            </div>

            <p className="text-white/60 text-xs mt-4 leading-relaxed">
              The prize is fully underwritten by{" "}
              <span className="text-lime font-semibold">Santam &amp; Indwe Risk Services</span>{" "}
              — zero cost and zero risk to your business. You sell the entries;
              the {PRIZE_LABEL} is insured.
            </p>

            <a
              href="#enquire"
              className="btn-lime mt-6 w-full text-center"
            >
              Add it to your tours
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
