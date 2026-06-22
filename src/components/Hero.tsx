import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  ShieldCheck,
  MapPin,
  ArrowRight,
} from "lucide-react";

/**
 * Landing-page pillars — one per product we offer. Each explains the offering
 * at a glance and links to the relevant tile/page. Source: status session
 * (Andrew Davenport, 18 Jun 2026) + Indwe quote-pillar wording (Brendon Pillay).
 */
const PILLARS = [
  {
    icon: BadgeCheck,
    title: "Become a Member",
    blurb: "Unlimited swings at R100,000 — just R149/month.",
    href: "/#membership",
  },
  {
    icon: CalendarDays,
    title: "Book Your Golf Day",
    blurb:
      "Make your corporate golf day unforgettable with the hole in one challenge.",
    href: "/corporate-golf-days",
  },
  {
    icon: ShieldCheck,
    title: "Get an Insurance Quote",
    blurb: "Obligation-free Indwe quote + complimentary Get Lucky deals.",
    href: "/#quote",
  },
  {
    icon: MapPin,
    title: "Become a Partner Course",
    blurb:
      "Install SA's leading, always-on, hole in one challenge live at 25+ premium golf courses nationwide.",
    href: "/become-a-partner",
  },
];

export default function Hero() {
  return (
    <>
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-green-dark">
        {/* Golf course background image */}
        <Image
          src="/images/hero-bg.avif"
          alt=""
          fill
          className="object-cover"
          priority
        />

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-dark/90 via-green-dark/50 to-green-dark/30" />

        {/* Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center pt-24 pb-12">
            <div className="mb-5 sm:mb-6 flex justify-center">
              <Image
                src="/logos/challenge-full.png"
                alt="Get Lucky Hole-in-1 Challenge logo"
                width={400}
                height={435}
                className="h-28 sm:h-36 md:h-44 w-auto drop-shadow-2xl"
                priority
              />
            </div>

            <h1 className="mb-9 sm:mb-12 font-heading uppercase tracking-wide text-cream whitespace-nowrap text-[clamp(1.1rem,5.4vw,3.75rem)] leading-none drop-shadow-lg">
              Win A Million For A Hole-in-1
              <span className="sr-only">
                {" "}— Get Lucky Golf Club, South Africa&apos;s leading
                hole-in-one golf activation
              </span>
            </h1>

            {/* Product pillars — one CTA per offering */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-md sm:max-w-2xl lg:max-w-5xl mx-auto">
              {PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <Link
                    key={pillar.title}
                    href={pillar.href}
                    className="group flex flex-col items-center text-center gap-2 rounded-2xl border border-cream/15 bg-green-dark/40 backdrop-blur-sm px-4 py-5 transition-all hover:border-gold/60 hover:bg-green-dark/70 last:odd:col-span-2 last:odd:max-w-[calc(50%-0.375rem)] last:odd:mx-auto lg:last:odd:col-span-1 lg:last:odd:max-w-none"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold transition-colors group-hover:bg-gold/25">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="font-bold text-cream text-sm sm:text-base leading-tight">
                      {pillar.title}
                    </span>
                    <span className="text-cream/70 text-xs leading-snug">
                      {pillar.blurb}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold opacity-0 transition-opacity group-hover:opacity-100">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Headline sponsor banner */}
        <div className="relative z-10 bg-white py-4 sm:py-5">
          <div className="max-w-3xl mx-auto px-6">
            <iframe
              src="/indwe-banner/index.html"
              title="Indwe Risk Services — Headline Sponsor"
              loading="lazy"
              className="w-full block border-0"
              style={{ aspectRatio: "1600 / 333" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
