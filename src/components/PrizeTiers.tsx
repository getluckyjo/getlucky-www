import { PRIZE_TIERS } from "@/lib/constants";
import { Shield } from "lucide-react";
import SectionTexture from "./SectionTexture";

/**
 * The stake ladder on the dark panel. Prize figures are the one place gold
 * survives in V2, and only here on green-dark. The popular rung is the lime
 * card with the hard shadow, as the app dresses its best plan. Swings are
 * bought at the tee box (the QR form), so the ladder is a display, not a
 * shop.
 */
export default function PrizeTiers() {
  return (
    <section id="prizes" className="py-24 sm:py-32 bg-green-dark relative overflow-hidden">
      <SectionTexture src="/images/courses/st-francis-links.jpg" position="center 40%" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="eyebrow eyebrow--dark">Choose Your Entry</span>
          <h2 className="font-heading text-3xl sm:text-5xl text-white mt-3">
            Pick Your Prize
          </h2>
          <p className="text-white/70 mt-4 max-w-lg mx-auto">
            One swing. The bigger the entry, the bigger the prize. Scan the QR
            code at the tee box of any Get Lucky partner course to play.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {PRIZE_TIERS.map((tier) => (
            <div
              key={tier.entry}
              className={`relative rounded-xl p-6 text-center ${
                tier.popular
                  ? "bg-lime text-green shadow-[4px_5px_0_rgba(0,0,0,0.3)]"
                  : "bg-green text-white"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green text-lime text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full whitespace-nowrap">
                  Most Popular
                </span>
              )}

              <p
                className={`text-[11px] font-bold uppercase tracking-[0.12em] mb-1 ${
                  tier.popular ? "text-green/70" : "text-white/70"
                }`}
              >
                Entry
              </p>
              <p className="font-heading text-2xl sm:text-3xl mb-4">{tier.entry}</p>

              <div
                className={`h-px w-12 mx-auto mb-4 ${
                  tier.popular ? "bg-green/20" : "bg-white/15"
                }`}
              />

              <p
                className={`text-[11px] font-bold uppercase tracking-[0.12em] mb-1 ${
                  tier.popular ? "text-green/70" : "text-white/70"
                }`}
              >
                Win
              </p>
              <p
                className={`font-heading text-xl sm:text-2xl ${
                  tier.popular ? "text-green" : "text-gold"
                }`}
              >
                {tier.prize}
              </p>
            </div>
          ))}
        </div>

        {/* Insurance trust strip */}
        <div className="mt-12 flex items-center justify-center gap-3 text-white/70">
          <Shield className="w-4 h-4 text-lime" />
          <p className="text-sm">
            All prizes fully insured by{" "}
            <span className="text-white font-medium">Indwe Risk Services</span>{" "}
            — FSP 3425
          </p>
        </div>
      </div>
    </section>
  );
}
