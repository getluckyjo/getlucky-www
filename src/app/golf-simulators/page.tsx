import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SimulatorForm from "@/components/forms/SimulatorForm";
import SimulatorRevenueCalculator from "@/components/SimulatorRevenueCalculator";
import IndweBannerStrip from "@/components/IndweBannerStrip";
import {
  TrendingUp,
  Trophy,
  MonitorSmartphone,
  CheckCircle2,
  Megaphone,
  Sparkles,
  Shield,
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
    title: "10% Revenue Share",
    body: "Players pay R149 for 3 shots — and your venue keeps 10% of every swing. No setup fee, no upfront cost. Passive revenue on the simulator you already own.",
  },
  {
    icon: Trophy,
    title: "R100,000 Cash Prize",
    body: "A real R100,000 hole-in-one prize, fully underwritten by Indwe Risk Services. The payout is guaranteed and your venue carries zero liability.",
  },
  {
    icon: MonitorSmartphone,
    title: "Runs On Your Sim",
    body: "The challenge runs on the simulator you already have. We configure the challenge hole and settings — no new hardware, no disruption to your bookings.",
  },
  {
    icon: CheckCircle2,
    title: "Instant Verification",
    body: "Your simulator's own shot tracking confirms a hole-in-one automatically — so a win is instant, accurate and indisputable, every single time.",
  },
  {
    icon: Megaphone,
    title: "Marketing & Footfall",
    body: "A R100,000 prize is a reason to visit. We promote your venue across our channels and partner network, driving new players and repeat bookings.",
  },
  {
    icon: Sparkles,
    title: "Turnkey Setup",
    body: "Signage, staff briefing, branded assets and full activation support. We handle the admin and the payout — you just switch it on and earn.",
  },
];

export default function GolfSimulatorsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative bg-green-dark overflow-hidden pt-28 sm:pt-32 pb-20 sm:pb-28">
          <Image
            src="/images/golf-simulator.jpg"
            alt="Golfer mid-swing at a Get Lucky branded golf simulator"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-dark/70 via-green-dark/80 to-green-dark" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              For Golf Simulators · Anywhere in South Africa
            </span>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl text-cream mt-6 uppercase tracking-wide leading-[0.95]">
              Add A R100,000{" "}
              <span className="text-gold">Hole-in-One Challenge</span> To Your Sim
            </h1>

            <p className="text-base sm:text-xl text-cream/80 mt-6 max-w-2xl mx-auto leading-relaxed">
              Players pay{" "}
              <span className="text-gold font-bold">R149 for 3 shots</span> at a
              hole-in-one to win{" "}
              <span className="text-gold font-bold">R100,000 cash</span> — and your
              venue keeps{" "}
              <span className="text-gold font-bold">10% of every swing</span>. The
              prize is fully underwritten by Indwe. No cost, no risk. We run it —
              you earn.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#earn"
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
                Prize underwritten by{" "}
                <span className="text-cream/90 font-medium">Indwe Risk Services</span>{" "}
                · FSP 3425
              </p>
            </div>
          </div>
        </section>

        {/* HEADLINE SPONSOR */}
        <IndweBannerStrip src="/indwe-banner-corporate/index.html" />

        {/* CALCULATOR */}
        <section id="earn" className="py-20 sm:py-28 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                See What You Could Earn
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-green-dark mt-3 uppercase tracking-wide">
                Your Revenue At 10%
              </h2>
              <p className="text-charcoal-light/80 mt-4">
                Drag in how many swings you&apos;d expect each month. Your live
                revenue estimate updates as you go — no calls, no back-and-forth.
              </p>
            </div>

            <SimulatorRevenueCalculator />

            <div className="mt-8 grid sm:grid-cols-3 gap-4 text-sm">
              {[
                "You keep 10% of every swing sold",
                "Prize fully underwritten by Indwe — zero risk",
                "Runs on the sim you already own",
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

        {/* WHAT YOU GET */}
        <section className="py-20 sm:py-28 bg-green-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                What&apos;s Included
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-cream mt-3 uppercase tracking-wide">
                A New Revenue Line, Switched On
              </h2>
              <p className="text-cream/70 mt-4">
                The challenge slots straight into your existing simulator. We set it
                up, brand it, market it and handle the prize — you add a
                show-stopping reason to play and keep 10% of every swing.
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

        {/* ENQUIRY FORM */}
        <section id="enquire" className="py-20 sm:py-28 bg-green-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                Lock It In
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-cream mt-3 uppercase tracking-wide">
                Add It To Your Sim
              </h2>
              <p className="text-cream/70 mt-4 max-w-lg mx-auto">
                Tell us about your venue. A Get Lucky specialist will be in touch
                within 24 hours to set up the challenge on your simulator.
              </p>
            </div>

            <div className="bg-cream rounded-3xl shadow-xl p-6 sm:p-10">
              <SimulatorForm />
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
