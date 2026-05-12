import type { Metadata } from "next";
import { Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoucherForm from "@/components/forms/VoucherForm";

export const metadata: Metadata = {
  title: "Buy a Swing — Win up to R1,000,000",
  description:
    "Buy a swing voucher from R50, play the signature par-3 at any of our partner courses, and walk away with up to R1,000,000 if you sink a hole-in-one. Insured by Indwe Risk Services.",
  alternates: { canonical: "/buy-a-swing" },
};

export default function BuyASwingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <section className="bg-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                The Challenge
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-green-dark mt-4 uppercase tracking-wide">
                Buy Your Swing
              </h1>
              <p className="text-base sm:text-lg text-charcoal-light/80 mt-5 leading-relaxed">
                One swing. The bigger your entry, the bigger your prize. From
                R50 to play for R25,000 — all the way to R1,000 to play for
                R1,000,000. Redeem at any partner course on your next round.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-green-dark/10 p-6 sm:p-10">
              <VoucherForm />
            </div>

            <div className="mt-10 flex items-center justify-center gap-3 text-charcoal-light/70">
              <Shield className="w-4 h-4" />
              <p className="text-sm">
                All prizes fully insured by{" "}
                <span className="text-green-dark font-medium">Indwe Risk Services</span>{" "}
                — FSP 3425. Secure payment by PayFast.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
