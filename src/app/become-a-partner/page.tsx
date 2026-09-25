import type { Metadata } from "next";
import { Download, ShieldCheck, Users, Wrench } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartnerForm from "@/components/forms/PartnerForm";
import ProposalFlipbook from "@/components/ProposalFlipbook";
import IndweBannerStrip from "@/components/IndweBannerStrip";
import PageHero from "@/components/ui/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureGrid, { type Feature } from "@/components/ui/FeatureGrid";
import EnquirySection from "@/components/ui/EnquirySection";

export const metadata: Metadata = {
  title: "Become a Partner Course",
  description:
    "Bring the Get Lucky Hole-in-One Challenge to your golf course. Drive footfall, member engagement and a fully insured prize activation — at no upfront cost.",
  alternates: { canonical: "/become-a-partner" },
};

const VALUE: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Fully insured",
    body: "Every prize underwritten by Indwe Risk Services (FSP 3425). Your club carries no payout liability.",
  },
  {
    icon: Users,
    title: "Drive members",
    body: "Sustained marketing across our channels and partner network drives foot traffic to your course.",
  },
  {
    icon: Wrench,
    title: "Turnkey setup",
    body: "We handle signage, staff briefing and digital activation. You get a new revenue line — we do the work.",
  },
];

export default function BecomeAPartnerPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          kicker="For golf courses"
          title="Become a partner course"
          lede="Add the Get Lucky Hole-in-One Challenge to your signature par‑3 and offer your members a fully-insured shot at up to R1,000,000. Zero upfront cost, zero risk to your club, full activation support from our team."
          image="/images/courses/st-francis-links.jpg"
          imageAlt="St Francis Links, a Get Lucky partner course"
          primary={{ href: "#apply", label: "Apply to partner" }}
          secondary={{ href: "#proposal", label: "View the 2026 proposal" }}
          stats={[
            { value: "R1M", label: "Top prize, fully insured" },
            { value: "R0", label: "Upfront cost to your club" },
            { value: "20+", label: "Partner courses live" },
            { value: "4G", label: "Solar cameras on your hole" },
          ]}
        />

        {/* Headline sponsor */}
        <IndweBannerStrip src="/indwe-banner-partner/index.html" />

        {/* Why partner */}
        <section className="section bg-paper" aria-labelledby="why-partner-title">
          <div className="wrap">
            <SectionHeader
              kicker="Why partner with us"
              title={<span id="why-partner-title">Zero cost. Zero risk. Full support.</span>}
              lede="A permanent hole-in-one challenge on your signature par‑3, run end to end by the Get Lucky team."
            />
            <div className="mt-12">
              <FeatureGrid items={VALUE} columns={3} />
            </div>
          </div>
        </section>

        {/* The proposal */}
        <section
          id="proposal"
          className="section bg-white scroll-mt-24"
          aria-labelledby="proposal-title"
        >
          <div className="wrap grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-10 lg:gap-16 items-center">
            <div className="reveal">
              <span className="kicker">The proposal</span>
              <h2 id="proposal-title" className="display-lg text-ink mt-4">
                The 2026 partner deck
              </h2>
              <p className="lede mt-5">
                Flip through the full 2026 partner deck — swipe, arrow keys or
                click the chevrons.
              </p>
              <a
                href="/GLG_Golf_Course_Proposal_2026.pdf"
                download
                className="btn-outline mt-8"
              >
                <Download className="w-4 h-4" />
                Download the PDF
              </a>
            </div>
            <div className="reveal rounded-3xl border border-line bg-paper p-3 sm:p-5">
              <ProposalFlipbook />
            </div>
          </div>
        </section>

        {/* Apply */}
        <EnquirySection
          id="apply"
          kicker="Apply to partner"
          title="Bring it to your course"
          lede="Tell us about your course, your members and what you're hoping to achieve. We'll be in touch to discuss bringing the challenge to your par‑3."
          response="The Get Lucky team replies within 1–2 business days."
        >
          <PartnerForm />
        </EnquirySection>
      </main>
      <Footer />
    </>
  );
}
