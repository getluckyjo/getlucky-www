import { PRIZE_TIERS, ROUTES } from "@/lib/constants";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function PrizeTiers() {
  return (
    <section id="prizes" className="py-24 sm:py-32 bg-green-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest">
            Choose Your Entry
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-cream mt-3 uppercase tracking-wide">
            Pick Your Prize
          </h2>
          <p className="text-cream/60 mt-4 max-w-lg mx-auto">
            One swing. The bigger the entry, the bigger the prize. Redeemable at
            any Get Lucky partner course.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {PRIZE_TIERS.map((tier) => (
            <Link
              key={tier.entry}
              href={ROUTES.buyVoucher}
              className={`relative rounded-2xl p-6 text-center transition-all hover:scale-105 group ${
                tier.popular
                  ? "bg-gold text-green-dark shadow-xl scale-[1.02]"
                  : "bg-green-dark border border-cream/10 hover:border-gold/30"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-dark text-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </span>
              )}

              <p
                className={`text-sm font-medium mb-1 ${
                  tier.popular ? "text-green-dark/60" : "text-cream/60"
                }`}
              >
                Entry
              </p>
              <p
                className={`text-2xl sm:text-3xl font-black mb-4 ${
                  tier.popular ? "text-green-dark" : "text-cream"
                }`}
              >
                {tier.entry}
              </p>

              <div
                className={`h-px w-12 mx-auto mb-4 ${
                  tier.popular ? "bg-green-dark/20" : "bg-cream/10"
                }`}
              />

              <p
                className={`text-xs font-medium mb-1 ${
                  tier.popular ? "text-green-dark/60" : "text-cream/60"
                }`}
              >
                Win
              </p>
              <p
                className={`text-xl sm:text-2xl font-black ${
                  tier.popular ? "text-green-dark" : "text-gold"
                }`}
              >
                {tier.prize}
              </p>
            </Link>
          ))}
        </div>

        {/* Insurance trust strip */}
        <div className="mt-12 flex items-center justify-center gap-3 text-cream/60">
          <Shield className="w-4 h-4" />
          <p className="text-sm">
            All prizes fully insured by{" "}
            <span className="text-cream/80 font-medium">
              Indwe Risk Services
            </span>{" "}
            — FSP 3425
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href={ROUTES.buyVoucher}
            className="inline-block bg-gold hover:bg-gold-light text-green-dark font-bold text-lg px-10 py-4 rounded-full transition-all hover:scale-105"
          >
            Buy Your Swing Now
          </Link>
        </div>
      </div>
    </section>
  );
}
