import Image from "next/image";
import { Gift, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { MEMBERSHIP } from "@/lib/constants";

const MEMBERSHIP_VALUE = MEMBERSHIP.amount * 12; // R149 × 12 = R1,788
const QUOTE_URL = "https://indwemicrosite.vercel.app";

const perks = [
  "Unlimited swings on every Get Lucky challenge hole",
  `Win up to ${MEMBERSHIP.prize} for a hole-in-one, every round`,
  "Exclusive golden bag tag + founding member perks",
];

export default function IndweOffer() {
  return (
    <section id="quote" className="py-16 sm:py-24 bg-cream relative overflow-hidden scroll-mt-20">
      {/* Soft gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-4 py-1.5">
            <Gift className="w-3.5 h-3.5 text-gold" />
            <span className="text-green-dark text-xs font-semibold uppercase tracking-widest">
              Exclusive Sponsor Offer
            </span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-center font-heading text-3xl sm:text-5xl text-green-dark uppercase tracking-wide leading-tight max-w-3xl mx-auto">
          Get a free 12-month{" "}
          <span className="text-gold">Hole-in-One Membership</span>
        </h2>
        <p className="text-center text-green-dark/70 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
          Request a no-obligation insurance quote from our headline sponsor,
          Indwe Risk Services, and qualify for a full year of Get Lucky Club
          membership — on us.
        </p>

        {/* Offer card */}
        <div className="mt-10 bg-white rounded-3xl border-2 border-gold/30 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left: value + CTA */}
            <div className="lg:col-span-2 bg-green-dark p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <p className="text-cream/60 text-xs uppercase tracking-widest mb-3">
                  Membership Value
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl sm:text-6xl font-black text-cream">
                    R{MEMBERSHIP_VALUE.toLocaleString("en-ZA")}
                  </span>
                </div>
                <p className="text-gold text-sm font-semibold uppercase tracking-wider">
                  Yours, free
                </p>
                <p className="text-cream/70 text-sm mt-4 leading-relaxed">
                  R{MEMBERSHIP.amount}/month × 12 months of unlimited swings at
                  every Get Lucky partner course nationwide.
                </p>
              </div>

              <a
                href={QUOTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 group inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-green-dark font-bold text-base sm:text-lg py-4 px-6 rounded-full transition-all hover:scale-[1.02]"
              >
                Get my no-obligation quote
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <p className="text-cream/50 text-[11px] text-center mt-3 uppercase tracking-wider">
                Takes 60 seconds
              </p>
            </div>

            {/* Right: how it works + perks */}
            <div className="lg:col-span-3 p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-5">
                <Image
                  src="/logos/brands/indwe.svg"
                  alt="Indwe Risk Services"
                  width={140}
                  height={40}
                  className="h-8 sm:h-9 w-auto"
                />
                <span className="text-green-dark/25 text-base">×</span>
                <span className="font-heading text-sm sm:text-base text-green-dark uppercase tracking-wide">
                  Get Lucky Golf
                </span>
              </div>

              <h3 className="font-heading text-lg sm:text-xl text-green-dark uppercase tracking-wide mb-4">
                How it works
              </h3>
              <ol className="space-y-3 mb-6">
                {[
                  "Tap the button and share a few details with Indwe.",
                  "An Indwe broker prepares a no-obligation quote on your terms.",
                  "Your 12-month Get Lucky Membership is unlocked — no payment required.",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0072B8]/10 text-[#0072B8] text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-green-dark/80 text-sm leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="border-t border-green-dark/10 pt-5">
                <p className="text-green-dark/50 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Your free membership includes
                </p>
                <ul className="space-y-2">
                  {perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-green-dark/75 text-sm leading-snug">
                        {perk}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-green-dark/40 text-xs mt-6 max-w-2xl mx-auto">
          Membership provided by Get Lucky Golf Club. Quote provided by Indwe
          Risk Services (FSP). Offer subject to standard terms.
        </p>
      </div>
    </section>
  );
}
