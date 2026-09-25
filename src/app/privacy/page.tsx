import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Get Lucky Golf Club collects, uses and protects your personal information under POPIA.",
  alternates: { canonical: "/privacy" },
};

/* Long-form legal type: Inter throughout, ink headings, muted body. */
const H2 = "text-[19px] sm:text-[21px] font-semibold tracking-[-0.015em] text-ink leading-snug";
const P = "mt-4 text-[15px] leading-relaxed text-muted";
const SECTION = "py-10 first:pt-0";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <header className="bg-paper border-b border-line pt-32 sm:pt-40 pb-12 sm:pb-16">
          <div className="wrap">
            <span className="kicker">Legal</span>
            <h1 className="display-lg text-ink mt-4">Privacy Policy</h1>
            <p className="lede mt-5 max-w-2xl">
              How Get Lucky Golf Club collects, uses and protects your personal
              information under POPIA.
            </p>
          </div>
        </header>

        <div className="bg-white">
          <div className="wrap py-14 sm:py-20">
            <article className="max-w-[720px] divide-y divide-line">
              <section className={SECTION}>
                <h2 className={H2}>Information We Collect</h2>
                <p className={P}>
                  When you submit a form or buy a voucher, we collect your name,
                  email address, mobile number, course of play, and (for voucher
                  purchases) payment details handled directly by PayFast.
                </p>
              </section>

              <section className={SECTION}>
                <h2 className={H2}>How We Use It</h2>
                <p className={P}>
                  To process your enquiry or voucher purchase, deliver your voucher
                  email, verify hole-in-one prizes with our insurer, and — if you
                  consented — to send occasional updates about the Challenge.
                </p>
              </section>

              <section className={SECTION}>
                <h2 className={H2}>Who We Share It With</h2>
                <p className={P}>
                  Indwe Risk Services (FSP 3425) for prize verification and
                  insurance fulfilment. Partner courses you select, for redemption.
                  Sponsors of specific activations may receive entry-level data
                  related to their event. PayFast for payment processing. We do not
                  sell or rent your data to anyone.
                </p>
              </section>

              <section className={SECTION}>
                <h2 className={H2}>Your Rights Under POPIA</h2>
                <p className={P}>
                  You can request access to, correction of, or deletion of your
                  personal information at any time by emailing{" "}
                  <a
                    href="mailto:johannes@getluckygolfclub.com"
                    className="font-medium text-green underline decoration-green/30 underline-offset-4 hover:decoration-green"
                  >
                    johannes@getluckygolfclub.com
                  </a>
                  .
                </p>
              </section>

              <section className="pt-8">
                <p className="text-[13px] leading-relaxed text-muted/80">
                  This is a placeholder privacy policy pending final legal review.
                </p>
              </section>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
