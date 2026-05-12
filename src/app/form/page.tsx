import type { Metadata } from "next";
import Image from "next/image";
import EntryForm from "@/components/forms/EntryForm";

export const metadata: Metadata = {
  title: "Enter the Challenge",
  description:
    "Take the Get Lucky Hole-in-One Challenge — pay your entry, sink your shot, win up to R1,000,000.",
  robots: { index: false, follow: false },
};

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

      {/* Challenge lockup hero */}
      <div className="flex justify-center pt-8 sm:pt-12 pb-2 px-4">
        <Image
          src="/logos/challenge-bordered.png"
          alt="Get Lucky Hole-in-One Challenge"
          width={420}
          height={420}
          className="h-40 sm:h-48 w-auto drop-shadow-xl"
          priority
        />
      </div>

      {/* Form panel */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="text-center mb-6">
          <h1 className="font-heading text-3xl sm:text-4xl text-cream uppercase tracking-wide drop-shadow-md">
            Swing it to Win it
          </h1>
          <p className="text-sm sm:text-base text-cream/85 mt-3 leading-relaxed drop-shadow">
            It&apos;s only a matter of time until your hole in one.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-white/40 p-5 sm:p-7">
          <EntryForm />
        </div>
      </div>

      {/* Indwe sponsor banner — stacked on mobile, wide on desktop */}
      <div className="max-w-md mx-auto px-4 pb-8 sm:pb-12">
        <div className="rounded-xl overflow-hidden border border-white/30 shadow-2xl bg-white">
          {/* Mobile: stacked logo */}
          <div className="sm:hidden flex justify-center p-6">
            <Image
              src="/logos/indwe-stacked.png"
              alt="Proudly Sponsored by Indwe Risk Services"
              width={600}
              height={400}
              className="w-auto h-auto max-w-[240px]"
            />
          </div>
          {/* Desktop: wide banner */}
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
