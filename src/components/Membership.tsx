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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-lime/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="chip-lime inline-flex mb-6">
            <Crown className="w-3.5 h-3.5" />
            <span>Membership</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl text-white mt-1 uppercase">
            Unlimited Swings at R100,000.
            <br />
            <span className="text-lime">One Monthly Fee.</span>
          </h2>
          <p className="text-white/70 mt-4 max-w-lg mx-auto">
            R149/month at any Get Lucky Partner course. Unlimited attempts on
            the challenge hole, every round you play.
          </p>
        </div>

        {/* Two-column: Benefits + Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Benefits */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h3 className="text-white text-lg font-bold mb-6">
              What you get
            </h3>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" />
                  <span className="text-white/70 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing card */}
          <div className="bg-green border-2 border-lime rounded-xl p-8 flex flex-col justify-between">
            <div>
              <p className="eyebrow eyebrow--dark mb-2">
                Monthly Membership
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl sm:text-6xl font-heading text-white">R149</span>
                <span className="text-white/60 text-lg">/month</span>
              </div>
              <p className="text-white/70 text-sm mb-8">
                No lock-in contract. Cancel anytime. Start playing immediately.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <div className="icon-disc w-8 h-8">
                    <Crown className="w-4 h-4" />
                  </div>
                  <span>Win up to <strong className="text-gold">R100,000</strong> per hole-in-one</span>
                </div>
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <div className="icon-disc w-8 h-8">
                    <span className="text-xs font-bold">∞</span>
                  </div>
                  <span>Unlimited swings every month</span>
                </div>
              </div>
            </div>

            <a
              href="https://membership.getluckygolfclub.com/join/get-lucky"
              className="btn-lime btn-lime--dark w-full"
            >
              Join the Club
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
