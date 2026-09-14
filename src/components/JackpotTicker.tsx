"use client";

import { useEffect, useRef, useState } from "react";
import { PRIZE_TIERS } from "@/lib/constants";
import { formatRand } from "@/lib/tiers";

const TOP = PRIZE_TIERS[PRIZE_TIERS.length - 1].prizeAmount;

/**
 * The jackpot readout in the /form hero: a dark bezel with gold digits that
 * roll up from zero to the top prize when the page loads, the way a casino
 * progressive ticks over. Renders the final figure without JavaScript and
 * under prefers-reduced-motion.
 */
export default function JackpotTicker() {
  const [shown, setShown] = useState<number>(TOP);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const duration = 2200;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setShown(p >= 1 ? TOP : TOP * eased);
      if (p < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className="casino-bezel mt-5 inline-flex flex-col items-center px-6 py-3 sm:px-8">
      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-gold-light/80">
        Win up to
      </span>
      <span
        className="casino-gold-text font-heading text-4xl sm:text-5xl uppercase leading-none tracking-wide tabular-nums mt-1"
        aria-live="off"
      >
        {formatRand(shown)}
      </span>
      <span className="mt-1.5 text-[10px] sm:text-xs text-cream/70">
        One swing. Fully insured by Indwe Risk Services.
      </span>
    </div>
  );
}
