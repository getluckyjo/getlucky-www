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
 * lockup beside it. The co-sponsors sit under the form and Indwe closes the
 * page as headline sponsor, the same banner as the course forms.
 * `.pga-theme` (globals.css) re-colours the shared form primitives.
 */
export default function PgaGolfShowPage() {
  return (
    <main className="pga-theme min-h-screen bg-cream text-green-dark">
      {/* Navy masthead with the show's green rule */}
      <div className="bg-green-dark border-b-4 border-green">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3 text-cream">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
            {PGA_GOLF_SHOW.name}
          </p>
          <p className="text-[11px] sm:text-xs uppercase tracking-widest text-cream/80 whitespace-nowrap">
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
            src="/logos/challenge-bordered.png"
            alt="Get Lucky Hole-in-One Challenge"
            width={420}
            height={420}
            className="h-20 sm:h-24 w-auto flex-shrink-0"
            priority
          />
        </div>
      </div>

      {/* Headline */}
      <div className="max-w-md mx-auto px-4 pt-7 pb-8">
        <div className="text-center mb-6">
          <span className="text-green text-xs font-semibold uppercase tracking-widest">
            Simulator Hole-in-One · Free Entry
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl text-green-dark uppercase tracking-wide mt-2">
            One Shot at {PGA_GOLF_SHOW.prize}
          </h1>
          <p className="text-sm sm:text-base text-green-dark/75 mt-3 leading-relaxed">
            Your name, your number, and a follow on Instagram. Then find the Get Lucky stand and
            swing.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-green-dark/10 border-t-4 border-green p-5 sm:p-7">
          <PgaGolfShowEntryForm />
        </div>

        {/* Co-sponsors */}
        <div className="mt-6 rounded-2xl bg-white border border-green-dark/10 px-5 py-5">
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-green-dark/60">
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

      {/* Indwe — headline sponsor. Stacked on mobile, wide on desktop. */}
      <div className="max-w-md mx-auto px-4 pb-6">
        <div className="rounded-xl overflow-hidden border border-green-dark/10 shadow-lg shadow-green-dark/10 bg-white">
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

      <footer className="max-w-md mx-auto px-4 pb-10 text-center text-[11px] text-green-dark/60 space-x-3">
        <span>&copy; {new Date().getFullYear()} Get Lucky Golf Club (Pty) Ltd</span>
        <Link href={ROUTES.terms} className="underline hover:text-green">Terms</Link>
        <Link href={ROUTES.privacy} className="underline hover:text-green">Privacy</Link>
      </footer>
    </main>
  );
}
