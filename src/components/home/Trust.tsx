import Image from "next/image";
import { BadgeCheck, Camera, ShieldCheck } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const proofs = [
  {
    icon: ShieldCheck,
    title: "Insured, not promised",
    body: "All prizes from R25,000 to R1,000,000 are fully underwritten by Santam and structured by Indwe Risk Services (FSP 3425).",
  },
  {
    icon: Camera,
    title: "Every swing on camera",
    body: "Solar-powered 4G cameras capture every attempt automatically. No disputes, no staff involvement.",
  },
  {
    icon: BadgeCheck,
    title: "Paid in 15 working days",
    body: "Verified hole-in-ones are paid out within 15 working days.",
  },
];

const stats = [
  { value: "100+", label: "Years in insurance" },
  { value: "65,000+", label: "Clients nationwide" },
  { value: "R2B+", label: "Underwritten annually" },
];

/**
 * Why the million is real: the three proofs, then the headline sponsor —
 * the founder's words on the partnership and Indwe's own numbers.
 */
export default function Trust() {
  return (
    <section className="section bg-paper" aria-labelledby="trust-title">
      <div className="wrap">
        <SectionHeader
          kicker="Headline sponsor"
          title={<span id="trust-title">Real prizes. Insured before you swing.</span>}
          lede="A hole-in-one is the rarest shot in golf. When you make it, the money has to be there — so every rand of every prize is underwritten before you swing."
        />

        <div className="mt-14 grid md:grid-cols-3 gap-3">
          {proofs.map((p) => (
            <div key={p.title} className="reveal card p-7">
              <span className="icon-disc">
                <p.icon className="w-5 h-5" />
              </span>
              <h3 className="mt-6 text-[17px] font-semibold tracking-[-0.01em] text-ink">
                {p.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>

        {/* The partnership */}
        <div className="reveal mt-3 card p-7 sm:p-10 grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 lg:gap-14 items-center">
          <figure>
            <div className="flex items-center gap-4">
              <Image
                src="/logos/brands/indwe.svg"
                alt="Indwe Risk Services"
                width={140}
                height={40}
                className="h-8 w-auto"
              />
              <span className="text-ink/25">×</span>
              <span className="font-heading text-lg text-green">Get Lucky Golf</span>
            </div>
            <blockquote className="mt-7 text-[19px] sm:text-[22px] leading-[1.45] tracking-[-0.01em] text-ink">
              &ldquo;We&apos;re proud to welcome Indwe Risk Services as our
              headline sponsor. Indwe&apos;s focus on confidence, expertise,
              and protecting life&apos;s defining moments aligns seamlessly
              with our mission to make golf more exciting, rewarding, and
              accessible for amateur players across South Africa.&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <Image
                src="/images/team/andrew.jpeg"
                alt=""
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover"
              />
              <span className="text-[14px]">
                <span className="block font-semibold text-ink">Andrew Davenport</span>
                <span className="block text-muted">Founder, Get Lucky Golf</span>
              </span>
            </figcaption>
          </figure>

          <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted mb-2 sm:mb-4 lg:mb-0 lg:pl-10">
            Indwe Risk Services in numbers
          </p>
          <dl className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:gap-4 sm:divide-y-0 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:border-l lg:border-line lg:pl-10">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end py-4 sm:py-0 lg:py-5">
                <dt className="mt-1.5 text-[12px] sm:text-[13px] text-muted">{s.label}</dt>
                <dd className="font-heading text-3xl sm:text-4xl text-green leading-none">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
          </div>
        </div>

        <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
          <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            Prizes underwritten by
          </span>
          <Image
            src="/logos/brands/santam.svg"
            alt="Santam"
            width={120}
            height={32}
            className="h-6 w-auto grayscale"
          />
          <Image
            src="/logos/brands/indwe.svg"
            alt="Indwe Risk Services"
            width={120}
            height={32}
            className="h-6 w-auto grayscale"
          />
        </div>
      </div>
    </section>
  );
}
