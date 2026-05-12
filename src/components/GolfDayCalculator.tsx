"use client";

import { useState, useMemo, useEffect } from "react";
import { Check, Trophy, Users, Tent, Camera, Image as ImageIcon, Video } from "lucide-react";
import { setGolfDayQuote } from "@/lib/golfDayQuoteStore";

type PrizeOption = {
  prize: string;
  prizeAmount: number;
  pricePerPlayer: number;
  label: string;
};

const PRIZE_OPTIONS: PrizeOption[] = [
  { prize: "R100,000", prizeAmount: 100_000, pricePerPlayer: 75, label: "Standard" },
  { prize: "R250,000", prizeAmount: 250_000, pricePerPlayer: 150, label: "Premium" },
  { prize: "R1,000,000", prizeAmount: 1_000_000, pricePerPlayer: 500, label: "Headline" },
];

type AddOn = {
  id: "station" | "cameras" | "photography" | "video";
  title: string;
  description: string;
  amount: number;
  icon: typeof Tent;
};

const ADD_ONS: AddOn[] = [
  {
    id: "station",
    title: "Activation Station",
    description: "Branded gazebo, table, chairs, flags & banners on the par-3.",
    amount: 3_000,
    icon: Tent,
  },
  {
    id: "cameras",
    title: "2x 4G Solar Cameras",
    description: "Every swing captured. Full verification + social-ready highlights.",
    amount: 2_000,
    icon: Camera,
  },
  {
    id: "photography",
    title: "Photography on the Day",
    description: "Professional photographer covering the activation and the field.",
    amount: 5_000,
    icon: ImageIcon,
  },
  {
    id: "video",
    title: "Event Video",
    description: "Videographer + edit — a shareable highlight reel of your golf day.",
    amount: 10_000,
    icon: Video,
  },
];

const PROMOTER_RATE = 2_000;

function formatRand(n: number): string {
  return "R" + n.toLocaleString("en-ZA");
}

