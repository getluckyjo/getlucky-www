"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PRIZE_TIERS } from "@/lib/constants";

/** R25,000 → R25K, R1,000,000 → R1M: the short form that fits on a bar. */
function short(amount: number): string {
  return amount >= 1_000_000 ? `R${amount / 1_000_000}M` : `R${amount / 1000}K`;
}

/** Bar heights climb in even steps so every rung is readable, not to scale. */
const BAR_HEIGHT = [28, 40, 52, 66, 82, 100];
const DEFAULT = PRIZE_TIERS.findIndex((t) => t.popular);

/**
 * The stake ladder as a level picker: six rungs, Bronze to Diamond, each a
 * bar that climbs with the prize. Picking one lights it lime and reads back
 * the entry, the prize and what the entry multiplies by. Swings are bought at
 * the tee box (the QR form), so the ladder shows the game rather than sells
 * it. Gold is the one colour that belongs to prizes, and it stays on dark.
 */
export default function PrizeLadder() {
  const [active, setActive] = useState(DEFAULT < 0 ? 3 : DEFAULT);
  const tier = PRIZE_TIERS[active];
  const multiple = Math.round(tier.prizeAmount / tier.entryAmount);

  return (
    <section
      id="prizes"
      className="on-dark relative isolate overflow-hidden bg-night text-white section scroll-mt-20"
    >
      <div aria-hidden className="dot-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute -z-10 left-1/2 top-0 -translate-x-1/2 w-[900px] h-[420px] rounded-full bg-lime/[0.07] blur-[120px]"
      />

      <div className="wrap grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-14 lg:gap-16 items-center">
        {/* Readout */}
        <div className="reveal">
          <span className="kicker kicker--dark">Choose your entry</span>
          <h2 className="display-lg mt-4">Pick your prize</h2>
          <p className="lede lede--dark mt-5 max-w-md">
            One swing. The bigger the entry, the bigger the prize. Scan the QR
            code at the tee box of any Get Lucky partner course to play.
          </p>

          <div
            className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">
                {tier.label}
              </span>
              {tier.popular && <span className="chip-lime">Most popular</span>}
            </div>
            <div className="mt-5 grid sm:grid-cols-[auto_1fr] gap-5 sm:gap-8">
              <div>
                <p className="text-[12px] text-white/50">You swing</p>
                <p className="font-heading text-4xl leading-none mt-2 tabular-nums">
                  {tier.entry}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-white/50">You win</p>
                <p className="prize text-4xl leading-none mt-2 tabular-nums">
                  {tier.prize}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-[13px]">
              <span className="text-white/55">Your entry, multiplied</span>
              <span className="font-semibold text-lime tabular-nums">
                {multiple.toLocaleString("en-US")}×
              </span>
            </div>
          </div>

          <Link href="/#courses" className="link-arrow mt-6">
            Find a course to take this swing <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="mt-6 flex items-start gap-2 text-[13px] text-white/55">
            <ShieldCheck className="w-4 h-4 text-lime shrink-0 mt-px" />
            <span>
              All prizes fully insured by{" "}
              <span className="text-white/85 font-medium">Indwe Risk Services</span> — FSP 3425
            </span>
          </p>
        </div>

        {/* The ladder */}
        <div className="reveal">
          <div
            role="radiogroup"
            aria-label="Entry and prize"
            className="hidden sm:grid grid-cols-6 gap-3 items-end h-[420px]"
          >
            {PRIZE_TIERS.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.entry}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={`${t.label}: swing ${t.entry}, win ${t.prize}`}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group h-full flex flex-col justify-end text-left"
                >
                  <span
                    className={`block text-[11px] font-semibold uppercase tracking-[0.1em] mb-2 transition-colors ${
                      on ? "text-lime" : "text-white/45"
                    }`}
                  >
                    {t.label.replace(" Swing", "")}
                  </span>
                  <span
                    className={`relative w-full rounded-2xl flex flex-col justify-between p-3 transition-all duration-300 ease-out ${
                      on
                        ? "bg-lime text-green-dark shadow-[0_20px_50px_-20px_rgba(214,251,75,0.6)]"
                        : "bg-white/[0.06] text-white group-hover:bg-white/[0.1]"
                    }`}
                    style={{ height: `${BAR_HEIGHT[i]}%` }}
                  >
                    <span
                      className={`font-heading text-[18px] xl:text-[22px] leading-none tabular-nums ${
                        on ? "" : "text-gold"
                      }`}
                    >
                      {short(t.prizeAmount)}
                    </span>
                    <span
                      className={`text-[12px] font-semibold tabular-nums ${
                        on ? "text-green-dark/70" : "text-white/55"
                      }`}
                    >
                      {t.entry}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Phones: the same ladder as rows */}
          <div role="radiogroup" aria-label="Entry and prize" className="sm:hidden space-y-2">
            {PRIZE_TIERS.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.entry}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setActive(i)}
                  className={`w-full rounded-2xl px-4 py-3.5 text-left transition-colors ${
                    on ? "bg-lime text-green-dark" : "bg-white/[0.06] text-white"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex items-baseline gap-3">
                      <span className="font-heading text-xl leading-none tabular-nums">
                        {t.entry}
                      </span>
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${
                          on ? "text-green-dark/60" : "text-white/45"
                        }`}
                      >
                        {t.label.replace(" Swing", "")}
                      </span>
                    </span>
                    <span
                      className={`font-heading text-xl leading-none tabular-nums ${
                        on ? "" : "text-gold"
                      }`}
                    >
                      {t.prize}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`mt-3 block h-1 rounded-full ${on ? "bg-green-dark/20" : "bg-white/10"}`}
                  >
                    <span
                      className={`block h-full rounded-full ${on ? "bg-green-dark" : "bg-white/35"}`}
                      style={{ width: `${BAR_HEIGHT[i]}%` }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
