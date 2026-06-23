import { Check, Crown } from "lucide-react";

const benefits = [
  "Unlimited swings on any Get Lucky challenge hole",
  "Win up to R100,000 for a hole-in-one",
  "Exclusive golden bag tag",
  "Professional video of every hole-in-one",
  "No lock-in — cancel anytime",
  "Founding member perks for early joiners",
];

export default function Membership() {
  return (
    <section id="membership" className="py-24 sm:py-32 bg-green-dark relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/25 rounded-full px-4 py-1.5 mb-6">
            <Crown className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">
              Membership
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl text-cream mt-1 uppercase tracking-wide">
            Unlimited Swings at R100,000.
            <br />
            <span className="text-gold">One Monthly Fee.</span>
          </h2>
          <p className="text-cream/70 mt-4 max-w-lg mx-auto">
            R149/month at any Get Lucky Partner course. Unlimited attempts on
            the challenge hole, every round you play.
          </p>
        </div>

        {/* Two-column: Benefits + Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Benefits */}
          <div className="bg-cream/5 border border-cream/10 rounded-2xl p-8">
            <h3 className="text-cream text-lg font-bold mb-6">
              What you get
            </h3>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-cream/70 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing card */}
          <div className="bg-cream/5 border-2 border-gold/25 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-cream/60 text-xs uppercase tracking-widest mb-2">
                Monthly Membership
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl sm:text-6xl font-black text-cream">R149</span>
                <span className="text-cream/60 text-lg">/month</span>
              </div>
              <p className="text-cream/70 text-sm mb-8">
                No lock-in contract. Cancel anytime. Start playing immediately.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-cream/60 text-sm">
                  <div className="w-8 h-8 bg-gold/15 rounded-lg flex items-center justify-center">
                    <Crown className="w-4 h-4 text-gold" />
                  </div>
                  <span>Win up to <strong className="text-gold">R100,000</strong> per hole-in-one</span>
                </div>
                <div className="flex items-center gap-3 text-cream/60 text-sm">
                  <div className="w-8 h-8 bg-gold/15 rounded-lg flex items-center justify-center">
                    <span className="text-gold text-xs font-bold">∞</span>
                  </div>
                  <span>Unlimited swings every month</span>
                </div>
              </div>
            </div>

            <a
              href="https://membership.getluckygolfclub.com/join/get-lucky"
              className="block text-center bg-gold hover:bg-gold-light text-green-dark font-bold text-lg py-4 rounded-full transition-all hover:scale-105"
            >
              Join the Club
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
