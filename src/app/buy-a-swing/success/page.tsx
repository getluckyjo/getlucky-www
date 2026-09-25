import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IndweBannerStrip from "@/components/IndweBannerStrip";
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
      <main>
        <section className="bg-paper pt-32 sm:pt-40 pb-20 sm:pb-28">
          <div className="wrap">
            <div className="card max-w-xl mx-auto px-6 py-10 sm:p-12 text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green text-white ring-8 ring-green/10">
                <Check className="w-7 h-7" strokeWidth={3} aria-hidden />
              </span>
              <h1 className="display-md text-ink mt-7">Payment received</h1>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">
                Your swing voucher is on its way. Look out for a confirmation email
                within the next few minutes.
              </p>
              {ref && (
                <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full bg-paper border border-line px-4 py-2 text-[13px] text-muted">
                  Reference:
                  <span className="font-mono text-green font-semibold break-all">{ref}</span>
                </p>
              )}
              <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Link href={ROUTES.home} className="btn-lime">
                  Back to home
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href={ROUTES.buyVoucher} className="btn-outline">
                  Buy another
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Indwe sponsor banner */}
        <IndweBannerStrip src="/indwe-banner/index.html" />
      </main>
      <Footer />
    </>
  );
}
