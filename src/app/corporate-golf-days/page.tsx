import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CorporateForm from "@/components/forms/CorporateForm";
import GolfDayCalculator from "@/components/GolfDayCalculator";
import IndweBannerStrip from "@/components/IndweBannerStrip";
import PageHero from "@/components/ui/PageHero";
import EnquirySection from "@/components/ui/EnquirySection";
import {
  CalculatorSection,
  IncludedSection,
  ShowcaseSection,
} from "@/components/ui/ServiceSections";
import { GOLF_DAY_PHOTOS } from "@/lib/golfDayPhotos";
import {
  Trophy,
  Camera,
  Aperture,
  Megaphone,
  Sparkles,
  Wine,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Corporate Golf Day Activations | Get Lucky Hole-in-One Challenge",
  description:
    "Turn your corporate golf day into the story everyone talks about. Mobile R1,000,000 Hole-in-One Challenge — 4G solar cameras, promoter team, Shanky's Whip for every golfer, fully insured by Indwe Risk Services.",
  alternates: { canonical: "/corporate-golf-days" },
};

const INCLUDED = [
  {
    icon: Trophy,
    title: "Prizes up to R1,000,000",
    body: "Choose your headline prize — R100k, R250k or the full R1M. Fully underwritten by Indwe Risk Services so the moment is real and the payout is guaranteed.",
  },
  {
    icon: Camera,
    title: "4G solar cameras",
    body: "Two solar-powered 4G cameras on the par-3 capture every swing. Instant verification of a hole-in-one, plus shareable highlights for your team and sponsors.",
  },
  {
    icon: Aperture,
    title: "Photography & video",
    body: "Optional pro photographer and videographer covering the activation and the field — a polished highlight reel and a library of shareable shots after the day.",
  },
  {
    icon: Megaphone,
    title: "Promotional team",
    body: "Branded Get Lucky promoters on the tee — hyping golfers, explaining the challenge, driving participation and creating energy on the hole.",
  },
  {
    icon: Sparkles,
    title: "Merch & co-branding",
    body: "Get Lucky merchandise on the activation, plus full co-branding with your sponsor — flags, banners, signage and digital assets that travel after the day.",
  },
  {
    icon: Wine,
    title: "Shanky's Whip",
    body: "Every golfer receives a complimentary Shanky's Whip at the activation. Instant engagement, zero awkwardness, the kind of moment players post about.",
  },
];

export default function CorporateGolfDaysPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          kicker="Mobile corporate activation · Anywhere in South Africa"
          title={
            <>
              Make your golf day{" "}
              <span className="text-lime">the one they talk about for years</span>
            </>
          }
          lede={
            <>
              The Get Lucky Hole-in-One Challenge is a fully-mobile activation
              that drops onto the signature par-3 of any corporate golf day in
              South Africa. Real prizes up to{" "}
              <span className="text-white font-semibold">R1,000,000</span>.
              Fully insured. We run the whole thing — you play golf.
            </>
          }
          image="/images/golf-day/IMG_4460.jpg"
          imageAlt="Golfer mid-swing at the Get Lucky Hole-in-One Challenge activation"
          primary={{ href: "#build", label: "Build your activation" }}
          secondary={{ href: "#enquire", label: "Get a quote" }}
          stats={[
            { value: "R1M", label: "Headline prize, up to" },
            { value: "2", label: "Solar 4G cameras on the par-3" },
            { value: "24h", label: "From enquiry to package options" },
            { value: "100%", label: "Setup, running & pack-down by us" },
          ]}
        />

        <IndweBannerStrip src="/indwe-banner-corporate/index.html" />

        <CalculatorSection
          kicker="Build your package"
          title="Build your golf day activation"
          lede="Pick your prize, your team, and your extras. Your live quote updates as you go — no calls, no back-and-forth."
          checks={[
            "Setup, teardown & on-site management included",
            "Full Indwe prize underwriting",
            "Custom co-branding with your sponsor",
          ]}
        >
          <GolfDayCalculator />
        </CalculatorSection>

        <IncludedSection
          title="Everything travels with us"
          lede="The challenge is fully mobile. We arrive at sunrise, set up the full activation, run it for the day, and pack it down. You get the moment — and the story."
          items={INCLUDED}
        />

        <ShowcaseSection
          kicker="The real thing"
          title="Moments from the tee"
          lede="Real corporate golfers, real activations, real reactions — from corporate golf days around the country. This is what your day looks like."
          photos={GOLF_DAY_PHOTOS}
        />

        <EnquirySection
          kicker="Lock it in"
          title="Request your activation"
          lede="Tell us about your day. An activation specialist will be in touch within 24 hours with package options and availability."
        >
          <CorporateForm />
        </EnquirySection>
      </main>
      <Footer />
    </>
  );
}
