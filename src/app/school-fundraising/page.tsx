import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchoolForm from "@/components/forms/SchoolForm";
import CharityFundraisingCalculator from "@/components/CharityFundraisingCalculator";
import IndweBannerStrip from "@/components/IndweBannerStrip";
import {
  GraduationCap,
  Trophy,
  Camera,
  Megaphone,
  Sparkles,
  Wine,
  Shield,
  CheckCircle2,
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
    title: "50% Of Every Swing",
    body: "Parents, alumni and local businesses buy swings to play the challenge at your day — and your school keeps half of every single one. No setup fee, no upfront cost. The more swings sold, the more you raise.",
  },
  {
    icon: Trophy,
    title: "Prizes up to R1,000,000",
    body: "Choose your headline prize — R25k, R60k, R100k or bigger. Fully underwritten by Indwe Risk Services, so the moment is real, the payout is guaranteed, and your school carries zero risk.",
  },
  {
    icon: Camera,
    title: "4G Solar Cameras",
    body: "Two solar-powered 4G cameras on the par-3 capture every swing. Instant verification of a hole-in-one, plus shareable highlights for your school community and sponsors.",
  },
  {
    icon: Megaphone,
    title: "Promotional Team",
    body: "Branded Get Lucky promoters on the tee — hyping golfers, explaining the challenge and driving swing sales, which means more raised for your school.",
  },
  {
    icon: Sparkles,
    title: "Merch & Co-Branding",
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
    title: "Sports Facilities & Kit",
    body: "New nets, astro upgrades, team kit and equipment — funded by one great day on the course.",
  },
  {
    icon: Bus,
    title: "Tours & Festivals",
    body: "Send your first team on tour or get the choir to the festival without asking parents to dig deeper.",
  },
  {
    icon: BookOpen,
    title: "Bursaries & Learning",
    body: "Fund bursaries, classroom tech and library resources with money raised from the wider school community.",
  },
  {
    icon: Landmark,
    title: "Building Projects",
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
        {/* HERO */}
        <section className="relative bg-green-dark overflow-hidden pt-28 sm:pt-32 pb-20 sm:pb-28">
          <Image
            src="/images/golf-day/IMG_4460.jpg"
            alt="Golfer mid-swing at the Get Lucky Hole-in-One Challenge activation"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-dark/70 via-green-dark/80 to-green-dark" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              Mobile School Fundraiser · Anywhere in South Africa
            </span>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl text-cream mt-6 uppercase tracking-wide leading-[0.95]">
              Raise Big For Your School{" "}
              <span className="text-gold">In One Golf Day</span>
            </h1>

            <p className="text-base sm:text-xl text-cream/80 mt-6 max-w-2xl mx-auto leading-relaxed">
              Parents, old boys and girls, and local businesses buy swings to
              play the Get Lucky Hole-in-One Challenge at your golf day — and
              your school keeps{" "}
              <span className="text-gold font-bold">50% of every swing</span>.
              Real prizes up to{" "}
              <span className="text-gold font-bold">R1,000,000</span>, fully
              underwritten by Indwe. No cost, no risk. We run it — you raise.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#build"
                className="inline-block bg-gold hover:bg-gold-light text-green-dark font-bold text-lg px-10 py-4 rounded-full transition-all hover:scale-105 w-full sm:w-auto"
              >
                Calculate What You&apos;ll Raise
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
                See What You Could Raise
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-green-dark mt-3 uppercase tracking-wide">
                Build Your School Fundraiser
              </h2>
              <p className="text-charcoal-light/80 mt-4">
                Pick your swing price and how many you expect to sell. Your live
                fundraising estimate updates as you go — no calls, no
                back-and-forth.
              </p>
            </div>

            <CharityFundraisingCalculator beneficiary="school" />

            <div className="mt-8 grid sm:grid-cols-3 gap-4 text-sm">
              {[
                "Your school keeps 50% of every swing sold",
                "Prize fully underwritten by Indwe — zero risk",
                "We run the whole activation for you",
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

        {/* SCHOOLS WE'VE WORKED WITH */}
        <section className="py-20 sm:py-24 bg-green-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                In Good Company
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-cream mt-3 uppercase tracking-wide">
                Schools We&apos;ve Worked With
              </h2>
              <p className="text-cream/70 mt-4">
                From derby days to old boys&apos; reunions, the challenge has
                teed off with some of South Africa&apos;s proudest sporting
                schools.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {SCHOOLS_WORKED_WITH.map((school) => (
                <div
                  key={school.name}
                  className="bg-cream/5 rounded-2xl border border-cream/10 px-4 py-6 text-center hover:border-gold/40 transition-all flex flex-col items-center justify-center"
                >
                  <GraduationCap className="w-5 h-5 text-gold mb-3" />
                  <p className="font-heading text-base text-cream uppercase tracking-wide leading-tight">
                    {school.name}
                  </p>
                  <p className="text-[11px] text-cream/50 mt-2">
                    {school.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT SCHOOLS FUND */}
        <section className="py-20 sm:py-24 bg-cream-dark/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                One Day, Real Impact
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-green-dark mt-3 uppercase tracking-wide">
                What Schools Raise For
              </h2>
              <p className="text-charcoal-light/80 mt-4">
                A golf day works because it reaches beyond the school gates —
                parents, alumni and local businesses all want a swing at the big
                prize. Here&apos;s what that turns into.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FUNDING_GOALS.map((goal) => (
                <div
                  key={goal.title}
                  className="bg-white rounded-2xl border border-green-dark/10 p-6 hover:border-gold/40 transition-all"
                >
                  <div className="w-11 h-11 bg-gold/15 rounded-xl flex items-center justify-center mb-4">
                    <goal.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-heading text-lg text-green-dark uppercase tracking-wide mb-2">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-charcoal-light/80 leading-relaxed">
                    {goal.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="py-20 sm:py-28 bg-green-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                What&apos;s Included
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-cream mt-3 uppercase tracking-wide">
                Everything Travels With Us
              </h2>
              <p className="text-cream/70 mt-4">
                The challenge is fully mobile. We arrive at sunrise, set up the
                full activation, run it for the day, and pack it down. You get a
                show-stopping hole — and a cheque for your school.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {INCLUDED.map((item) => (
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
                Real golfers, real activations, real reactions. This is what your
                school&apos;s fundraising day looks like.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { src: "IMG_4634.jpg", alt: "Golfer mid-swing with Cape Town Stadium and Get Lucky gazebo", span: "lg:col-span-2 lg:row-span-2 aspect-[3/4] lg:aspect-auto" },
                { src: "IMG_4505.jpg", alt: "Three golfers with beers at the Get Lucky activation", span: "aspect-square" },
                { src: "IMG_4432.jpg", alt: "Golfers with Get Lucky branded promoters", span: "aspect-square" },
                { src: "IMG_4419.jpg", alt: "Golfer scanning the Get Lucky Hole-in-One Challenge signage", span: "aspect-square" },
                { src: "IMG_4654.jpg", alt: "Golfer celebrating a shot at the activation", span: "aspect-square" },
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
                Real moments, real reactions, real prizes — from golf days around
                the country.
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
                Host A School Fundraiser
              </h2>
              <p className="text-cream/70 mt-4 max-w-lg mx-auto">
                Tell us about your school and what you&apos;re raising for. An
                activation specialist will be in touch within 24 hours to set up
                your fundraising golf day.
              </p>
            </div>

            <div className="bg-cream rounded-3xl shadow-xl p-6 sm:p-10">
              <SchoolForm />
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
