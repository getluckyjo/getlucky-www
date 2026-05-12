import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Swing Voucher Confirmed",
  robots: { index: false, follow: false },
};

export default async function VoucherSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const ref = params.ref || "";

  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <section className="bg-cream min-h-[60vh]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-green text-cream mx-auto flex items-center justify-center mb-6">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="w-8 h-8"
                aria-hidden
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl text-green-dark uppercase tracking-wide mb-4">
              Payment Received
            </h1>
            <p className="text-base sm:text-lg text-charcoal-light/80 leading-relaxed mb-2">
              Your swing voucher is on its way. Look out for a confirmation email
              within the next few minutes.
            </p>
            {ref && (
              <p className="text-sm text-charcoal-light/60 mt-4">
                Reference:{" "}
                <span className="font-mono text-green-dark font-semibold">{ref}</span>
              </p>
            )}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={ROUTES.home}
                className="bg-green hover:bg-green-light text-cream font-semibold text-base px-8 py-3.5 rounded-full transition-all hover:scale-105"
              >
                Back to Home
              </Link>
              <Link
                href={ROUTES.buyVoucher}
                className="border border-green-dark/20 text-green-dark hover:bg-green-dark/5 font-semibold text-base px-8 py-3.5 rounded-full transition-all"
              >
                Buy Another
              </Link>
            </div>

            {/* Indwe sponsor banner */}
            <div className="mt-12 sm:mt-16">
              <div className="rounded-xl overflow-hidden border border-green-dark/10 shadow-sm bg-white">
                <iframe
                  src="/indwe-banner/index.html"
                  title="Indwe Risk Services — Headline Sponsor"
                  loading="lazy"
                  className="w-full block border-0"
                  style={{ aspectRatio: "1600 / 333", minHeight: "170px" }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
