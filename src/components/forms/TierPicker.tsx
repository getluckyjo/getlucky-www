"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Crown, Sparkles, Trophy } from "lucide-react";
import { PRIZE_TIERS, type PrizeTier } from "@/lib/constants";
import { findTier, formatRand, tierMultiplier, upsellCopy } from "@/lib/tiers";

/**
 * Prize-first entry picker shared by the tee-box form and the voucher form.
 *
 * Built on what bet slips and jackpot screens do well:
 *  - the payout is the headline, the stake is the small print;
 *  - the payout-to-stake ratio is on every card, so climbing the ladder
 *    reads as better odds and not only a bigger spend;
 *  - the potential win is echoed live under the grid and counts up when it
 *    changes, the "instant payout visibility" every sportsbook slip has;
 *  - there is always a one-tap nudge to the next rung (the "bet max" step),
 *    framed as the extra rand rather than the new total;
 *  - the top rung is dressed as the jackpot and never sits still;
 *  - a pick lands with a pop, a glow and a haptic tick on phones.
 *
 * It renders real radio inputs named `entryAmount`, so both forms keep reading
 * the value out of FormData exactly as before.
 */
export default function TierPicker({
  value,
  onChange,
  columns = "grid-cols-2 sm:grid-cols-3",
}: {
  value: number;
  onChange: (entryAmount: number) => void;
  /** Grid column classes; the voucher page has room for a 6-wide ladder. */
  columns?: string;
}) {
  const current = findTier(value) ?? PRIZE_TIERS[0];
  const upsell = upsellCopy(current.entryAmount);
  const top = PRIZE_TIERS[PRIZE_TIERS.length - 1];

  function pick(amount: number) {
    if (amount === value) return;
    onChange(amount);
    // A short tick on phones that support it. Guarded: desktop Safari and
    // Firefox have no vibrate, and some browsers throw without a gesture.
    try {
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") navigator.vibrate(8);
    } catch {
      /* decorative */
    }
  }

  return (
    <div className="space-y-3">
      <div className={`grid ${columns} gap-3 pt-2`}>
        {PRIZE_TIERS.map((t) => (
          <TierCard
            key={t.entryAmount}
            tier={t}
            checked={t.entryAmount === value}
            jackpot={t.entryAmount === top.entryAmount}
            onPick={() => pick(t.entryAmount)}
          />
        ))}
      </div>

      <PayoutStrip tier={current} />

      {upsell ? (
        <button
          type="button"
          onClick={() => pick(upsell.next.entryAmount)}
          className="group w-full flex items-center justify-between gap-3 rounded-xl border border-dashed border-gold/60 bg-gold/5 hover:bg-gold/15 active:scale-[0.99] px-4 py-3 text-left transition-all"
        >
          <span className="text-sm text-green-dark">
            <span className="font-bold">Add {formatRand(upsell.extra)}</span>
            <span className="text-green-dark/70"> and play for </span>
            <span className="font-heading text-lg uppercase tracking-wide text-gold">{upsell.prize}</span>
          </span>
          <ArrowRight className="w-4 h-4 text-gold flex-shrink-0 transition-transform group-hover:translate-x-1" />
        </button>
      ) : (
        <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-green-dark/70 py-2">
          <Crown className="w-4 h-4 text-gold" />
          Top of the ladder. Sink it and it&apos;s yours.
        </p>
      )}
    </div>
  );
}

