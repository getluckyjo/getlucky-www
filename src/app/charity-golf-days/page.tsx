import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IndweBannerStrip from "@/components/IndweBannerStrip";
import PageHero from "@/components/ui/PageHero";
import EnquirySection from "@/components/ui/EnquirySection";
import {
  CalculatorSection,
  IncludedSection,
  ShowcaseSection,
} from "@/components/ui/ServiceSections";
import { GOLF_DAY_PHOTOS } from "@/lib/golfDayPhotos";
import CharityForm from "@/components/forms/CharityForm";
import CharityFundraisingCalculator from "@/components/CharityFundraisingCalculator";
import {
  HeartHandshake,
  Trophy,
  Camera,
  Megaphone,
  Sparkles,
  Wine,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Charity Golf Days | Fundraise with the Get Lucky Hole-in-One Challenge",
  description:
    "Turn your charity golf day into a fundraiser. Sell swings at the mobile R1,000,000 Hole-in-One Challenge and keep 50% of every swing. The prize is fully underwritten by Indwe Risk Services — zero cost, zero risk to your charity.",
  alternates: { canonical: "/charity-golf-days" },
};

const INCLUDED = [
  {
    icon: HeartHandshake,
    title: "50% of every swing",
    body: "Golfers buy swings to play the challenge at your day — and you keep half of every single one. No setup fee, no upfront cost. The more swings sold, the more you raise.",
  },
  {
    icon: Trophy,
    title: "Prizes up to R1,000,000",
    body: "Choose your headline prize — R25k, R60k, R100k or bigger. Fully underwritten by Indwe Risk Services, so the moment is real, the payout is guaranteed, and your charity carries zero risk.",
  },
  {
    icon: Camera,
    title: "4G solar cameras",
    body: "Two solar-powered 4G cameras on the par-3 capture every swing. Instant verification of a hole-in-one, plus shareable highlights for your donors and sponsors.",
  },
  {
    icon: Megaphone,
    title: "Promotional team",
    body: "Branded Get Lucky promoters on the tee — hyping golfers, explaining the challenge and driving swing sales, which means more raised for your cause.",
  },
  {
    icon: Sparkles,
    title: "Merch & co-branding",
    body: "Get Lucky merchandise on the activation, plus full co-branding with your charity — flags, banners, signage and digital assets that carry your cause through the day.",
  },
  {
    icon: Wine,
    title: "Shanky's Whip",
    body: "Every golfer receives a complimentary Shanky's Whip at the activation. Instant engagement, zero awkwardness, the kind of moment players post about.",
  },
];

export default function CharityGolfDaysPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          kicker="Mobile charity fundraiser · Anywhere in South Africa"
          title={
            <>
              Turn your golf day <span className="text-lime">into a fundraiser</span>
            </>
          }
          lede={
            <>
              Golfers buy swings to play the Get Lucky Hole-in-One Challenge at
              your day — and your charity keeps{" "}
              <span className="text-white font-semibold">50% of every swing</span>.
              Real prizes up to{" "}
              <span className="text-white font-semibold">R1,000,000</span>, fully
              underwritten by Indwe. No cost, no risk. We run it — you raise.
            </>
          }
          image="/images/golf-day/IMG_4460.jpg"
          imageAlt="Golfer mid-swing at the Get Lucky Hole-in-One Challenge activation"
          primary={{ href: "#build", label: "Calculate what you'll raise" }}
          secondary={{ href: "#enquire", label: "Enquire now" }}
          stats={[
            { value: "50%", label: "Of every swing to your cause" },
            { value: "R1M", label: "Prizes up to" },
            { value: "R0", label: "Setup fee or upfront cost" },
            { value: "24h", label: "To hear from a specialist" },
          ]}
        />

        <IndweBannerStrip src="/indwe-banner-corporate/index.html" />

        <CalculatorSection
          kicker="See what you could raise"
          title="Build your charity fundraiser"
          lede="Pick your swing price and how many you expect to sell. Your live fundraising estimate updates as you go — no calls, no back-and-forth."
          checks={[
            "You keep 50% of every swing sold",
            "Prize fully underwritten by Indwe — zero risk",
            "We run the whole activation for you",
          ]}
        >
          <CharityFundraisingCalculator />
        </CalculatorSection>

        <IncludedSection
          title="Everything travels with us"
          lede="The challenge is fully mobile. We arrive at sunrise, set up the full activation, run it for the day, and pack it down. You get a show-stopping hole — and a cheque for your cause."
          items={INCLUDED}
        />

        <ShowcaseSection
          kicker="The real thing"
          title="Moments from the tee"
          lede="Real golfers, real activations, real reactions — from golf days around the country. This is what your charity day looks like."
          photos={GOLF_DAY_PHOTOS}
        />

        <EnquirySection
          kicker="Lock it in"
          title="Host a charity day"
          lede="Tell us about your cause. An activation specialist will be in touch within 24 hours to set up your charity golf day."
        >
          <CharityForm />
        </EnquirySection>
      </main>
      <Footer />
    </>
  );
}
