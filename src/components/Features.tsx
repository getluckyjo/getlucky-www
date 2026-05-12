import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  Shield,
  Camera,
  Megaphone,
  Wrench,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Zero Cost, Zero Risk",
    description:
      "No setup fees. No financial liability. We invest in all infrastructure — cameras, signage, insurance, and tech. Your course earns revenue from day one.",
  },
  {
    icon: TrendingUp,
    title: "New Revenue Stream",
    description:
      "Earn a share of every swing sold on your course. A permanent, passive income line that grows as participation increases — with zero operational overhead.",
  },
  {
    icon: Shield,
    title: "Insurance-Backed Prizes",
    description:
      "All prizes from R25,000 to R1,000,000 are fully underwritten by Santam and structured by Indwe Risk Services (FSP 3425). Zero balance sheet exposure for your club.",
  },
  {
    icon: Camera,
    title: "Premium Camera Infrastructure",
    description:
      "We install solar-powered 4G cameras on your challenge hole at our cost. Every attempt is captured and verified automatically — no staff involvement required.",
  },
  {
    icon: Megaphone,
    title: "National Marketing",
    description:
      "Your course gets featured in nationwide Get Lucky campaigns. Professional signage, branded tee boxes, and weekly ambassador activations drive new golfers to your club.",
  },
  {
    icon: Wrench,
    title: "Turnkey Setup",
    description:
      "We handle everything — installation, signage, tech, insurance, marketing, and prize fulfilment. Your team does nothing except welcome more golfers.",
  },
];

export default function Features() {
  return (
    <section className="py-24 sm:py-32 bg-cream-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-green text-xs font-semibold uppercase tracking-widest">
            For Golf Clubs &amp; Course Managers
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-green-dark mt-3 uppercase tracking-wide">
            Why Golf Clubs
            <span className="text-gold"> Partner With Us</span>
          </h2>
          <p className="text-green-dark/60 mt-4 max-w-lg mx-auto">
            A permanent activation on your par-3 — at zero cost to your club.
            You earn revenue. We handle everything.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white border border-green-dark/8 rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-green/10 rounded-xl flex items-center justify-center mb-5">
                <benefit.icon className="w-7 h-7 text-green" />
              </div>
              <h3 className="text-lg font-bold text-green-dark mb-2">
                {benefit.title}
              </h3>
              <p className="text-green-dark/60 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={ROUTES.partner}
            className="inline-block bg-green hover:bg-green-light text-cream font-bold text-lg px-10 py-4 rounded-full transition-all hover:scale-105"
          >
            Become a Partner Course
          </Link>
          <a
            href="/GLG_Golf_Course_Proposal_2026.pdf"
            download
            className="inline-block border-2 border-green/20 hover:border-green/40 text-green-dark font-medium text-lg px-10 py-4 rounded-full transition-all"
          >
            Download Course Proposal
          </a>
        </div>
      </div>
    </section>
  );
}
