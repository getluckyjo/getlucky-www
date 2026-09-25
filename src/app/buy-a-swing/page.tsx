import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoucherForm from "@/components/forms/VoucherForm";

export const metadata: Metadata = {
  title: "Buy a Swing — Win up to R1,000,000",
  description:
    "Buy a swing voucher from R50, play the signature par-3 at any of our partner courses, and walk away with up to R1,000,000 if you sink a hole-in-one. Insured by Indwe Risk Services.",
  alternates: { canonical: "/buy-a-swing" },
  // Swings are sold at the tee box through the QR form; this page is no
  // longer linked from the site and stays only for old links and the
  // /buyswingvoucher redirect.
  robots: { index: false, follow: false },
};

export default function BuyASwingPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-paper pt-32 sm:pt-40 pb-[clamp(72px,9vw,112px)]">
          <div className="wrap wrap--narrow">
            <div className="text-center max-w-2xl mx-auto">
              <span className="kicker">The challenge</span>
              <h1 className="display-lg text-ink mt-4">Buy your swing</h1>
              <p className="lede mt-5">
                One swing. The bigger your entry, the bigger your prize. From
                R50 to play for R25,000 — all the way to R1,000 to play for
                R1,000,000. Redeem at any partner course on your next round.
              </p>
            </div>

            <div className="card mt-10 sm:mt-12 p-5 sm:p-10">
              <VoucherForm />
            </div>

            <p className="mt-8 flex items-start sm:items-center justify-center gap-2.5 text-[14px] leading-relaxed text-muted text-left sm:text-center">
              <ShieldCheck className="w-4 h-4 text-green shrink-0 mt-0.5 sm:mt-0" />
              <span>
                All prizes fully insured by{" "}
                <span className="text-ink font-medium">Indwe Risk Services</span>{" "}
                — FSP 3425. Secure payment by PayFast.
              </span>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
