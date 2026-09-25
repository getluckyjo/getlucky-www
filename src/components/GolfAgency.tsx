import Image from "next/image";
import { SITE } from "@/lib/constants";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureGrid, { type Feature } from "@/components/ui/FeatureGrid";
import {
  ArrowRight,
  Check,
  Gem,
  Hourglass,
  MessageCircle,
  Network,
  Sparkles,
  Target,
  Trophy,
  Tv,
} from "lucide-react";

const audienceStats = [
  { value: "153K+", label: "Registered golfers in SA" },
  { value: "4.18M", label: "Rounds played per year" },
  { value: "420+", label: "Courses nationwide" },
  { value: "R14M+", label: "Avg golfer net worth" },
  { value: "4+ Hrs", label: "Captive attention per round" },
  { value: "47%", label: "Business decision-makers" },
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
    imagePosition: "center 12%",
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
  | { name: string; logo: string; width: number; height: number; large?: boolean }
  | { name: string; wordmark: string; className?: string };

const brandsWorkedWith: Brand[] = [
  { name: "Indwe", logo: "/logos/brands/indwe.svg", width: 162, height: 40 },
  { name: "Santam", logo: "/logos/brands/santam.svg", width: 138, height: 50 },
  { name: "Shanky's Whip", logo: "/logos/brands/shankys-whip.svg", width: 176, height: 77 },
  { name: "Blue Label Telecoms", logo: "/logos/brands/blue-label-telecoms.png", width: 110, height: 85, large: true },
  { name: "Sun International", logo: "/logos/brands/sun-international.svg", width: 122, height: 60, large: true },
  { name: "FlySafair", logo: "/logos/brands/flysafair.png", width: 200, height: 68 },
];

const brandBenefits: Feature[] = [
  {
    icon: Gem,
    title: "Premium, affluent audience",
    body: "Golfers are among the highest-net-worth sporting audiences globally. In SA, the average golfer's net worth exceeds R14 million — senior decision-makers who influence corporate purchasing.",
  },
  {
    icon: Hourglass,
    title: "4+ hours of captive attention",
    body: "No other sport offers this kind of uninterrupted brand exposure. A round of golf is 4+ hours in a relaxed, positive environment where brand recall is significantly higher than digital ads.",
  },
  {
    icon: Network,
    title: "Multi-touchpoint campaigns",
    body: "Brand recall compounds when your message lands across the round, the content, and the campaign. One plan, consolidated reporting — no agency-of-record juggling.",
  },
  {
    icon: Trophy,
    title: "SA's only integrated golf agency",
    body: "No other agency in South Africa packages on-course activations, digital content, and bespoke campaigns into a single offering. We own the infrastructure.",
  },
];

type Props = {
  /**
   * "section" (default) — the partner CTAs open a mailto, for embedding the
   * agency pitch inside another page. Not used on the homepage any more;
   * the agency lives on its own page.
   * "page" — the partner CTAs are anchor links to "#enquire" so the
   * dedicated /agency page can scroll to its inline form instead of opening
   * the visitor's mail client (much higher conversion for paid traffic).
   */
  variant?: "section" | "page";
};

/**
 * The agency pitch, in five movements: a night hero with the promise and
 * the audience numbers, the three platforms as a spec sheet, the brands
 * we've worked with, why golf (the one forest panel), and the two people
 * a brand works with. The enquiry form follows on the page itself.
 */
export default function GolfAgency({ variant = "section" }: Props) {
  const isPage = variant === "page";
  const Title = isPage ? "h1" : "h2";
  const partnerHref = isPage
    ? "#enquire"
    : `mailto:${SITE.partnershipsEmail}?subject=Golf%20Agency%20Partnership%20Enquiry`;
  const whatsappHref = `${SITE.whatsapp}?text=${encodeURIComponent(
    "Hi Johannes — I'd like to chat about the Get Lucky Golf Agency."
  )}`;

  return (
    <>
      {/* ── Hero: the promise and the audience ── */}
      <section
        id="agency"
        className="on-dark relative isolate overflow-hidden bg-night text-white"
      >
        <Image
          src="/images/agency-hero.jpg"
          alt=""
          fill
          priority={isPage}
          sizes="100vw"
          className="object-cover object-[70%_center] -z-20 opacity-90"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/75 to-night/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-transparent to-night/40" />

        <div className="wrap pt-36 sm:pt-44 pb-14 sm:pb-20">
          <div className="max-w-3xl">
            <span className="chip chip--dark fade-up">
              <span className="live-dot" aria-hidden />
              For brands &amp; sponsors
            </span>
            <Title className="display-xl mt-6 fade-up-1">
              The Get Lucky <span className="text-lime">Golf Agency</span>
            </Title>
            <p className="lede lede--dark mt-6 max-w-2xl fade-up-2">
              South Africa&apos;s only integrated golf marketing platform. Three
              channels. One premium audience. Reach the golfers that matter — on
              the course, on screen, and through bespoke campaigns built
              end-to-end.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 fade-up-3">
              <a href={partnerHref} className="btn-lime btn-lime--dark">
                Partner with the agency
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline btn-outline--dark"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp the founder
              </a>
            </div>
          </div>

          <dl className="mt-14 sm:mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8 fade-up-4">
            {audienceStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col-reverse justify-end border-t border-white/15 pt-5"
              >
                <dt className="mt-2 text-xs sm:text-sm text-white/55">{stat.label}</dt>
                <dd className="font-heading text-3xl sm:text-4xl text-white leading-none">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Platforms: three channels as a spec sheet ── */}
      <section className="section bg-white" aria-labelledby="platforms-title">
        <div className="wrap">
          <SectionHeader
            kicker="Our platforms"
            title={<span id="platforms-title">Three channels. One golfer journey.</span>}
          />

          <ol className="mt-14 border-b border-line">
            {platforms.map((platform, i) => (
              <li
                key={platform.name}
                className="reveal grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-16 py-9 sm:py-11 border-t border-line"
              >
                <div className="flex items-start gap-5">
                  <span className="icon-disc icon-disc--lg">
                    <platform.icon className="w-6 h-6" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                      <span className="tabular-nums text-green">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span aria-hidden className="mx-2 text-ink/20">/</span>
                      {platform.type}
                    </p>
                    <h3 className="mt-2 text-[22px] sm:text-2xl font-semibold tracking-[-0.02em] text-ink leading-tight">
                      {platform.name}
                    </h3>
                  </div>
                </div>

                <div>
                  <p className="text-[15px] sm:text-[16px] leading-relaxed text-muted max-w-2xl">
                    {platform.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {platform.highlights.map((h) => (
                      <li key={h} className="chip">
                        <Check className="w-3.5 h-3.5 text-green" strokeWidth={2.5} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Brands we've worked with ── */}
      <section className="section--tight bg-paper" aria-labelledby="brands-title">
        <div className="wrap grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-10 lg:gap-16 items-center">
          <div className="reveal">
            <span className="kicker">Track record</span>
            <h2 id="brands-title" className="display-md text-ink mt-4">
              Brands we&apos;ve worked with
            </h2>
            <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-muted max-w-md">
              Premium and lifestyle brands have trusted the Get Lucky team to
              reach South Africa&apos;s affluent audience.
            </p>
          </div>

          <ul className="reveal grid grid-cols-2 sm:grid-cols-3 gap-px overflow-hidden rounded-3xl border border-line bg-line">
            {brandsWorkedWith.map((brand) => (
              <li key={brand.name} className="bg-white">
                <BrandLogo brand={brand} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Why brands choose golf: the forest panel ── */}
      <section
        className="on-dark section bg-green-dark text-white relative isolate overflow-hidden"
        aria-labelledby="why-golf-title"
      >
        <div aria-hidden className="dot-grid absolute inset-0 -z-10 opacity-60" />
        <div className="wrap grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-16">
          <div className="reveal lg:sticky lg:top-28 self-start lg:pt-7">
            <span className="kicker kicker--dark">Why golf</span>
            <h2 id="why-golf-title" className="display-lg mt-4">
              Why brands choose golf
            </h2>
            <p className="lede lede--dark mt-5">
              Golf delivers what digital can&apos;t — extended, high-quality
              attention from an audience with real purchasing power.
            </p>
          </div>

          <FeatureGrid items={brandBenefits} dark columns={2} />
        </div>
      </section>

      {/* ── Leadership ── */}
      <section className="section bg-white" aria-labelledby="team-title">
        <div className="wrap">
          <SectionHeader
            kicker="Leadership"
            title={<span id="team-title">Meet the team</span>}
            lede="The senior team you'll work with from the first brief to the final activation."
          />

          <div className="mt-14 grid md:grid-cols-2 gap-x-10 gap-y-14">
            {team.map((member) => (
              <article key={member.name} className="reveal">
                <div className="relative aspect-[3/2] overflow-hidden rounded-3xl bg-surface">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    style={{ objectPosition: member.imagePosition }}
                    className="object-cover grayscale contrast-[1.05]"
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between flex-wrap gap-x-4 gap-y-1">
                  <h3 className="text-xl font-semibold tracking-[-0.015em] text-ink">
                    {member.name}
                  </h3>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-green">
                    {member.role}
                  </p>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{member.bio}</p>
              </article>
            ))}
          </div>

          <div className="reveal mt-16 sm:mt-20 pt-8 border-t border-line flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <p className="text-lg sm:text-xl font-medium tracking-[-0.01em] text-ink max-w-xl">
              Interested in reaching South Africa&apos;s most valuable sporting audience?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={partnerHref} className="btn-ink">
                Partner with the agency
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp the founder
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function BrandLogo({ brand }: { brand: Brand }) {
  if ("logo" in brand) {
    return (
      <div className="flex items-center justify-center h-24 sm:h-28 px-6 sm:px-8">
        <Image
          src={brand.logo}
          alt={brand.name}
          width={brand.width}
          height={brand.height}
          unoptimized
          className={`${
            brand.large ? "max-h-12 sm:max-h-16" : "max-h-10 sm:max-h-12"
          } w-auto max-w-full object-contain [filter:brightness(0)] opacity-55 transition-opacity duration-300 hover:opacity-90`}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-24 sm:h-28 px-6">
      <span
        className={`text-ink/60 hover:text-ink transition-colors ${
          brand.className ?? "font-heading uppercase tracking-wide text-xl sm:text-2xl"
        }`}
      >
        {brand.wordmark}
      </span>
    </div>
  );
}
