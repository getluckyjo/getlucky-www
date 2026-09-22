import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PgaGolfShowEntryForm from "@/components/forms/PgaGolfShowEntryForm";
import SponsorLogo from "@/components/SponsorLogo";
import { PGA_GOLF_SHOW, ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Free Shot at ${PGA_GOLF_SHOW.prize} — ${PGA_GOLF_SHOW.name}`,
  description: `Enter your name and number for a free simulator hole-in-one shot at ${PGA_GOLF_SHOW.prize} at the ${PGA_GOLF_SHOW.name}, ${PGA_GOLF_SHOW.dates}.`,
  robots: { index: false, follow: false },
};

/**
 * /pga-golf-show — free simulator entry at the PGA Golf & Lifestyle Show.
 *
 * Same bones as /form (no global nav, a phone scanning the QR at the stand
 * lands straight in the form) but dressed in the show's identity rather than
 * ours: navy and green on cream, the show's lockup first, the challenge
 * lockup beside it. Indwe sits directly above the form as headline sponsor,
 * small, and the co-sponsors under it.
 * `.pga-theme` (globals.css) re-colours the shared form primitives.
 */
export default function PgaGolfShowPage() {
  return (
    <main className="pga-theme min-h-screen bg-cream text-green">
      {/* Navy masthead with the show's green rule */}
      <div className="bg-green-dark border-b-4 border-green">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3 text-white">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
            {PGA_GOLF_SHOW.name}
          </p>
          <p className="eyebrow eyebrow--dark whitespace-nowrap">
            {PGA_GOLF_SHOW.dates}
          </p>
        </div>
      </div>

      {/* Co-brand lockup: the show and the challenge */}
      <div className="max-w-md mx-auto px-4 pt-7 sm:pt-10">
        <div className="flex items-center justify-center gap-5 sm:gap-7">
          <SponsorLogo
            name={PGA_GOLF_SHOW.showLogo.name}
            file={PGA_GOLF_SHOW.showLogo.file}
            height={88}
            wordmarkClassName="text-2xl text-green-dark"
          />
          <div className="h-16 w-px bg-green-dark/25" aria-hidden />
          <Image
            src="/brand/logo-lockup.svg"
            alt="Get Lucky Hole-in-One Challenge"
          width={552}
          height={588}
          unoptimized
            className="h-20 sm:h-24 w-auto flex-shrink-0"
            priority
          />
        </div>
      </div>

      {/* Headline */}
      <div className="max-w-md mx-auto px-4 pt-7 pb-8">
        <div className="text-center mb-6">
          <span className="eyebrow">
            Simulator Hole-in-One · Free Entry
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl text-green uppercase mt-2">
            One Shot at {PGA_GOLF_SHOW.prize}
          </h1>
          <p className="text-sm sm:text-base text-green/75 mt-3 leading-relaxed">
            Your name and your number, and a follow on Instagram if you have it.
          </p>
        </div>

        {/* Indwe — headline sponsor, kept small and above the form so it is
            seen before the golfer reads the WhatsApp offer that names it. */}
        <div className="card mb-4 rounded-xl bg-white px-6 py-5 sm:py-6 flex justify-center card--hover">
          <Image
            src="/images/indwe-sponsor-banner.png"
            alt="Proudly Sponsored by Indwe Risk Services — Authorised Financial Services Provider FSP 3425"
            width={1920}
            height={292}
            className="w-full max-w-[360px] h-auto"
            priority
          />
        </div>

        <div className="card bg-white shadow-green-dark/10 border-t-4 border-green p-5 sm:p-7 rounded-xl card--hover">
          <PgaGolfShowEntryForm />
        </div>

        {/* Co-sponsors */}
        <div className="card mt-6 bg-white px-5 py-5 rounded-xl card--hover">
          <p className="eyebrow text-center">
            In partnership with
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
            {PGA_GOLF_SHOW.sponsors.map((s) => (
              <li key={s.name} className="flex items-center">
                <SponsorLogo
                  name={s.name}
                  file={s.file}
                  height={s.name === "Move Golf" ? 38 : s.name === "Badi Golf" ? 30 : 24}
                  wordmarkClassName="text-xl text-green-dark"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="max-w-md mx-auto px-4 pb-10 text-center text-[11px] text-green/60 space-x-3">
        <span>&copy; {new Date().getFullYear()} Get Lucky Golf Club (Pty) Ltd</span>
        <Link href={ROUTES.terms} className="underline hover:text-green">Terms</Link>
        <Link href={ROUTES.privacy} className="underline hover:text-green">Privacy</Link>
      </footer>
    </main>
  );
}