function TierCard({
  tier,
  checked,
  jackpot,
  onPick,
}: {
  tier: PrizeTier;
  checked: boolean;
  jackpot: boolean;
  onPick: () => void;
}) {
  const mult = tierMultiplier(tier);
  const rung = tier.label.replace(/ Swing$/, "");

  const shell = jackpot
    ? checked
      ? "border-gold bg-gradient-to-br from-green-dark via-green to-green-dark text-cream tier-selected"
      : "border-gold/50 bg-gradient-to-br from-green-dark via-green-dark to-green text-cream hover:border-gold"
    : checked
      ? "border-gold bg-gradient-to-br from-gold-light/50 via-white to-gold/20 text-green-dark tier-selected"
      : "border-green-dark/15 bg-white text-green-dark hover:border-gold/60 hover:-translate-y-0.5 hover:shadow-md";

  return (
    <label
      className={`@container relative isolate cursor-pointer overflow-hidden rounded-xl border-2 px-2 pt-6 pb-3 text-center transition-all duration-200 active:scale-95 ${shell} ${
        jackpot ? "tier-shimmer" : ""
      }`}
    >
      <input
        type="radio"
        name="entryAmount"
        value={tier.entryAmount}
        checked={checked}
        onChange={onPick}
        className="sr-only"
      />

      {tier.popular && (
        <span className="absolute top-0 left-0 rounded-br-lg bg-green-dark px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gold whitespace-nowrap">
          Most popular
        </span>
      )}
      {jackpot && (
        <span className="absolute top-0 left-0 flex items-center gap-1 rounded-br-lg bg-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-green-dark whitespace-nowrap">
          <Sparkles className="w-2.5 h-2.5" /> Jackpot
        </span>
      )}

      <span
        aria-hidden
        className={`absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-green-dark transition-all duration-200 ${
          checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <Check className="w-3 h-3" strokeWidth={3} />
      </span>

      <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${jackpot ? "text-cream/60" : "text-charcoal-light/50"}`}>
        Win
      </p>
      <p
        className={`font-heading uppercase tracking-wide leading-none mt-0.5 whitespace-nowrap text-[clamp(1rem,15cqw,1.6rem)] ${
          jackpot ? "text-gold-light" : "text-gold"
        }`}
      >
        {tier.prize}
      </p>
      <p className={`mt-1 text-[clamp(9px,8.5cqw,11px)] font-bold tabular-nums whitespace-nowrap ${jackpot ? "text-cream/80" : "text-green-dark/70"}`}>
        {mult.toLocaleString("en-US")}× your entry
      </p>

      <div className={`mx-auto my-2 h-px w-8 ${jackpot ? "bg-cream/20" : "bg-green-dark/10"}`} />

      <p className={`text-[clamp(10px,9.5cqw,12px)] whitespace-nowrap ${jackpot ? "text-cream/70" : "text-charcoal-light/60"}`}>
        <span className={`font-bold ${jackpot ? "text-cream" : "text-green-dark"}`}>{tier.entry}</span> · {rung}
      </p>
    </label>
  );
}

/**
 * The live "you could win" echo. The rand figure counts up (or down) to the
 * new prize over ~600ms so a change is felt rather than just swapped in.
 */
function PayoutStrip({ tier }: { tier: PrizeTier }) {
  const [shown, setShown] = useState<number>(tier.prizeAmount);
  // The figure currently on screen, readable synchronously, so a quick second
  // tap animates from wherever the first count-up had got to.
  const shownRef = useRef<number>(tier.prizeAmount);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const target = tier.prizeAmount;
    const from = shownRef.current;
    if (from === target) return;
    const paint = (v: number) => {
      shownRef.current = v;
      setShown(v);
    };
    const reduce =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 0 : 600;
    const start = performance.now();
    const step = (now: number) => {
      const p = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      paint(p >= 1 ? target : from + (target - from) * eased);
      if (p < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [tier.prizeAmount]);

  const mult = tierMultiplier(tier);

  return (
    <div
      key={tier.entryAmount}
      className="tier-rise flex items-center gap-3 rounded-xl bg-green-dark px-4 py-3 text-cream shadow-lg"
      aria-live="polite"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
        <Trophy className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/60">You could win</p>
        <p className="font-heading text-3xl uppercase leading-none tracking-wide text-gold tabular-nums">
          {formatRand(shown)}
        </p>
        <p className="mt-1 text-xs text-cream/70">
          for a <span className="font-bold text-cream">{tier.entry}</span> swing ·{" "}
          <span className="font-bold text-gold-light tabular-nums">{mult.toLocaleString("en-US")}× your entry</span>
        </p>
      </div>
    </div>
  );
}