export default function GolfDayCalculator() {
  const [prize, setPrize] = useState<PrizeOption>(PRIZE_OPTIONS[1]);
  const [golfers, setGolfers] = useState<number>(80);
  const [promoters, setPromoters] = useState<number>(2);
  const [selected, setSelected] = useState<Record<AddOn["id"], boolean>>({
    station: true,
    cameras: true,
    photography: false,
    video: false,
  });

  const breakdown = useMemo(() => {
    const prizeCost = golfers * prize.pricePerPlayer;
    const promoterCost = promoters * PROMOTER_RATE;
    const addOnCost = ADD_ONS.reduce(
      (sum, a) => (selected[a.id] ? sum + a.amount : sum),
      0,
    );
    const total = prizeCost + promoterCost + addOnCost;
    return { prizeCost, promoterCost, addOnCost, total };
  }, [golfers, prize, promoters, selected]);

  useEffect(() => {
    setGolfDayQuote({
      prize: prize.prize,
      pricePerPlayer: prize.pricePerPlayer,
      golfers,
      promoters,
      addOns: ADD_ONS.filter((a) => selected[a.id]).map((a) => ({
        title: a.title,
        amount: a.amount,
      })),
      prizeCost: breakdown.prizeCost,
      promoterCost: breakdown.promoterCost,
      addOnCost: breakdown.addOnCost,
      total: breakdown.total,
    });
  }, [prize, golfers, promoters, selected, breakdown]);

  function toggle(id: AddOn["id"]) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-green-dark/10 overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_360px]">
        {/* Left: configurator */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Prize selector */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-gold" />
              <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide">
                1. Choose Your Prize
              </h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {PRIZE_OPTIONS.map((opt) => {
                const active = opt.prizeAmount === prize.prizeAmount;
                return (
                  <button
                    key={opt.prizeAmount}
                    type="button"
                    onClick={() => setPrize(opt)}
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
                      {opt.prize}
                    </p>
                    <p className="text-xs text-charcoal-light/70 mt-2">
                      {formatRand(opt.pricePerPlayer)} / player
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Golfers */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gold" />
              <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide">
                2. Number of Golfers
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={20}
                max={200}
                step={4}
                value={golfers}
                onChange={(e) => setGolfers(Number(e.target.value))}
                className="flex-1 accent-gold"
                aria-label="Number of golfers"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={400}
                  value={golfers}
                  onChange={(e) => setGolfers(Math.max(1, Number(e.target.value) || 0))}
                  className="w-20 text-center rounded-lg border border-green-dark/15 px-3 py-2 font-semibold text-green-dark focus:border-gold focus:outline-none"
                  aria-label="Number of golfers (exact)"
                />
                <span className="text-sm text-charcoal-light/70">players</span>
              </div>
            </div>
            <p className="text-xs text-charcoal-light/60 mt-2">
              {formatRand(prize.pricePerPlayer)} per player × {golfers} ={" "}
              <span className="font-semibold text-green-dark">
                {formatRand(breakdown.prizeCost)}
              </span>
            </p>
          </div>

          {/* Promoters */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gold" />
              <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide">
                3. Promotional Team
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPromoters(n)}
                  className={`w-12 h-12 rounded-full font-bold transition-all ${
                    promoters === n
                      ? "bg-green-dark text-cream"
                      : "bg-cream-dark/50 text-green-dark hover:bg-cream-dark"
                  }`}
                  aria-label={`${n} promoters`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-charcoal-light/60 mt-2">
              {formatRand(PROMOTER_RATE)} per promoter per day · {promoters} ×
              R2,000 ={" "}
              <span className="font-semibold text-green-dark">
                {formatRand(breakdown.promoterCost)}
              </span>
            </p>
          </div>

          {/* Add-ons */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Tent className="w-4 h-4 text-gold" />
              <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide">
                4. On-Course Add-Ons
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {ADD_ONS.map((a) => {
                const Icon = a.icon;
                const active = selected[a.id];
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggle(a.id)}
                    className={`relative text-left rounded-2xl p-4 border-2 transition-all ${
                      active
                        ? "border-gold bg-gold/5"
                        : "border-green-dark/10 hover:border-green-dark/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          active ? "bg-gold/20" : "bg-cream-dark/40"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            active ? "text-gold" : "text-green-dark/50"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-green-dark text-sm">
                            {a.title}
                          </p>
                          <p className="font-bold text-green-dark text-sm whitespace-nowrap">
                            {formatRand(a.amount)}
                          </p>
                        </div>
                        <p className="text-xs text-charcoal-light/70 mt-1 leading-relaxed">
                          {a.description}
                        </p>
                      </div>
                    </div>
                    {active && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-dark" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: summary */}
        <div className="bg-green-dark text-cream p-6 sm:p-8 lg:p-10 lg:sticky lg:top-24 lg:self-start">
          <p className="text-gold text-[10px] font-semibold uppercase tracking-widest">
            Your Quote
          </p>
          <p className="font-heading text-3xl sm:text-4xl uppercase tracking-wide mt-1">
            Activation Total
          </p>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between border-b border-cream/10 pb-3">
              <span className="text-cream/70">
                {prize.prize} prize × {golfers} players
              </span>
              <span className="font-semibold">{formatRand(breakdown.prizeCost)}</span>
            </div>
            <div className="flex justify-between border-b border-cream/10 pb-3">
              <span className="text-cream/70">
                {promoters} promoter{promoters === 1 ? "" : "s"}
              </span>
              <span className="font-semibold">{formatRand(breakdown.promoterCost)}</span>
            </div>
            {ADD_ONS.filter((a) => selected[a.id]).map((a) => (
              <div
                key={a.id}
                className="flex justify-between border-b border-cream/10 pb-3"
              >
                <span className="text-cream/70">{a.title}</span>
                <span className="font-semibold">{formatRand(a.amount)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gold text-green-dark rounded-xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
              Total Investment
            </p>
            <p className="font-heading text-4xl sm:text-5xl mt-1">
              {formatRand(breakdown.total)}
            </p>
          </div>

          <p className="text-cream/60 text-xs mt-4 leading-relaxed">
            Every package includes the Get Lucky branded experience, on-site
            management, a complimentary <span className="text-gold font-semibold">Shanky&apos;s Whip</span> for every
            golfer, and full prize underwriting by Indwe Risk Services.
          </p>

          <a
            href="#enquire"
            className="mt-6 block w-full text-center bg-cream hover:bg-white text-green-dark font-bold text-base px-6 py-4 rounded-full transition-all"
          >
            Lock In This Package
          </a>
        </div>
      </div>
    </div>
  );
}
