import { QrCode, CreditCard, Flag, Camera, PartyPopper } from "lucide-react";

const steps = [
  {
    icon: QrCode,
    step: "01",
    title: "Enter",
    subtitle: "Scan the QR Code",
    description:
      "Scan the QR code at the tee box. No app needed — straight to the entry page.",
  },
  {
    icon: CreditCard,
    step: "02",
    title: "Pay",
    subtitle: "Select Your Entry",
    description:
      "Pick your entry from R50 to R1,000 and pay instantly. Bigger entry, bigger prize.",
  },
  {
    icon: Flag,
    step: "03",
    title: "Play",
    subtitle: "Take Your Shot",
    description:
      "One swing on the signature par-3. Standard rules apply.",
  },
  {
    icon: Camera,
    step: "04",
    title: "Verify",
    subtitle: "Camera Captures It",
    description:
      "Solar-powered 4G cameras capture every attempt automatically. No disputes.",
  },
  {
    icon: PartyPopper,
    step: "05",
    title: "Win",
    subtitle: "Collect Your Prize",
    description:
      "Verified hole-in-ones paid out within 15 working days. Fully insured by Santam & Indwe.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-green text-xs font-semibold uppercase tracking-widest">
            Fully Automated. Professionally Managed.
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-green-dark mt-3 uppercase tracking-wide">
            How It Works
          </h2>
          <p className="text-green-dark/60 mt-4 max-w-lg mx-auto">
            No membership required. No handicap needed. Just scan, pay, play — and
            if you sink it, you win.
          </p>
        </div>

        {/* 5-step flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((item, i) => (
            <div
              key={item.step}
              className="relative bg-white border border-green-dark/8 rounded-2xl p-6 group hover:border-green/20 hover:shadow-lg transition-all"
            >
              {/* Connector arrow (hidden on mobile and last item) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-green/20">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M0 0L12 6L0 12z" />
                  </svg>
                </div>
              )}

              <span className="text-5xl font-black text-green-dark/[0.04] select-none absolute top-4 right-4">
                {item.step}
              </span>
              <div className="w-12 h-12 bg-green/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green/15 transition-colors">
                <item.icon className="w-6 h-6 text-green" />
              </div>
              <h3 className="text-lg font-bold text-green-dark mb-1">
                {item.title}
              </h3>
              <p className="text-gold text-xs font-semibold uppercase tracking-wider mb-3">
                {item.subtitle}
              </p>
              <p className="text-green-dark/60 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
