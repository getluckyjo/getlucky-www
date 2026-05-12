import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ROUTES, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  robots: { index: false, follow: false },
};

export default function VoucherCancelPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <section className="bg-cream min-h-[60vh]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <h1 className="font-heading text-4xl sm:text-5xl text-green-dark uppercase tracking-wide mb-4">
              Payment Cancelled
            </h1>
            <p className="text-base sm:text-lg text-charcoal-light/80 leading-relaxed mb-2">
              No charge has been made. You can try again any time.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={ROUTES.buyVoucher}
                className="bg-green hover:bg-green-light text-cream font-semibold text-base px-8 py-3.5 rounded-full transition-all hover:scale-105"
              >
                Try Again
              </Link>
              <a
                href={`mailto:${SITE.email}`}
                className="border border-green-dark/20 text-green-dark hover:bg-green-dark/5 font-semibold text-base px-8 py-3.5 rounded-full transition-all"
              >
                Need Help?
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
