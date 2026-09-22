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
    href: "https://indwemicrosite.vercel.app/",
  },
  {
    icon: MapPin,
    title: "Become a Partner Course",
    blurb:
      "Install SA's leading, always-on, hole in one challenge live at 25+ premium golf courses nationwide.",
    href: "/become-a-partner",
  },
];

/**
 * Homepage hero in the app's V2 language: the course photo under the app's
 * scrim, the vector Hole-in-1 Challenge lockup, one Poster Gothic line, and
 * the four product pillars as white cards. Swings are bought at the tee box
 * through the QR form, so there is no buy button here. The Indwe strip
 * stays along the bottom, as on the app's landing screen.
 */
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

        {/* The app's photo scrim, deepening to forest green under the pillars */}
        <div className="absolute inset-0 photo-scrim" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-dark/85 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center pt-28 pb-14">
            <div className="mb-6 sm:mb-8 flex justify-center scale-in">
              <Image
                src="/brand/logo-lockup.svg"
                alt="Get Lucky Hole-in-1 Challenge"
                width={552}
                height={588}
                unoptimized
                priority
                className="h-40 sm:h-52 md:h-64 w-auto drop-shadow-[0_14px_30px_rgba(0,0,0,0.28)]"
              />
            </div>

            <h1 className="fade-up-1 font-heading text-white text-[clamp(1.6rem,6.2vw,4.25rem)] leading-[1.05] drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
              Win a Million for a Hole-in-1
              <span className="sr-only">
                {" "}— Get Lucky Golf Club, South Africa&apos;s leading
                hole-in-one golf activation
              </span>
            </h1>

            <p className="fade-up-2 mt-4 sm:mt-5 mb-10 sm:mb-14 text-white text-lg sm:text-2xl leading-snug drop-shadow-[0_1px_12px_rgba(0,0,0,0.3)]">
              Choose a par 3. Back yourself.{" "}
              <strong className="font-bold">Win up to R1 Million.</strong>
            </p>


            {/* Product pillars — one CTA per offering */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-md sm:max-w-2xl lg:max-w-5xl mx-auto">
              {PILLARS.map((pillar, i) => {
                const Icon = pillar.icon;
                const isExternal = pillar.href.startsWith("http");
                return (
                  <Link
                    key={pillar.title}
                    href={pillar.href}
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={`fade-up-${Math.min(i + 1, 4)} group card--glass flex flex-col items-center justify-start text-center gap-2 px-4 py-5 transition-transform hover:-translate-y-0.5 last:odd:col-span-2 last:odd:max-w-[calc(50%-0.375rem)] last:odd:mx-auto lg:last:odd:col-span-1 lg:last:odd:max-w-none`}
                  >
                    <span className="icon-disc">
                      <Icon className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <span className="font-heading text-lg leading-tight text-green">
                      {pillar.title}
                    </span>
                    <span className="text-green/80 text-xs leading-snug">
                      {pillar.blurb}
                    </span>
                    <span className="mt-auto pt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-green/70 transition-colors group-hover:text-green">
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
