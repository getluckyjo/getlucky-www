import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TourOperatorForm from "@/components/forms/TourOperatorForm";
import TourRevenueCalculator from "@/components/TourRevenueCalculator";
import IndweBannerStrip from "@/components/IndweBannerStrip";
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
  Shield,
  CheckCircle2,
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
    title: "R100,000 On Every Tour",
    body: "Every itinerary you sell carries a real R100,000 hole-in-one prize on a defined par-3. Fully underwritten by Indwe Risk Services — if someone holes it, the payout is guaranteed and it never touches your pocket.",
  },
  {
    icon: Megaphone,
    title: "Brochure Firepower",
    body: "“Win R100,000 on this tour” on every brochure, mailer, booking page and WhatsApp group. It's the kind of headline that sells tours — and it costs you nothing to put there.",
  },
  {
    icon: Sparkles,
    title: "Stand Out From Every Other Tour",
    body: "Same courses, same lodges, same buses — until your tour is the one with a six-figure shot on it. The challenge gives golfers a reason to pick your operation over the next one.",
  },
  {
    icon: HandCoins,
    title: "A New Revenue Line",
    body: "Entries are R100 and you earn 20% commission on every one — pure margin on top of what the tour already makes, with nothing to set up and nothing to carry.",
  },
  {
    icon: Smartphone,
    title: "No Kit, No Cameras, No Setup",
    body: "Nothing travels with you and nothing gets installed. The challenge runs on any hole with three simple proofs: a mobile video of the tee shot, an affidavit from the four-ball, and a certificate from the course.",
  },
  {
    icon: MapPin,
    title: "Any Course In South Africa",
    body: "Pick the signature par-3 on each leg of your tour — any course in the country qualifies, as long as the hole plays a minimum of 150m. Define the hole before tee-off and you're live.",
  },
];

const PROOFS = [
  {
    icon: Video,
    step: "1",
    title: "Mobile Video Of The Tee Shot",
    body: "One of the four-ball films the tee shot on a phone — swing, ball flight, and the ball going in. No special kit, just the phones already in the golf cart.",
  },
  {
    icon: FileSignature,
    step: "2",
    title: "Affidavit From The Four-Ball",
    body: "The playing partners sign a sworn affidavit confirming the hole-in-one — who hit it, which hole, and when. We supply the template with your tour pack.",
  },
  {
    icon: BadgeCheck,
    step: "3",
    title: "Certificate From The Golf Course",
    body: "The club confirms the ace on its official hole-in-one certificate — something courses love doing anyway. That's the final stamp for the payout.",
  },
];

