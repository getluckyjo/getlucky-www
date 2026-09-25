import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

type Cta = { href: string; label: string };

/**
 * The hero for every service page: a course photo under a deep scrim,
 * left-aligned type, two actions, and a row of proof points along the
 * bottom edge. The prize line underneath is the same promise on every page.
 */
export default function PageHero({
  kicker,
  title,
  lede,
  image,
  imageAlt,
  primary,
  secondary,
  stats,
  trust = true,
}: {
  kicker: ReactNode;
  title: ReactNode;
  lede: ReactNode;
  image: string;
  imageAlt: string;
  primary: Cta;
  secondary?: Cta;
  stats?: { value: string; label: string }[];
  /** The Indwe underwriting line under the actions. */
  trust?: boolean;
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-night text-white">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center -z-20 opacity-55"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/80 to-night/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-transparent to-night/40" />

      <div className="wrap pt-36 sm:pt-44 pb-14 sm:pb-20">
        <div className="max-w-4xl">
          <span className="chip chip--dark fade-up">
            <span className="live-dot" aria-hidden />
            {kicker}
          </span>
          <h1 className="display-xl text-[clamp(2.5rem,5.4vw,4.75rem)] mt-6 fade-up-1">{title}</h1>
          <p className="lede lede--dark mt-6 max-w-2xl fade-up-2">{lede}</p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3 fade-up-3">
            <a href={primary.href} className="btn-lime btn-lime--dark">
              {primary.label}
              <ArrowRight className="w-4 h-4" />
            </a>
            {secondary && (
              <a href={secondary.href} className="btn-outline btn-outline--dark">
                {secondary.label}
              </a>
            )}
          </div>

          {trust && (
            <p className="mt-7 flex items-center gap-2 text-sm text-white/60 fade-up-4">
              <ShieldCheck className="w-4 h-4 text-lime shrink-0" />
              Every prize underwritten by Indwe Risk Services · FSP 3425
            </p>
          )}
        </div>

        {stats && stats.length > 0 && (
          <dl className="mt-14 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 fade-up-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end border-t border-white/15 pt-5">
                <dt className="mt-2 text-xs sm:text-sm text-white/55">{s.label}</dt>
                <dd className="font-heading text-3xl sm:text-4xl text-white leading-none">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
