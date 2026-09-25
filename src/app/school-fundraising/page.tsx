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
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureGrid from "@/components/ui/FeatureGrid";
import SchoolForm from "@/components/forms/SchoolForm";
import CharityFundraisingCalculator from "@/components/CharityFundraisingCalculator";
import {
  GraduationCap,
  Trophy,
  Camera,
  Megaphone,
  Sparkles,
  Wine,
  Bus,
  Dumbbell,
  BookOpen,
  Landmark,
} from "lucide-react";

export const metadata: Metadata = {
  title: "School Fundraising Golf Days | Get Lucky Hole-in-One Challenge",
  description:
    "Turn your school golf day into a fundraiser. Parents, old boys and girls, and local businesses buy swings at the mobile R1,000,000 Hole-in-One Challenge — and your school keeps 50% of every swing. The prize is fully underwritten by Indwe Risk Services — zero cost, zero risk to your school.",
  alternates: { canonical: "/school-fundraising" },
};

const INCLUDED = [
  {
    icon: GraduationCap,
    title: "50% of every swing",
    body: "Parents, alumni and local businesses buy swings to play the challenge at your day — and your school keeps half of every single one. No setup fee, no upfront cost. The more swings sold, the more you raise.",
  },
  {
    icon: Trophy,
    title: "Prizes up to R1,000,000",
    body: "Choose your headline prize — R25k, R60k, R100k or bigger. Fully underwritten by Indwe Risk Services, so the moment is real, the payout is guaranteed, and your school carries zero risk.",
  },
  {
    icon: Camera,
    title: "4G solar cameras",
    body: "Two solar-powered 4G cameras on the par-3 capture every swing. Instant verification of a hole-in-one, plus shareable highlights for your school community and sponsors.",
  },
  {
    icon: Megaphone,
    title: "Promotional team",
    body: "Branded Get Lucky promoters on the tee — hyping golfers, explaining the challenge and driving swing sales, which means more raised for your school.",
  },
  {
    icon: Sparkles,
    title: "Merch & co-branding",
    body: "Get Lucky merchandise on the activation, plus full co-branding with your school — flags, banners, signage and digital assets that carry your school's colours through the day.",
  },
  {
    icon: Wine,
    title: "Shanky's Whip",
    body: "Every golfer receives a complimentary Shanky's Whip at the activation — strictly for the grown-ups on the tee. Instant engagement, the kind of moment parents and old boys post about.",
  },
];

const FUNDING_GOALS = [
  {
    icon: Dumbbell,
    title: "Sports facilities & kit",
    body: "New nets, astro upgrades, team kit and equipment — funded by one great day on the course.",
  },
  {
    icon: Bus,
    title: "Tours & festivals",
    body: "Send your first team on tour or get the choir to the festival without asking parents to dig deeper.",
  },
  {
    icon: BookOpen,
    title: "Bursaries & learning",
    body: "Fund bursaries, classroom tech and library resources with money raised from the wider school community.",
  },
  {
    icon: Landmark,
    title: "Building projects",
    body: "Kick-start the new pavilion, hall upgrade or centenary project with a headline fundraising day.",
  },
];

// Name-only cards (no crests) — school crests are trademarked and we don't
// hold logo usage rights, so the wall stays typographic.
const SCHOOLS_WORKED_WITH = [
  { name: "Grey College", location: "Bloemfontein, Free State" },
  { name: "Paul Roos Gymnasium", location: "Stellenbosch, Western Cape" },
  { name: "Paarl Boys' High", location: "Paarl, Western Cape" },
  { name: "Afrikaanse Hoër Seunskool", location: "Pretoria, Gauteng" },
  { name: "Paarl Gimnasium", location: "Paarl, Western Cape" },
  { name: "Grey High School", location: "Gqeberha, Eastern Cape" },
  { name: "Maritzburg College", location: "Pietermaritzburg, KZN" },
  { name: "Hilton College", location: "Hilton, KZN" },
  { name: "King Edward VII School", location: "Johannesburg, Gauteng" },
  { name: "Glenwood High School", location: "Durban, KZN" },
];

export default function SchoolFundraisingPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          kicker="Mobile school fundraiser · Anywhere in South Africa"
          title={
            <>
              Raise big for your school <span className="text-lime">in one golf day</span>
            </>
          }
          lede={
            <>
              Parents, old boys and girls, and local businesses buy swings to
              play the Get Lucky Hole-in-One Challenge at your golf day — and
              your school keeps{" "}
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
            { value: "50%", label: "Of every swing to your school" },
            { value: "R1M", label: "Prizes up to" },
            { value: "R0", label: "Setup fee or upfront cost" },
            { value: `${SCHOOLS_WORKED_WITH.length}`, label: "Leading schools worked with" },
          ]}
        />

        <IndweBannerStrip src="/indwe-banner-corporate/index.html" />

        <CalculatorSection
          kicker="See what you could raise"
          title="Build your school fundraiser"
          lede="Pick your swing price and how many you expect to sell. Your live fundraising estimate updates as you go — no calls, no back-and-forth."
          checks={[
            "Your school keeps 50% of every swing sold",
            "Prize fully underwritten by Indwe — zero risk",
            "We run the whole activation for you",
          ]}
        >
          <CharityFundraisingCalculator beneficiary="school" />
        </CalculatorSection>

        {/* SCHOOLS WE'VE WORKED WITH — name-only, no crests */}
        <section className="section bg-white">
          <div className="wrap">
            <SectionHeader
              kicker="In good company"
              title="Schools we've worked with"
              lede="From derby days to old boys' reunions, the challenge has teed off with some of South Africa's proudest sporting schools."
            />
            <ul className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-t border-l border-line">
              {SCHOOLS_WORKED_WITH.map((school) => (
                <li
                  key={school.name}
                  className="reveal border-b border-r border-line px-5 py-7 flex flex-col justify-between min-h-[132px]"
                >
                  <GraduationCap className="w-5 h-5 text-green" />
                  <div className="mt-6">
                    <p className="text-[15px] font-semibold leading-snug text-ink">
                      {school.name}
                    </p>
                    <p className="text-[12px] text-muted mt-1">{school.location}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* WHAT SCHOOLS FUND */}
        <section className="section bg-paper">
          <div className="wrap">
            <SectionHeader
              kicker="One day, real impact"
              title="What schools raise for"
              lede="A golf day works because it reaches beyond the school gates — parents, alumni and local businesses all want a swing at the big prize. Here's what that turns into."
            />
            <div className="mt-12">
              <FeatureGrid items={FUNDING_GOALS} columns={4} />
            </div>
          </div>
        </section>

        <IncludedSection
          title="Everything travels with us"
          lede="The challenge is fully mobile. We arrive at sunrise, set up the full activation, run it for the day, and pack it down. You get a show-stopping hole — and a cheque for your school."
          items={INCLUDED}
        />

        <ShowcaseSection
          kicker="The real thing"
          title="Moments from the tee"
          lede="Real golfers, real activations, real reactions — from golf days around the country. This is what your school's fundraising day looks like."
          photos={GOLF_DAY_PHOTOS}
        />

        <EnquirySection
          kicker="Lock it in"
          title="Host a school fundraiser"
          lede="Tell us about your school and what you're raising for. An activation specialist will be in touch within 24 hours to set up your fundraising golf day."
        >
          <SchoolForm />
        </EnquirySection>
      </main>
      <Footer />
    </>
  );
}
