import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions, rules of play, prize fulfilment and POPIA compliance for the Get Lucky Hole-in-One Challenge.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
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
              Terms &amp; Conditions
            </h1>

            <div className="prose prose-lg max-w-none text-charcoal-light/85 space-y-6">
              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  1. The Challenge
                </h2>
                <p>
                  The Get Lucky Hole-in-One Challenge (&quot;the Challenge&quot;) is operated by
                  Get Lucky Golf Club. By purchasing a Swing Voucher, you agree to
                  these terms.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  2. Eligibility
                </h2>
                <p>
                  Participants must be 18 years or older. Vouchers are non-refundable
                  but may be transferred prior to use. Participation is subject to
                  the rules of play at each partner course.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  3. Prizes &amp; Insurance
                </h2>
                <p>
                  All prizes are fully insured by Indwe Risk Services (FSP 3425).
                  Prize fulfilment is subject to verification of the hole-in-one in
                  accordance with the rules of play and the terms of the underlying
                  insurance policy. Witness verification is required.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  4. POPIA &amp; Privacy
                </h2>
                <p>
                  We collect personal information necessary to deliver the Challenge —
                  name, contact details, course of play, payment information. We
                  process this in accordance with the Protection of Personal
                  Information Act (POPIA). See our privacy policy for details.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  5. Liability
                </h2>
                <p>
                  Get Lucky Golf Club&apos;s liability is limited to the value of the
                  voucher purchased. Partner courses, sponsors and Indwe Risk
                  Services are not liable for any indirect, incidental or
                  consequential loss arising from participation.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  6. Contact
                </h2>
                <p>
                  Questions? Email{" "}
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
                These terms are a placeholder summary pending the full legal review
                migrated from the previous site. They will be replaced with the
                final, legal-team-approved version.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
