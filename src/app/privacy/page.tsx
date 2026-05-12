import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Get Lucky Golf Club collects, uses and protects your personal information under POPIA.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <section className="bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">
              Legal
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl text-green-dark uppercase tracking-wide mt-4 mb-8">
              Privacy Policy
            </h1>

            <div className="prose prose-lg max-w-none text-charcoal-light/85 space-y-6">
              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  Information We Collect
                </h2>
                <p>
                  When you submit a form or buy a voucher, we collect your name,
                  email address, mobile number, course of play, and (for voucher
                  purchases) payment details handled directly by PayFast.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  How We Use It
                </h2>
                <p>
                  To process your enquiry or voucher purchase, deliver your voucher
                  email, verify hole-in-one prizes with our insurer, and — if you
                  consented — to send occasional updates about the Challenge.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  Who We Share It With
                </h2>
                <p>
                  Indwe Risk Services (FSP 3425) for prize verification and
                  insurance fulfilment. Partner courses you select, for redemption.
                  Sponsors of specific activations may receive entry-level data
                  related to their event. PayFast for payment processing. We do not
                  sell or rent your data to anyone.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  Your Rights Under POPIA
                </h2>
                <p>
                  You can request access to, correction of, or deletion of your
                  personal information at any time by emailing{" "}
                  <a
                    href="mailto:johannes@getluckygolfclub.com"
                    className="text-green-dark underline hover:text-gold"
                  >
                    johannes@getluckygolfclub.com
                  </a>
                  .
                </p>
              </section>

              <p className="text-sm text-charcoal-light/60 pt-8 border-t border-green-dark/10">
                This is a placeholder privacy policy pending final legal review.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
