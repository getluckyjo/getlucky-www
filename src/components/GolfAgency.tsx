import Image from "next/image";
import { SITE } from "@/lib/constants";
import {
  Target,
  Tv,
  Globe,
  CalendarCheck,
  Sparkles,
  Users,
  Clock,
  TrendingUp,
  Briefcase,
  BarChart3,
  MapPin,
  Gem,
  Hourglass,
  Network,
  Trophy,
} from "lucide-react";

const audienceStats = [
  { icon: Users, value: "153K+", label: "Registered Golfers in SA" },
  { icon: BarChart3, value: "4.18M", label: "Rounds Played Per Year" },
  { icon: MapPin, value: "420+", label: "Courses Nationwide" },
  { icon: TrendingUp, value: "R14M+", label: "Avg Golfer Net Worth" },
  { icon: Clock, value: "4+ Hrs", label: "Captive Attention Per Round" },
  { icon: Briefcase, value: "47%", label: "Business Decision-Makers" },
];

const platforms = [
  {
    icon: Target,
    name: "Hole-in-One Challenge",
    type: "On-Course Activation",
    description:
      "Branded signage, tee boxes, and prize boards at 20+ premium courses. Solar-powered cameras capture every attempt. Seen by thousands of golfers every month — in a relaxed, premium environment with unmatched dwell time.",
    highlights: ["20+ live courses", "Camera-verified exposure", "Branded tee box signage"],
  },
  {
    icon: Tv,
    name: "The Get Lucky Golf Show",
    type: "Digital Content & Entertainment",
    description:
      "A high-energy YouTube series where top SA celebrities take 100 shots to ace a hole-in-one for charity. Hosted by Nick Hamman. Sponsor integration across signage, apparel, digital overlays, and natural host callouts.",
    highlights: ["Celebrity-driven reach", "Multi-platform distribution", "Charity brand alignment"],
  },
  {
    icon: Globe,
    name: "Golf Site Pro",
    type: "Golf Club Digital Platform",
    description:
      "AI-powered websites for SA golf clubs — free, mobile-optimised, and live within 24 hours. Gives brands a digital presence across SA's golf club network with banner placements, sponsored content, and integrated promotions.",
    highlights: ["420+ club network", "Digital ad placements", "Golfer audience data"],
  },
  {
    icon: CalendarCheck,
    name: "Golf Day Pro",
    type: "Event & Booking Platform",
    description:
      "The cloud-based platform powering golf day bookings across South Africa. From corporate days to charity events — sponsors reach golfers at the point of booking with branded confirmations, event partnerships, and pre-round promotions.",
    highlights: ["Event sponsor integration", "Corporate golf day reach", "Booking-level targeting"],
  },
  {
    icon: Sparkles,
    name: "Custom Golf Marketing Campaign",
    type: "Bespoke Strategy & Creative",
    description:
      "Tailor-made campaigns built around your brand objectives. With over 30 years of combined experience marketing to South Africa's most affluent audiences, our team designs end-to-end golf activations — strategy, creative, media, and execution — that reach high-net-worth decision-makers where they spend their time. From concept to on-course delivery, every campaign is engineered for measurable brand lift.",
    highlights: ["30+ years of premium-brand experience", "Strategy, creative & media planning", "Full campaign execution"],
  },
];

const team = [
  {
    name: "Johannes le Roux",
    role: "Account Director",
    image: "/images/team/johannes.jpeg",
    imagePosition: "center top",
    bio: "Founder of Get Lucky Golf. Johannes leads brand partnerships end-to-end — from first conversation to live activation — and personally manages every relationship with sponsors, courses, and corporate clients. His background spans technology, marketing, and the premium consumer space.",
  },
  {
    name: "Andrew Davenport",
    role: "Creative Director",
    image: "/images/team/andrew.jpeg",
    imagePosition: "center 25%",
    bio: "Andrew leads creative across the Get Lucky portfolio — from on-course activations and event identities to the look and feel of The Get Lucky Golf Show. With decades of experience in premium and lifestyle brands, he sets the visual standards that make every sponsor touchpoint feel considered and on-brand.",
  },
];

