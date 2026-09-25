import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions & POPIA Privacy Notice",
  description:
    "Terms and conditions, rules of play, prize fulfilment and POPIA privacy notice for the Get Lucky Hole-in-One Challenge.",
  alternates: { canonical: "/terms" },
};

/* Long-form legal type: Inter throughout, ink headings, muted body. */
const H2 = "text-[19px] sm:text-[21px] font-semibold tracking-[-0.015em] text-ink leading-snug";
const H3 = "mt-8 text-[15px] font-semibold text-ink";
const P = "mt-4 text-[15px] leading-relaxed text-muted";
const UL = "mt-4 space-y-2.5 pl-5 list-disc marker:text-green/50 text-[15px] leading-relaxed text-muted";
const SECTION = "py-10 first:pt-0 last:pb-0";

const TOC = [
  { id: "definitions", n: "1", label: "Definitions" },
  { id: "rules-of-play", n: "2", label: "Rules of Play" },
  { id: "acceptance", n: "3", label: "Acceptance of Terms" },
  { id: "personal-information", n: "4", label: "Collection, Use and Processing of Personal Information" },
  { id: "your-rights", n: "5", label: "Your Rights Under POPIA" },
  { id: "liability", n: "6", label: "Disclaimer, Liability & Indemnity" },
  { id: "governing-law", n: "7", label: "Governing Law & Jurisdiction" },
  { id: "amendments", n: "8", label: "Amendments" },
  { id: "contact-us", n: "9", label: "Contact Us" },
];

function Num({ n }: { n: string }) {
  return <span className="text-green tabular-nums mr-2.5">{n}.</span>;
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        <header className="bg-paper border-b border-line pt-32 sm:pt-40 pb-12 sm:pb-16">
          <div className="wrap">
            <span className="kicker">Legal</span>
            <h1 className="display-lg text-ink mt-4 max-w-4xl">
              Terms &amp; Conditions &amp; POPIA Privacy Notice
            </h1>
            <p className="lede mt-5 max-w-2xl">
              Rules of play, prize fulfilment and the POPIA privacy notice for
              the Get Lucky Hole-in-One Challenge.
            </p>
          </div>
        </header>

        <div className="bg-white">
          <div className="wrap py-14 sm:py-20 grid lg:grid-cols-[240px_minmax(0,720px)] gap-12 lg:gap-20">
            {/* On this page */}
            <nav aria-label="On this page" className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                  On this page
                </p>
                <ol className="mt-4 space-y-1 border-l border-line">
                  {TOC.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="-ml-px flex gap-2.5 border-l border-transparent py-1.5 pl-4 text-[13px] leading-snug text-muted transition-colors hover:border-green hover:text-ink"
                      >
                        <span className="tabular-nums text-ink/35">{item.n}</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            <article className="divide-y divide-line">
              <section id="definitions" className={SECTION}>
                <h2 className={H2}>
                  <Num n="1" />Definitions
                </h2>
                <p className={P}>
                  &ldquo;We&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo; or
                  &ldquo;Get Lucky Golf Club&rdquo; refers to the operator of
                  this website and the Hole-in-One Challenge.
                </p>
                <p className={P}>
                  &ldquo;You&rdquo;, &ldquo;your&rdquo; or
                  &ldquo;Participant&rdquo; means the person entering the
                  challenge.
                </p>
                <p className={P}>
                  &ldquo;Personal Information&rdquo; means any information
                  relating to an identifiable person, including name, contact
                  details, ID number, payment details, photographic/video
                  footage, email address, etc.
                </p>
                <p className={P}>
                  &ldquo;POPIA&rdquo; refers to the Protection of Personal
                  Information Act, 4 of 2013 (South Africa).
                </p>
              </section>

              <section id="rules-of-play" className={SECTION}>
                <h2 className={H2}>
                  <Num n="2" />Rules of Play
                </h2>
                <ul className={UL}>
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

              <section id="acceptance" className={SECTION}>
                <h2 className={H2}>
                  <Num n="3" />Acceptance of Terms
                </h2>
                <p className={P}>
                  By entering the challenge (including scanning QR code and
                  making payment), you confirm that you have read, understood,
                  and accepted these Terms &amp; Conditions, including the
                  POPIA Privacy Notice.
                </p>
              </section>

              <section id="personal-information" className={SECTION}>
                <h2 className={H2}>
                  <Num n="4" />Collection, Use and Processing of Personal Information
                </h2>

                <h3 className={H3}>4.1 Lawful Basis</h3>
                <p className={P}>
                  We process Personal Information on the basis of consent,
                  performance of contract, legal obligations, and legitimate
                  interests (e.g. fraud prevention, verification).
                </p>

                <h3 className={H3}>4.2 Information Collected</h3>
                <ul className={UL}>
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

                <h3 className={H3}>4.3 Purpose of Processing</h3>
                <p className={P}>Your Personal Information may be used for:</p>
                <ul className={UL}>
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

                <h3 className={H3}>4.4 Disclosure to Third Parties</h3>
                <p className={P}>We may share your Personal Information with:</p>
                <ul className={UL}>
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

                <h3 className={H3}>4.5 Retention</h3>
                <p className={P}>
                  We retain Personal Information only as long as necessary for
                  its purposes or to meet legal obligations, after which it
                  will be securely deleted or anonymised.
                </p>

                <h3 className={H3}>4.6 Security</h3>
                <p className={P}>
                  We implement reasonable technical and organisational measures
                  to protect your Personal Information against loss, theft, or
                  unauthorised access.
                </p>
              </section>

              <section id="your-rights" className={SECTION}>
                <h2 className={H2}>
                  <Num n="5" />Your Rights Under POPIA
                </h2>
                <p className={P}>You have the right to:</p>
                <ul className={UL}>
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

              <section id="liability" className={SECTION}>
                <h2 className={H2}>
                  <Num n="6" />Disclaimer, Liability &amp; Indemnity
                </h2>
                <ul className={UL}>
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

              <section id="governing-law" className={SECTION}>
                <h2 className={H2}>
                  <Num n="7" />Governing Law &amp; Jurisdiction
                </h2>
                <p className={P}>
                  These Terms are governed by the laws of South Africa.
                  Disputes shall fall under the exclusive jurisdiction of
                  South African courts.
                </p>
              </section>

              <section id="amendments" className={SECTION}>
                <h2 className={H2}>
                  <Num n="8" />Amendments
                </h2>
                <p className={P}>
                  We may update these Terms &amp; Conditions and POPIA Notice
                  from time to time. Updates will be published on our website
                  and your continued participation will constitute acceptance.
                </p>
              </section>

              <section id="contact-us" className={SECTION}>
                <h2 className={H2}>
                  <Num n="9" />Contact Us
                </h2>
                <p className={P}>
                  For questions, data access, corrections, opt-outs, or
                  complaints, contact us at:{" "}
                  <a
                    href="mailto:sales@getluckygolfclub.com"
                    className="font-medium text-green underline decoration-green/30 underline-offset-4 hover:decoration-green"
                  >
                    sales@getluckygolfclub.com
                  </a>
                  .
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
