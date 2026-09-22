import { PRIZE_TIERS, ROUTES } from "@/lib/constants";
import Link from "next/link";
import { Shield } from "lucide-react";

/**
 * The stake ladder on the dark panel. Prize figures are the one place gold
 * survives in V2, and only here on green-dark. The popular rung is the lime
 * card with the hard shadow, as the app dresses its best plan.
 */
export default function PrizeTiers() {
  return (
    <section id="prizes" className="py-24 sm:py-32 bg-green-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="eyebrow eyebrow--dark">Choose Your Entry</span>
          <h2 className="font-heading text-3xl sm:text-5xl text-white mt-3">
            Pick Your Prize
          </h2>
          <p className="text-white/70 mt-4 max-w-lg mx-auto">
            One swing. The bigger the entry, the bigger the prize. Redeemable at
            any Get Lucky partner course.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {PRIZE_TIERS.map((tier) => (
            <Link
              key={tier.entry}
              href={ROUTES.buyVoucher}
              className={`relative rounded-xl p-6 text-center transition-transform hover:-translate-y-1 group ${
                tier.popular
                  ? "bg-lime text-green shadow-[4px_5px_0_rgba(0,0,0,0.3)]"
                  : "bg-green text-white border-2 border-transparent hover:border-lime"
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
            </Link>
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

        <div className="mt-8 text-center">
          <Link href={ROUTES.buyVoucher} className="btn-lime btn-lime--dark">
            Buy Your Swing Now
          </Link>
        </div>
      </div>
    </section>
  );
}
