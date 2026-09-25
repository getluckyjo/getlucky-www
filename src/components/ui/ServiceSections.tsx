import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import SectionHeader from "./SectionHeader";
import FeatureGrid, { type Feature } from "./FeatureGrid";
import PhotoGallery, { type Photo } from "./PhotoGallery";
import VideoFrame from "./VideoFrame";

/**
 * The three middle sections every service page shares: the live calculator,
 * what's included, and the proof (film plus photos). Pages pass their own
 * words; the rhythm stays the same so the site reads as one product.
 */

export function CalculatorSection({
  id = "build",
  kicker,
  title,
  lede,
  checks,
  children,
}: {
  id?: string;
  kicker: ReactNode;
  title: ReactNode;
  lede: ReactNode;
  checks: readonly string[];
  children: ReactNode;
}) {
  return (
    <section id={id} className="section bg-paper scroll-mt-20">
      <div className="wrap">
        <SectionHeader kicker={kicker} title={title} lede={lede} />
        <div className="reveal mt-12">{children}</div>
        <ul className="mt-8 grid sm:grid-cols-3 gap-3 text-[14px]">
          {checks.map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-ink/80">
              <CheckCircle2 className="w-4 h-4 text-green shrink-0 mt-0.5" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function IncludedSection({
  kicker = "What's included",
  title,
  lede,
  items,
  children,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  lede: ReactNode;
  items: readonly Feature[];
  /** Anything that belongs under the grid, e.g. a rules note. */
  children?: ReactNode;
}) {
  return (
    <section className="on-dark section relative isolate overflow-hidden bg-green-dark text-white">
      <div aria-hidden className="dot-grid absolute inset-0 -z-10 opacity-60" />
      <div className="wrap">
        <SectionHeader kicker={kicker} title={title} lede={lede} dark />
        <div className="mt-12">
          <FeatureGrid items={items} dark />
        </div>
        {children}
      </div>
    </section>
  );
}

export function ShowcaseSection({
  kicker = "See it in action",
  title = "A day with Get Lucky",
  lede,
  photos,
}: {
  kicker?: ReactNode;
  title?: ReactNode;
  lede: ReactNode;
  photos?: readonly Photo[];
}) {
  return (
    <section className="section bg-white">
      <div className="wrap">
        <SectionHeader kicker={kicker} title={title} lede={lede} />
        <div className="mt-12">
          <VideoFrame />
        </div>
        {photos && photos.length > 0 && (
          <div className="mt-3">
            <PhotoGallery photos={photos} />
          </div>
        )}
      </div>
    </section>
  );
}
