import type { Metadata } from "next";
import Link from "next/link";
import { Mail, RotateCcw, X } from "lucide-react";
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
      <main>
        <section className="bg-paper pt-32 sm:pt-40 pb-20 sm:pb-28 min-h-[70vh]">
          <div className="wrap">
            <div className="card max-w-xl mx-auto px-6 py-10 sm:p-12 text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-surface text-ink/60 ring-8 ring-surface/50">
                <X className="w-7 h-7" strokeWidth={2.5} aria-hidden />
              </span>
              <h1 className="display-md text-ink mt-7">Payment cancelled</h1>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">
                No charge has been made. You can try again any time.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Link href={ROUTES.buyVoucher} className="btn-lime">
                  <RotateCcw className="w-4 h-4" />
                  Try again
                </Link>
                <a href={`mailto:${SITE.email}`} className="btn-outline">
                  <Mail className="w-4 h-4" />
                  Need help?
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
