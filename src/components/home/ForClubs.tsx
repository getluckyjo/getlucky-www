import Link from "next/link";
import { ArrowRight, Camera, Download, Megaphone, Shield, ShieldCheck, TrendingUp, Wrench } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import FeatureGrid from "@/components/ui/FeatureGrid";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Zero cost, zero risk",
    body: "No setup fees. No financial liability. We invest in all infrastructure — cameras, signage, insurance, and tech. Your course earns revenue from day one.",
  },
  {
    icon: TrendingUp,
    title: "New revenue stream",
    body: "Earn a share of every swing sold on your course. A permanent, passive income line that grows as participation increases — with zero operational overhead.",
  },
  {
    icon: Shield,
    title: "Insurance-backed prizes",
    body: "All prizes from R25,000 to R1,000,000 are fully underwritten by Santam and structured by Indwe Risk Services (FSP 3425). Zero balance sheet exposure for your club.",
  },
  {
    icon: Camera,
    title: "Premium camera infrastructure",
    body: "We install solar-powered 4G cameras on your challenge hole at our cost. Every attempt is captured and verified automatically — no staff involvement required.",
  },
  {
    icon: Megaphone,
    title: "National marketing",
    body: "Your course gets featured in nationwide Get Lucky campaigns. Professional signage, branded tee boxes, and weekly ambassador activations drive new golfers to your club.",
  },
  {
    icon: Wrench,
    title: "Turnkey setup",
    body: "We handle everything — installation, signage, tech, insurance, marketing, and prize fulfilment. Your team does nothing except welcome more golfers.",
  },
];

/**
 * The pitch to golf clubs, on the forest panel: a sticky header with both
 * actions on the left, the six reasons as a spec list on the right.
 */
export default function ForClubs() {
  return (
    <section className="on-dark section bg-green-dark text-white relative isolate overflow-hidden" aria-labelledby="clubs-title">
      <div aria-hidden className="dot-grid absolute inset-0 -z-10 opacity-60" />
      <div className="wrap grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-12 lg:gap-16">
        <div className="reveal lg:sticky lg:top-28 self-start lg:pt-7">
          <span className="kicker kicker--dark">For golf clubs &amp; course managers</span>
          <h2 id="clubs-title" className="display-lg mt-4">
            Why golf clubs partner with us
          </h2>
          <p className="lede lede--dark mt-5">
            A permanent activation on your par‑3 — at zero cost to your club.
            You earn revenue. We handle everything.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row lg:flex-col items-start gap-3">
            <Link href={ROUTES.partner} className="btn-lime btn-lime--dark">
              Become a partner course
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="/GLG_Golf_Course_Proposal_2026.pdf" download className="btn-outline btn-outline--dark">
              <Download className="w-4 h-4" />
              Course proposal
            </a>
          </div>
        </div>

        <FeatureGrid items={benefits} dark columns={2} />
      </div>
    </section>
  );
}