type Brand =
  | { name: string; logo: string; width: number; height: number }
  | { name: string; wordmark: string; className?: string };

const brandsWorkedWith: Brand[] = [
  { name: "Indwe", logo: "/logos/brands/indwe.svg", width: 162, height: 40 },
  { name: "Santam", logo: "/logos/brands/santam.svg", width: 138, height: 50 },
  { name: "Shanky's Whip", logo: "/logos/brands/shankys-whip.svg", width: 176, height: 77 },
  { name: "Blue Label Telecoms", logo: "/logos/brands/blue-label-telecoms.png", width: 110, height: 85 },
  { name: "Sun International", logo: "/logos/brands/sun-international.svg", width: 122, height: 60 },
  { name: "FlySafair", logo: "/logos/brands/flysafair.png", width: 200, height: 68 },
];

const brandBenefits = [
  {
    icon: Gem,
    title: "Premium, Affluent Audience",
    text: "Golfers are among the highest-net-worth sporting audiences globally. In SA, the average golfer's net worth exceeds R14 million — senior decision-makers who influence corporate purchasing.",
  },
  {
    icon: Hourglass,
    title: "4+ Hours of Captive Attention",
    text: "No other sport offers this kind of uninterrupted brand exposure. A round of golf is 4+ hours in a relaxed, positive environment where brand recall is significantly higher than digital ads.",
  },
  {
    icon: Network,
    title: "Multi-Touchpoint Campaigns",
    text: "Brand recall compounds when your message lands across the round, the booking, and the content. One plan, consolidated reporting — no agency-of-record juggling.",
  },
  {
    icon: Trophy,
    title: "SA's Only Integrated Golf Agency",
    text: "No other agency in South Africa packages on-course activations, digital content, club technology, and event management into a single offering. We own the infrastructure.",
  },
];

type Props = {
  /**
   * "section" (default) — renders the existing mailto CTA block. Used when
   * GolfAgency is embedded on the homepage as a scroll-to section.
   * "page" — replaces the mailto CTA with anchor links to "#enquire" so the
   * dedicated /agency page can scroll to its inline form instead of opening
   * the visitor's mail client (much higher conversion for paid traffic).
   */
  variant?: "section" | "page";
};

