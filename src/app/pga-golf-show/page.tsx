import type { Metadata } from "next";
import Image from "next/image";
import PgaGolfShowEntryForm from "@/components/forms/PgaGolfShowEntryForm";
import SponsorLogo from "@/components/SponsorLogo";
import { PGA_GOLF_SHOW } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Free Shot at ${PGA_GOLF_SHOW.prize} — ${PGA_GOLF_SHOW.name}`,
  description: `Enter your name and number for a free simulator hole-in-one shot at ${PGA_GOLF_SHOW.prize} at the ${PGA_GOLF_SHOW.name}, ${PGA_GOLF_SHOW.dates}.`,
  robots: { index: false, follow: false },
};

/**
 * /pga-golf-show — free simulator entry at the PGA Golf & Lifestyle Show.
 *
 * Same bones as /form: no global nav, so a phone scanning the QR at the stand
 * lands straight in the form. Co-branded with the show and the stand's
 * co-sponsors above the form, Indwe as headline sponsor below it, exactly as
 * on the course forms.
 */
export default function PgaGolfShowPage() {
  return (
    <main className="min-h-screen relative">
      {/* Hero background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-bg.avif"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-dark/85 via-green-dark/65 to-green-dark/90" />
      </div>

      {/* Co-brand lockup: the show alongside the challenge */}
      <div className="max-w-md mx-auto px-4 pt-6 sm:pt-10">
        <div className="rounded-2xl bg-white/95 border border-white/40 shadow-xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="text-green-dark min-w-0">
            <SponsorLogo
              name={PGA_GOLF_SHOW.showLogo.name}
              file={PGA_GOLF_SHOW.showLogo.file}
              height={44}
              wordmarkClassName="text-xl sm:text-2xl text-green-dark"
            />
            <p className="text-[11px] uppercase tracking-widest text-charcoal-light/60 mt-1">
              {PGA_GOLF_SHOW.dates}
            </p>
          </div>
          <Image
            src="/logos/challenge-bordered.png"
            alt="Get Lucky Hole-in-One Challenge"
            width={420}
            height={420}
            className="h-16 sm:h-20 w-auto flex-shrink-0"
            priority
          />
        </div>
      </div>

      {/* Headline */}
      <div className="max-w-md mx-auto px-4 pt-6 pb-8">
        <div className="text-center mb-6">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest drop-shadow">
            Simulator Hole-in-One · Free Entry
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl text-cream uppercase tracking-wide mt-2 drop-shadow-md">
            One Shot at {PGA_GOLF_SHOW.prize}
          </h1>
          <p className="text-sm sm:text-base text-cream/85 mt-3 leading-relaxed drop-shadow">
            Your name, your number, and a follow on Instagram. Then find the Get Lucky stand and
            swing.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-white/40 p-5 sm:p-7">
          <PgaGolfShowEntryForm />
        </div>

        {/* Co-sponsors */}
        <div className="mt-6 rounded-2xl bg-white/95 border border-white/40 shadow-xl px-5 py-5">
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-charcoal-light/60">
            In partnership with
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-green-dark">
            {PGA_GOLF_SHOW.sponsors.map((s) => (
              <li key={s.name} className="flex items-center">
                <SponsorLogo
                  name={s.name}
                  file={s.file}
                  height={40}
                  wordmarkClassName="text-xl text-green-dark"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Indwe sponsor banner — stacked on mobile, wide on desktop */}
      <div className="max-w-md mx-auto px-4 pb-8 sm:pb-12">
        <div className="rounded-xl overflow-hidden border border-white/30 shadow-2xl bg-white">
          <div className="sm:hidden flex justify-center p-6">
            <Image
              src="/logos/indwe-stacked.png"
              alt="Proudly Sponsored by Indwe Risk Services"
              width={600}
              height={400}
              className="w-auto h-auto max-w-[240px]"
            />
          </div>
          <iframe
            src="/indwe-banner/index.html"
            title="Indwe Risk Services — Headline Sponsor"
            loading="lazy"
            className="hidden sm:block w-full border-0"
            style={{ aspectRatio: "1600 / 333", minHeight: "170px" }}
          />
        </div>
      </div>
    </main>
  );
}
