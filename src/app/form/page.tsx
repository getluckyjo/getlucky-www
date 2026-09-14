import type { Metadata } from "next";
import Image from "next/image";
import EntryForm from "@/components/forms/EntryForm";
import JackpotTicker from "@/components/JackpotTicker";

export const metadata: Metadata = {
  title: "Enter the Challenge",
  description:
    "Take the Get Lucky Hole-in-One Challenge — pay your entry, sink your shot, win up to R1,000,000.",
  robots: { index: false, follow: false },
};

/** Where the hero's sparkles sit and when each twinkles, as inline style. */
const SPARKLES: React.CSSProperties[] = [
  { top: "8%", left: "12%", animationDelay: "0s", fontSize: "14px" },
  { top: "18%", right: "10%", animationDelay: "0.7s", fontSize: "18px" },
  { top: "46%", left: "6%", animationDelay: "1.4s", fontSize: "10px" },
  { top: "40%", right: "18%", animationDelay: "2.1s", fontSize: "12px" },
  { top: "70%", left: "16%", animationDelay: "0.35s", fontSize: "16px" },
  { top: "76%", right: "8%", animationDelay: "1.75s", fontSize: "11px" },
];

/**
 * /form — in-person/QR-code paid entry, used at the golf course.
 * Distinct from /buy-a-swing which is the public-website purchase flow.
 * No global nav so a phone scanning the QR gets straight into the form.
 */
export default function FormPage() {
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
        {/* Top-to-bottom gradient: darker at top behind logo, lighter mid for the form card,
            darker again at bottom behind the Indwe banner. */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-dark/85 via-green-dark/65 to-green-dark/90" />
      </div>

      {/* Challenge lockup hero — dressed as a casino floor: light rays turning
          behind the lockup, a bulb-lit marquee around the headline, metallic
          gold lettering with a moving glint, a few twinkling sparkles and a
          jackpot readout that rolls up to the top prize. All of it is CSS in
          globals.css under the casino-* classes, and all motion stops under
          prefers-reduced-motion. */}
      <div className="casino-hero relative flex flex-col items-center pt-8 sm:pt-12 pb-6 px-4 text-center overflow-hidden">
        <div className="casino-rays" aria-hidden />
        {SPARKLES.map((st, i) => (
          <span key={i} className="casino-sparkle" style={st} aria-hidden>
            ✦
          </span>
        ))}

        <Image
          src="/logos/challenge-bordered.png"
          alt="Get Lucky Hole-in-One Challenge"
          width={420}
          height={420}
          className="relative h-40 sm:h-48 w-auto drop-shadow-xl"
          priority
        />

        <div className="casino-marquee relative mt-5">
          <h1 className="casino-gold-text font-heading text-3xl sm:text-4xl uppercase tracking-wide">
            Swing it to Win it
          </h1>
        </div>

        <p className="relative text-sm sm:text-base text-cream/85 mt-4 leading-relaxed drop-shadow max-w-sm">
          It&apos;s only a matter of time until your hole in one.
        </p>

        <JackpotTicker />
      </div>

      {/* Form panel */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-white/40 p-5 sm:p-7">
          <EntryForm />
        </div>
      </div>

      {/* Indwe sponsor banner — the animated strip at every width. It used
          to fall back to a static stacked logo on phones; the banner's type
          scales with its own viewport, and the 170px floor gives its three
          slides room on a narrow screen. */}
      <div className="max-w-md mx-auto px-4 pb-8 sm:pb-12">
        <div className="rounded-xl overflow-hidden border border-white/30 shadow-2xl bg-white">
          <iframe
            src="/indwe-banner/index.html"
            title="Indwe Risk Services — Headline Sponsor"
            loading="lazy"
            className="block w-full border-0"
            style={{ aspectRatio: "1600 / 333", minHeight: "170px" }}
          />
        </div>
      </div>
    </main>
  );
}