export default function GolfAgency({ variant = "section" }: Props) {
  const isPage = variant === "page";
  return (
    <section
      id="agency"
      className={`${
        isPage ? "pt-32 pb-24 sm:pt-40 sm:pb-32" : "py-24 sm:py-32"
      } bg-charcoal relative overflow-hidden`}
    >
      {isPage && (
        <div className="absolute inset-x-0 top-0 h-[680px] sm:h-[820px] pointer-events-none">
          <Image
            src="/images/agency-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/55 to-charcoal" />
        </div>
      )}

      {/* Subtle accent glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-green/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest">
            For Brands &amp; Sponsors
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-white mt-3 uppercase tracking-wide">
            The Get Lucky
            <span className="text-gold"> Golf Agency</span>
          </h2>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            South Africa&apos;s only integrated golf marketing platform. Five
            channels. One premium audience. Reach the golfers that matter — on
            the course, on screen, at booking, across club websites, and
            through bespoke campaigns built end-to-end.
          </p>
        </div>

        {/* Audience stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
          {audienceStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/8 rounded-xl p-4 text-center"
            >
              <stat.icon className="w-5 h-5 text-gold/60 mx-auto mb-2" />
              <p className="text-2xl sm:text-3xl font-black text-gold">
                {stat.value}
              </p>
              <p className="text-white/60 text-xs mt-1 leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Platforms */}
        <div className="mb-20">
          <h3 className="text-white text-lg font-bold text-center mb-3 uppercase tracking-wider">
            Our Platforms
          </h3>
          <p className="text-white/60 text-sm text-center mb-10 max-w-lg mx-auto">
            Five channels. One golfer journey.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {platforms.map((platform, idx) => (
              <div
                key={platform.name}
                className={`bg-white/5 border border-white/8 rounded-2xl p-8 hover:border-gold/20 transition-colors group ${
                  idx === platforms.length - 1 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gold/15 transition-colors">
                    <platform.icon className="w-7 h-7 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white text-lg font-bold">
                      {platform.name}
                    </h4>
                    <p className="text-gold/60 text-xs font-semibold uppercase tracking-wider mt-0.5">
                      {platform.type}
                    </p>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mt-5">
                  {platform.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {platform.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-[11px] font-medium text-gold/70 bg-gold/8 border border-gold/15 rounded-full px-3 py-1"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brands we've worked with */}
        <div className="mb-20">
          <h3 className="text-white text-lg font-bold text-center mb-3 uppercase tracking-wider">
            Brands We&apos;ve Worked With
          </h3>
          <p className="text-white/60 text-sm text-center mb-10 max-w-lg mx-auto">
            Premium and lifestyle brands have trusted the Get Lucky team to
            reach South Africa&apos;s affluent audience.
          </p>
          <div className="bg-white/5 border border-white/8 rounded-2xl px-6 py-8 sm:px-10 sm:py-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 items-center gap-x-6 gap-y-8">
              {brandsWorkedWith.map((brand) => (
                <BrandLogo key={brand.name} brand={brand} />
              ))}
            </div>
          </div>
        </div>

        {/* Why brands choose golf */}
        <div className="mb-16">
          <h3 className="text-white text-lg font-bold text-center mb-3 uppercase tracking-wider">
            Why Brands Choose Golf
          </h3>
          <p className="text-white/60 text-sm text-center mb-10 max-w-lg mx-auto">
            Golf delivers what digital can&apos;t — extended, high-quality
            attention from an audience with real purchasing power.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {brandBenefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-gold" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 border-l border-gold/20 pl-5">
                  <h4 className="text-white font-bold text-sm mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {benefit.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div className="mb-20">
          <h3 className="text-white text-lg font-bold text-center mb-3 uppercase tracking-wider">
            Meet the Team
          </h3>
          <p className="text-white/60 text-sm text-center mb-10 max-w-lg mx-auto">
            The senior team you&apos;ll work with from the first brief to the
            final activation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white/5 border border-white/8 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6"
              >
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden flex-shrink-0 ring-1 ring-white/10">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 640px) 144px, 128px"
                    style={{ objectPosition: member.imagePosition }}
                    className="object-cover grayscale contrast-[1.05]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between flex-wrap gap-x-4 gap-y-1">
                    <h4 className="text-white text-xl font-bold">
                      {member.name}
                    </h4>
                    <p className="text-gold/70 text-xs font-semibold uppercase tracking-wider">
                      {member.role}
                    </p>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mt-4">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-white/50 text-sm mb-6">
            Interested in reaching South Africa&apos;s most valuable sporting audience?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={
                variant === "page"
                  ? "#enquire"
                  : `mailto:${SITE.partnershipsEmail}?subject=Golf%20Agency%20Partnership%20Enquiry`
              }
              className="inline-block bg-gold hover:bg-gold-light text-charcoal font-bold text-lg px-10 py-4 rounded-full transition-all hover:scale-105"
            >
              Partner With the Agency
            </a>
            <a
              href={`${SITE.whatsapp}?text=${encodeURIComponent(
                "Hi Johannes — I'd like to chat about the Get Lucky Golf Agency."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-2 border-white/15 hover:border-white/30 text-white font-medium text-lg px-10 py-4 rounded-full transition-all"
            >
              WhatsApp the Founder
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandLogo({ brand }: { brand: Brand }) {
  if ("logo" in brand) {
    return (
      <div className="flex items-center justify-center h-12 sm:h-14 px-2">
        <Image
          src={brand.logo}
          alt={brand.name}
          width={brand.width}
          height={brand.height}
          unoptimized
          className="max-h-full w-auto max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity [filter:brightness(0)_invert(1)]"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-14 sm:h-16 px-2">
      <span
        className={`text-white/70 hover:text-white transition-colors ${
          brand.className ?? "font-heading uppercase tracking-wide text-xl sm:text-2xl"
        }`}
      >
        {brand.wordmark}
      </span>
    </div>
  );
}
