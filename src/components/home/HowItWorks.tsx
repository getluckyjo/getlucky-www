import { QrCode, CreditCard, Flag, Camera, PartyPopper } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    icon: QrCode,
    title: "Enter",
    subtitle: "Scan the QR code",
    description:
      "Scan the QR code at the tee box. No app needed — straight to the entry page.",
  },
  {
    icon: CreditCard,
    title: "Pay",
    subtitle: "Select your entry",
    description:
      "Pick your entry from R50 to R1,000 and pay instantly. Bigger entry, bigger prize.",
  },
  {
    icon: Flag,
    title: "Play",
    subtitle: "Take your shot",
    description: "One swing on the signature par-3. Standard rules apply.",
  },
  {
    icon: Camera,
    title: "Verify",
    subtitle: "Camera captures it",
    description:
      "Solar-powered 4G cameras capture every attempt automatically. No disputes.",
  },
  {
    icon: PartyPopper,
    title: "Win",
    subtitle: "Collect your prize",
    description:
      "Verified hole-in-ones paid out within 15 working days. Fully insured by Santam & Indwe.",
  },
];

/**
 * Five steps on one line: a numbered track with a hairline running through
 * it, the way a product walkthrough reads. It stacks on phones with the line
 * turning vertical.
 */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section bg-white scroll-mt-20">
      <div className="wrap">
        <SectionHeader
          kicker="How it works"
          title="Scan. Pay. Play."
          lede="No membership required. No handicap needed. Just scan, pay, play — and if you sink it, you win. Fully automated, professionally managed."
        />

        <div className="relative mt-16">
        {/* The track */}
        <span
          aria-hidden
          className="hidden lg:block absolute left-0 right-0 top-[22px] h-px bg-gradient-to-r from-line-strong via-line-strong to-transparent"
        />
        <ol className="grid gap-0 lg:grid-cols-5 lg:gap-6">
          {steps.map((item, i) => (
            <li
              key={item.title}
              className="reveal relative grid grid-cols-[44px_1fr] gap-x-5 pb-10 last:pb-0 lg:block lg:pb-0"
            >
              {/* Vertical track on phones */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="lg:hidden absolute left-[22px] top-12 bottom-1 w-px bg-line-strong"
                />
              )}
              <span
                className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-full border ${
                  i === steps.length - 1
                    ? "bg-lime border-lime text-green-dark"
                    : "bg-white border-line-strong text-green"
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
              </span>
              <div className="lg:mt-7">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted tabular-nums">
                  0{i + 1} · {item.subtitle}
                </p>
                <h3 className="mt-2 font-heading text-[28px] leading-none text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted max-w-sm">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}
