import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartnerForm from "@/components/forms/PartnerForm";
import ProposalFlipbook from "@/components/ProposalFlipbook";
import IndweBannerStrip from "@/components/IndweBannerStrip";

export const metadata: Metadata = {
  title: "Become a Partner Course",
  description:
    "Bring the Get Lucky Hole-in-One Challenge to your golf course. Drive footfall, member engagement and a fully insured prize activation — at no upfront cost.",
  alternates: { canonical: "/become-a-partner" },
};

export default function BecomeAPartnerPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <section className="bg-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                For Golf Courses
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-green-dark mt-4 uppercase tracking-wide">
                Become a Partner Course
              </h1>
              <p className="text-base sm:text-lg text-charcoal-light/80 mt-5 leading-relaxed">
                Add the Get Lucky Hole-in-One Challenge to your signature par-3 and
                offer your members a fully-insured shot at up to R1,000,000. Zero
                upfront cost, zero risk to your club, full activation support from
                our team.
              </p>
            </div>

            {/* Headline sponsor */}
            <div className="mb-10 overflow-hidden rounded-3xl border border-green-dark/10 shadow-sm">
              <IndweBannerStrip src="/indwe-banner-partner/index.html" />
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-green-dark/10 p-4 sm:p-6 mb-10">
              <div className="text-center mb-5">
                <h2 className="font-heading text-2xl sm:text-3xl text-green-dark uppercase tracking-wide">
                  The Proposal
                </h2>
                <p className="text-sm text-charcoal-light/70 mt-1">
                  Flip through the full 2026 partner deck — swipe, arrow keys or click the chevrons.
                </p>
              </div>
              <ProposalFlipbook />
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-green-dark/10 p-6 sm:p-10">
              <PartnerForm />
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              {[
                {
                  title: "Fully insured",
                  body: "Every prize underwritten by Indwe Risk Services (FSP 3425). Your club carries no payout liability.",
                },
                {
                  title: "Drive members",
                  body: "Sustained marketing across our channels and partner network drives foot traffic to your course.",
                },
                {
                  title: "Turnkey setup",
                  body: "We handle signage, staff briefing and digital activation. You get a new revenue line — we do the work.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl border border-green-dark/10 p-6"
                >
                  <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-charcoal-light/80 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
