import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IndweBannerStrip from "@/components/IndweBannerStrip";
import PageHero from "@/components/ui/PageHero";
import EnquirySection from "@/components/ui/EnquirySection";
import { CalculatorSection, IncludedSection } from "@/components/ui/ServiceSections";
import SimulatorForm from "@/components/forms/SimulatorForm";
import SimulatorRevenueCalculator from "@/components/SimulatorRevenueCalculator";
import {
  TrendingUp,
  Trophy,
  MonitorSmartphone,
  CheckCircle2,
  Megaphone,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Golf Simulators | Add the R100,000 Get Lucky Hole-in-One Challenge",
  description:
    "Add a R100,000 Hole-in-One Challenge to your golf simulator. Players pay R149 for 3 shots to win R100,000 cash, your venue keeps 10% of every swing, and the prize is fully underwritten by Indwe Risk Services — zero cost, zero risk.",
  alternates: { canonical: "/golf-simulators" },
};

const INCLUDED = [
  {
    icon: TrendingUp,
    title: "10% revenue share",
    body: "Players pay R149 for 3 shots — and your venue keeps 10% of every swing. No setup fee, no upfront cost. Passive revenue on the simulator you already own.",
  },
  {
    icon: Trophy,
    title: "R100,000 cash prize",
    body: "A real R100,000 hole-in-one prize, fully underwritten by Indwe Risk Services. The payout is guaranteed and your venue carries zero liability.",
  },
  {
    icon: MonitorSmartphone,
    title: "Runs on your sim",
    body: "The challenge runs on the simulator you already have. We configure the challenge hole and settings — no new hardware, no disruption to your bookings.",
  },
  {
    icon: CheckCircle2,
    title: "Instant verification",
    body: "Your simulator's own shot tracking confirms a hole-in-one automatically — so a win is instant, accurate and indisputable, every single time.",
  },
  {
    icon: Megaphone,
    title: "Marketing & footfall",
    body: "A R100,000 prize is a reason to visit. We promote your venue across our channels and partner network, driving new players and repeat bookings.",
  },
  {
    icon: Sparkles,
    title: "Turnkey setup",
    body: "Signage, staff briefing, branded assets and full activation support. We handle the admin and the payout — you just switch it on and earn.",
  },
];

export default function GolfSimulatorsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          kicker="For golf simulators · Anywhere in South Africa"
          title={
            <>
              Add a R100,000{" "}
              <span className="text-lime"><span className="whitespace-nowrap">hole-in-one</span> challenge</span> to your sim
            </>
          }
          lede={
            <>
              Players pay{" "}
              <span className="text-white font-semibold">R149 for 3 shots</span> at
              a hole-in-one to win{" "}
              <span className="text-white font-semibold">R100,000 cash</span> — and
              your venue keeps{" "}
              <span className="text-white font-semibold">10% of every swing</span>.
              The prize is fully underwritten by Indwe. No cost, no risk. We run
              it — you earn.
            </>
          }
          image="/images/golf-simulator.jpg"
          imageAlt="Golfer mid-swing at a Get Lucky branded golf simulator"
          primary={{ href: "#earn", label: "Calculate what you'll earn" }}
          secondary={{ href: "#enquire", label: "Enquire now" }}
          stats={[
            { value: "R100K", label: "Cash prize, underwritten" },
            { value: "R149", label: "Per player for 3 shots" },
            { value: "10%", label: "Of every swing to your venue" },
            { value: "0", label: "New hardware to buy" },
          ]}
        />

        <IndweBannerStrip src="/indwe-banner-corporate/index.html" />

        <CalculatorSection
          id="earn"
          kicker="See what you could earn"
          title="Your revenue at 10%"
          lede="Drag in how many swings you'd expect each month. Your live revenue estimate updates as you go — no calls, no back-and-forth."
          checks={[
            "You keep 10% of every swing sold",
            "Prize fully underwritten by Indwe — zero risk",
            "Runs on the sim you already own",
          ]}
        >
          <SimulatorRevenueCalculator />
        </CalculatorSection>

        <IncludedSection
          title="A new revenue line, switched on"
          lede="The challenge slots straight into your existing simulator. We set it up, brand it, market it and handle the prize — you add a show-stopping reason to play and keep 10% of every swing."
          items={INCLUDED}
        />

        <EnquirySection
          kicker="Lock it in"
          title="Add it to your sim"
          lede="Tell us about your venue. A Get Lucky specialist will be in touch within 24 hours to set up the challenge on your simulator."
          response="A Get Lucky specialist replies within 24 hours."
        >
          <SimulatorForm />
        </EnquirySection>
      </main>
      <Footer />
    </>
  );
}
