import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions & POPIA Privacy Notice",
  description:
    "Terms and conditions, rules of play, prize fulfilment and POPIA privacy notice for the Get Lucky Hole-in-One Challenge.",
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
              Terms &amp; Conditions &amp; POPIA Privacy Notice
            </h1>

            <div className="prose prose-lg max-w-none text-charcoal-light/85 space-y-6">
              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  1. Definitions
                </h2>
                <p>
                  &ldquo;We&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo; or
                  &ldquo;Get Lucky Golf Club&rdquo; refers to the operator of
                  this website and the Hole-in-One Challenge.
                </p>
                <p>
                  &ldquo;You&rdquo;, &ldquo;your&rdquo; or
                  &ldquo;Participant&rdquo; means the person entering the
                  challenge.
                </p>
                <p>
                  &ldquo;Personal Information&rdquo; means any information
                  relating to an identifiable person, including name, contact
                  details, ID number, payment details, photographic/video
                  footage, email address, etc.
                </p>
                <p>
                  &ldquo;POPIA&rdquo; refers to the Protection of Personal
                  Information Act, 4 of 2013 (South Africa).
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  2. Rules of Play
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Only one entry per player per round.</li>
                  <li>Entry and payment must be completed before teeing off.</li>
                  <li>
                    If only 1&ndash;3 players in the fourball enter, the
                    participating players must tee off first.
                  </li>
                  <li>
                    You must play from the same colour tee box used during the
                    round.
                  </li>
                  <li>The hole-in-one must adhere to USGA rules of play.</li>
                  <li>
                    Report the hole-in-one within 24 hours via the contact
                    number provided.
                  </li>
                  <li>No under 18s allowed.</li>
                  <li>
                    No registered PGA or club professionals may enter.
                  </li>
                  <li>
                    The prize money will be paid out only if all procedures are
                    followed and verified by camera footage.
                  </li>
                  <li>
                    If inconsistencies arise in the footage or verification, we
                    reserve the right to refuse payment.
                  </li>
                  <li>
                    Verified prize money will be paid within 15 working days.
                  </li>
                  <li>
                    By entering and paying, you accept all Terms &amp;
                    Conditions and these Rules of Play.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  3. Acceptance of Terms
                </h2>
                <p>
                  By entering the challenge (including scanning QR code and
                  making payment), you confirm that you have read, understood,
                  and accepted these Terms &amp; Conditions, including the
                  POPIA Privacy Notice.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  4. Collection, Use and Processing of Personal Information
                </h2>

                <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide mt-4">
                  4.1 Lawful Basis
                </h3>
                <p>
                  We process Personal Information on the basis of consent,
                  performance of contract, legal obligations, and legitimate
                  interests (e.g. fraud prevention, verification).
                </p>

                <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide mt-4">
                  4.2 Information Collected
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name</li>
                  <li>Contact details (phone, email)</li>
                  <li>Identity number (if required for prize payment or tax)</li>
                  <li>Payment details (via secure third-party processor)</li>
                  <li>Photographic and/or video footage for verification</li>
                  <li>
                    Other information reasonably required to validate
                    participation
                  </li>
                </ul>

                <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide mt-4">
                  4.3 Purpose of Processing
                </h3>
                <p>Your Personal Information may be used for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Validating entries and verifying hole-in-one attempts
                  </li>
                  <li>Contacting you about your entry or prize</li>
                  <li>Processing and paying prize money</li>
                  <li>Fraud detection and compliance</li>
                  <li>
                    Accounting, record-keeping, audit, and legal obligations
                  </li>
                  <li>Internal analysis (aggregated/anonymised)</li>
                  <li>
                    Marketing and Promotions &mdash; We may use your contact
                    details to send you information about Get Lucky events,
                    promotions, and offers, as well as those of our official
                    sponsors and partners.
                  </li>
                </ul>

                <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide mt-4">
                  4.4 Disclosure to Third Parties
                </h3>
                <p>We may share your Personal Information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment processors and financial institutions</li>
                  <li>Auditors and legal advisors</li>
                  <li>Regulatory authorities if required by law</li>
                  <li>Service providers assisting with operations</li>
                  <li>
                    Official sponsors and partners, who may contact you
                    directly with marketing related to their products,
                    services, promotions, or events. Such partners are
                    contractually bound to comply with POPIA and may only use
                    your information for agreed purposes.
                  </li>
                </ul>

                <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide mt-4">
                  4.5 Retention
                </h3>
                <p>
                  We retain Personal Information only as long as necessary for
                  its purposes or to meet legal obligations, after which it
                  will be securely deleted or anonymised.
                </p>

                <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide mt-4">
                  4.6 Security
                </h3>
                <p>
                  We implement reasonable technical and organisational measures
                  to protect your Personal Information against loss, theft, or
                  unauthorised access.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  5. Your Rights Under POPIA
                </h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Request access to the Personal Information we hold about
                    you.
                  </li>
                  <li>
                    Request correction or deletion of inaccurate or outdated
                    information.
                  </li>
                  <li>
                    Object to or restrict processing in certain cases.
                  </li>
                  <li>
                    Withdraw consent at any time (this may limit your
                    participation).
                  </li>
                  <li>
                    Opt out of marketing at any time by following unsubscribe
                    instructions or contacting us directly.
                  </li>
                  <li>
                    Lodge a complaint with the Information Regulator of South
                    Africa.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  6. Disclaimer, Liability &amp; Indemnity
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    The Hole-in-One Challenge is provided on an &ldquo;as
                    is&rdquo; basis.
                  </li>
                  <li>
                    We are not liable for any indirect, incidental, or
                    consequential damages except as required by law.
                  </li>
                  <li>
                    You agree to indemnify and hold us harmless against claims
                    arising from your participation or breach of these Terms.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  7. Governing Law &amp; Jurisdiction
                </h2>
                <p>
                  These Terms are governed by the laws of South Africa.
                  Disputes shall fall under the exclusive jurisdiction of
                  South African courts.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  8. Amendments
                </h2>
                <p>
                  We may update these Terms &amp; Conditions and POPIA Notice
                  from time to time. Updates will be published on our website
                  and your continued participation will constitute acceptance.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl text-green-dark uppercase tracking-wide">
                  9. Contact Us
                </h2>
                <p>
                  For questions, data access, corrections, opt-outs, or
                  complaints, contact us at:{" "}
                  <a
                    href="mailto:sales@getluckygolfclub.com"
                    className="text-green-dark underline hover:text-gold"
                  >
                    sales@getluckygolfclub.com
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
