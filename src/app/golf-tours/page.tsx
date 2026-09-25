import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IndweBannerStrip from "@/components/IndweBannerStrip";
import PageHero from "@/components/ui/PageHero";
import EnquirySection from "@/components/ui/EnquirySection";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  CalculatorSection,
  IncludedSection,
  ShowcaseSection,
} from "@/components/ui/ServiceSections";
import { galleryFor } from "@/lib/golfDayPhotos";
import TourOperatorForm from "@/components/forms/TourOperatorForm";
import TourRevenueCalculator from "@/components/TourRevenueCalculator";
import {
  Trophy,
  Megaphone,
  Sparkles,
  HandCoins,
  Smartphone,
  MapPin,
  Video,
  FileSignature,
  BadgeCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Golf Tour Operators | Sell the R100,000 Hole-in-One Challenge on Your Tours",
  description:
    "Add a R100,000 hole-in-one prize to every golf tour you sell. Golfers pay R100 per entry on a defined par-3 — you earn 20% commission on every entry. No cameras, no kit: payouts verified by mobile video, a four-ball affidavit and a course certificate. Any course in South Africa, minimum 150m. Underwritten by Indwe Risk Services.",
  alternates: { canonical: "/golf-tours" },
};

const WHY = [
  {
    icon: Trophy,
    title: "R100,000 on every tour",
    body: "Every itinerary you sell carries a real R100,000 hole-in-one prize on a defined par-3. Fully underwritten by Indwe Risk Services — if someone holes it, the payout is guaranteed and it never touches your pocket.",
  },
  {
    icon: Megaphone,
    title: "Brochure firepower",
    body: "“Win R100,000 on this tour” on every brochure, mailer, booking page and WhatsApp group. It's the kind of headline that sells tours — and it costs you nothing to put there.",
  },
  {
    icon: Sparkles,
    title: "Stand out from every other tour",
    body: "Same courses, same lodges, same buses — until your tour is the one with a six-figure shot on it. The challenge gives golfers a reason to pick your operation over the next one.",
  },
  {
    icon: HandCoins,
    title: "A new revenue line",
    body: "Entries are R100 and you earn 20% commission on every one — pure margin on top of what the tour already makes, with nothing to set up and nothing to carry.",
  },
  {
    icon: Smartphone,
    title: "No kit, no cameras, no setup",
    body: "Nothing travels with you and nothing gets installed. The challenge runs on any hole with three simple proofs: a mobile video of the tee shot, an affidavit from the four-ball, and a certificate from the course.",
  },
  {
    icon: MapPin,
    title: "Any course in South Africa",
    body: "Pick the signature par-3 on each leg of your tour — any course in the country qualifies, as long as the hole plays a minimum of 150m. Define the hole before tee-off and you're live.",
  },
];

const PROOFS = [
  {
    icon: Video,
    step: "1",
    title: "Mobile video of the tee shot",
    body: "One of the four-ball films the tee shot on a phone — swing, ball flight, and the ball going in. No special kit, just the phones already in the golf cart.",
  },
  {
    icon: FileSignature,
    step: "2",
    title: "Affidavit from the four-ball",
    body: "The playing partners sign a sworn affidavit confirming the hole-in-one — who hit it, which hole, and when. We supply the template with your tour pack.",
  },
  {
    icon: BadgeCheck,
    step: "3",
    title: "Certificate from the golf course",
    body: "The club confirms the ace on its official hole-in-one certificate — something courses love doing anyway. That's the final stamp for the payout.",
  },
];

export default function GolfToursPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          kicker="For golf tour operators · Any course in South Africa"
          title={
            <>
              Put a <span className="text-lime">R100,000 shot</span> on every tour
              you sell
            </>
          }
          lede={
            <>
              Sell R100 hole-in-one entries on the chosen par‑3 of every leg of
              your tour. Your golfers swing for{" "}
              <span className="text-white font-semibold">R100,000</span>, you earn{" "}
              <span className="text-white font-semibold">20% commission on every entry</span>{" "}
              — and your brochure gets a headline no other operator can match. No
              cameras, no kit, fully underwritten by Indwe.
            </>
          }
          image="/images/courses/zimbali.jpg"
          imageAlt="The fairway at Zimbali, a Get Lucky partner course"
          primary={{ href: "#build", label: "Calculate what you'll earn" }}
          secondary={{ href: "#enquire", label: "Enquire now" }}
          stats={[
            { value: "R100K", label: "Prize on every tour" },
            { value: "R100", label: "Per entry" },
            { value: "20%", label: "Commission to you" },
            { value: "150m+", label: "Any SA par-3 qualifies" },
          ]}
        />

        <IndweBannerStrip src="/indwe-banner-corporate/index.html" />

        <CalculatorSection
          kicker="See what you could earn"
          title="Build your tour numbers"
          lede="Pick how many entries your golfers will take per tour and how many tours you run a year. Your live earnings estimate updates as you go — no calls, no back-and-forth."
          checks={[
            "You earn 20% commission on every R100 entry",
            "R100,000 prize fully underwritten by Indwe — zero risk",
            "Works on any SA course with a 150m+ par-3",
          ]}
        >
          <TourRevenueCalculator />
        </CalculatorSection>

        <IncludedSection
          kicker="Why operators add it"
          title="The cheapest R100,000 your marketing will ever buy"
          lede="A six-figure cash prize on every itinerary — without carrying the risk, the kit, or the admin. You sell the entries; Indwe carries the prize."
          items={WHY}
        />

        {/* PAYOUT VERIFICATION */}
        <section className="section bg-paper">
          <div className="wrap">
            <SectionHeader
              kicker="How a payout works"
              title="Three proofs. One cheque."
              lede="No cameras to install, no officials to fly in. When one of your golfers holes it, the R100,000 is paid out once three simple proofs check out."
            />

            <ol className="mt-12 grid md:grid-cols-3 gap-3">
              {PROOFS.map((item) => (
                <li key={item.step} className="reveal card p-7">
                  <div className="flex items-center justify-between">
                    <span className="icon-disc">
                      <item.icon className="w-5 h-5" />
                    </span>
                    <span className="font-heading text-5xl leading-none text-ink/10">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-6 text-[17px] font-semibold tracking-[-0.01em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.body}</p>
                </li>
              ))}
            </ol>

            <div className="reveal mt-3 on-dark rounded-3xl bg-night text-white p-7 sm:p-9 flex flex-col sm:flex-row items-start gap-5">
              <span className="icon-disc icon-disc--lime shrink-0">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-[17px] font-semibold">The only rules on the hole</h3>
                <p className="mt-2 text-[15px] text-white/70 leading-relaxed max-w-3xl">
                  Any golf course in South Africa qualifies. The challenge hole
                  must be a par-3 playing a{" "}
                  <span className="text-lime font-semibold">minimum of 150m</span>,
                  and it&apos;s defined before the round tees off. That&apos;s it —
                  pick the signature par-3 on each leg and let your golfers swing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ShowcaseSection
          kicker="The real thing"
          title="Moments from the tee"
          lede="Real golfers, real challenges, real reactions — from Get Lucky hole-in-one challenges around the country."
          photos={galleryFor("IMG_4274.jpg")}
        />

        <EnquirySection
          kicker="Lock it in"
          title="Add it to your tours"
          lede="Tell us about your operation. A Get Lucky specialist will be in touch within 24 hours to set up the challenge on your tours."
          response="A Get Lucky specialist replies within 24 hours."
        >
          <TourOperatorForm />
        </EnquirySection>
      </main>
      <Footer />
    </>
  );
}