export default function GolfToursPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative bg-green-dark overflow-hidden pt-28 sm:pt-32 pb-20 sm:pb-28">
          <Image
            src="/images/golf-day/IMG_4460.jpg"
            alt="Golfer mid-swing at the Get Lucky Hole-in-One Challenge"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-dark/70 via-green-dark/80 to-green-dark" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              For Golf Tour Operators · Any Course In South Africa
            </span>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl text-cream mt-6 uppercase tracking-wide leading-[0.95]">
              Put A <span className="text-gold">R100,000 Shot</span> On Every
              Tour You Sell
            </h1>

            <p className="text-base sm:text-xl text-cream/80 mt-6 max-w-2xl mx-auto leading-relaxed">
              Sell R100 hole-in-one entries on the chosen par-3 of every leg
              of your tour. Your golfers swing for{" "}
              <span className="text-gold font-bold">R100,000</span>, you earn{" "}
              <span className="text-gold font-bold">
                20% commission on every entry
              </span>{" "}
              —
              and your brochure gets a headline no other operator can match. No
              cameras, no kit, fully underwritten by Indwe.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#build"
                className="inline-block bg-gold hover:bg-gold-light text-green-dark font-bold text-lg px-10 py-4 rounded-full transition-all hover:scale-105 w-full sm:w-auto"
              >
                Calculate What You&apos;ll Earn
              </a>
              <a
                href="#enquire"
                className="inline-block border-2 border-cream/30 hover:border-cream/60 text-cream font-medium text-lg px-10 py-4 rounded-full transition-all w-full sm:w-auto"
              >
                Enquire Now
              </a>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex items-center justify-center gap-3 text-cream/60">
              <Shield className="w-4 h-4" />
              <p className="text-xs sm:text-sm">
                All prizes underwritten by{" "}
                <span className="text-cream/90 font-medium">Indwe Risk Services</span>{" "}
                · FSP 3425
              </p>
            </div>
          </div>
        </section>

        {/* HEADLINE SPONSOR */}
        <IndweBannerStrip src="/indwe-banner-corporate/index.html" />

        {/* CALCULATOR */}
        <section id="build" className="py-20 sm:py-28 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                See What You Could Earn
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-green-dark mt-3 uppercase tracking-wide">
                Build Your Tour Numbers
              </h2>
              <p className="text-charcoal-light/80 mt-4">
                Pick how many entries your golfers will take per tour and how
                many tours you run a year. Your live earnings estimate updates
                as you go — no calls, no back-and-forth.
              </p>
            </div>

            <TourRevenueCalculator />

            <div className="mt-8 grid sm:grid-cols-3 gap-4 text-sm">
              {[
                "You earn 20% commission on every R100 entry",
                "R100,000 prize fully underwritten by Indwe — zero risk",
                "Works on any SA course with a 150m+ par-3",
              ].map((line) => (
                <div
                  key={line}
                  className="flex items-start gap-2 text-charcoal-light/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY ADD IT */}
        <section className="py-20 sm:py-28 bg-green-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                Why Operators Add It
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-cream mt-3 uppercase tracking-wide">
                The Cheapest R100,000 Your Marketing Will Ever Buy
              </h2>
              <p className="text-cream/70 mt-4">
                A six-figure cash prize on every itinerary — without carrying
                the risk, the kit, or the admin. You sell the entries; Indwe
                carries the prize.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHY.map((item) => (
                <div
                  key={item.title}
                  className="bg-cream/5 rounded-2xl border border-cream/10 p-6 hover:border-gold/40 transition-all"
                >
                  <div className="w-11 h-11 bg-gold/15 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-heading text-lg text-cream uppercase tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-cream/70 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PAYOUT VERIFICATION */}
        <section className="py-20 sm:py-28 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                How A Payout Works
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-green-dark mt-3 uppercase tracking-wide">
                Three Proofs. One Cheque.
              </h2>
              <p className="text-charcoal-light/80 mt-4">
                No cameras to install, no officials to fly in. When one of your
                golfers holes it, the R100,000 is paid out once three simple
                proofs check out.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {PROOFS.map((item) => (
                <div
                  key={item.title}
                  className="relative bg-white rounded-2xl border border-green-dark/10 p-6 shadow-sm"
                >
                  <span className="absolute top-5 right-5 font-heading text-4xl text-green-dark/10">
                    {item.step}
                  </span>
                  <div className="w-11 h-11 bg-gold/15 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-charcoal-light/80 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-green-dark text-cream p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-11 h-11 bg-gold/15 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-heading text-lg uppercase tracking-wide">
                  The Only Rules On The Hole
                </h3>
                <p className="text-sm text-cream/70 mt-1 leading-relaxed">
                  Any golf course in South Africa qualifies. The challenge hole
                  must be a par-3 playing a{" "}
                  <span className="text-gold font-semibold">
                    minimum of 150m
                  </span>
                  , and it&apos;s defined before the round tees off. That&apos;s
                  it — pick the signature par-3 on each leg and let your golfers
                  swing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="py-20 sm:py-24 bg-cream-dark/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                The Real Thing
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-green-dark mt-3 uppercase tracking-wide">
                Moments From The Tee
              </h2>
              <p className="text-charcoal-light/80 mt-4">
                Real golfers, real challenges, real reactions — from Get Lucky
                hole-in-one challenges around the country.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { src: "IMG_4634.jpg", alt: "Golfer mid-swing with Cape Town Stadium and Get Lucky gazebo", span: "lg:col-span-2 lg:row-span-2 aspect-[3/4] lg:aspect-auto" },
                { src: "IMG_4505.jpg", alt: "Three golfers with beers at the Get Lucky challenge", span: "aspect-square" },
                { src: "IMG_4432.jpg", alt: "Golfers with Get Lucky branded promoters", span: "aspect-square" },
                { src: "IMG_4419.jpg", alt: "Golfer scanning the Get Lucky Hole-in-One Challenge signage", span: "aspect-square" },
                { src: "IMG_4654.jpg", alt: "Golfer celebrating a shot at the challenge", span: "aspect-square" },
                { src: "IMG_4521.jpg", alt: "Golfer using a rangefinder at the par-3 challenge", span: "aspect-square" },
                { src: "IMG_4572.jpg", alt: "Golfer on the green with the flag", span: "aspect-square" },
                { src: "IMG_4527.jpg", alt: "Golfer mid-swing in front of the Swing It To Win It backdrop", span: "aspect-square" },
                { src: "IMG_4274.jpg", alt: "Golfers arriving at the course", span: "aspect-square" },
              ].map((img) => (
                <div
                  key={img.src}
                  className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-green-dark/5 ${img.span}`}
                >
                  <Image
                    src={`/images/golf-day/${img.src}`}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VIDEO */}
        <section className="py-20 sm:py-24 bg-green-dark">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                See It In Action
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-cream mt-3 uppercase tracking-wide">
                A Day With Get Lucky
              </h2>
              <p className="text-cream/70 mt-4">
                Real moments, real reactions, real prizes — from Get Lucky
                challenges around the country.
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-cream/10 shadow-2xl">
              <video
                className="w-full aspect-video bg-green-dark object-cover"
                controls
                preload="metadata"
                playsInline
                poster="/images/golf-day/video-poster.png"
              >
                <source src="/images/golf-day-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        {/* ENQUIRY FORM */}
        <section id="enquire" className="py-20 sm:py-28 bg-green-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                Lock It In
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-cream mt-3 uppercase tracking-wide">
                Add It To Your Tours
              </h2>
              <p className="text-cream/70 mt-4 max-w-lg mx-auto">
                Tell us about your operation. A Get Lucky specialist will be in
                touch within 24 hours to set up the challenge on your tours.
              </p>
            </div>

            <div className="bg-cream rounded-3xl shadow-xl p-6 sm:p-10">
              <TourOperatorForm />
            </div>

            <div className="mt-8 text-center">
              <p className="text-cream/60 text-sm">
                Prefer to chat?{" "}
                <a
                  href="https://wa.me/27609615091"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light font-semibold underline"
                >
                  WhatsApp us on +27 60 961 5091
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
