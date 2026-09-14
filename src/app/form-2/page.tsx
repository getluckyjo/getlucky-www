import type { Metadata } from "next";
import Image from "next/image";
import FreeEntryForm from "@/components/forms/FreeEntryForm";

export const metadata: Metadata = {
  title: "Sponsored Entry",
  description: "Free entry to the Get Lucky Hole-in-One Challenge for sponsored events.",
  robots: { index: false, follow: false },
};

/**
 * /form-2 — free entry capture for sponsored / corporate days.
 * No payment, just contact details. Distinct from /form (paid).
 */
export default function Form2Page() {
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
          <span className="text-gold text-xs font-semibold uppercase tracking-widest drop-shadow">
            Sponsored Entry
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl text-cream uppercase tracking-wide mt-2 drop-shadow-md">
            Enter the Challenge
          </h1>
          <p className="text-sm text-cream/85 mt-2 leading-relaxed drop-shadow">
            Your entry is sponsored. Drop your details and you&apos;re in.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-white/40 p-5 sm:p-7">
          <FreeEntryForm />
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
