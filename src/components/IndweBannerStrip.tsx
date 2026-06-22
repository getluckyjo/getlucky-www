/**
 * Indwe Risk Services headline-sponsor banner strip.
 *
 * Renders one of the self-contained animated banner creatives that live under
 * /public/indwe-banner*. Pass `src` to choose which creative shows — each page
 * uses a different message (homepage: "your handicap changes"; corporate golf
 * days: "built something worth protecting"; partner courses: "SA's oldest
 * broker, est. 1903"). Matches the 1600×333 lockup used in the homepage hero.
 */
export default function IndweBannerStrip({ src }: { src: string }) {
  return (
    <div className="bg-white py-4 sm:py-5">
      <div className="max-w-3xl mx-auto px-6">
        {/*
          The creative is a wide 1600×333 lockup. On a phone that ratio is only
          ~70px tall and the two-line copy slides get clipped, so we give the
          frame a taller ratio on small screens and snap back to the wide lockup
          from sm up.
        */}
        <iframe
          src={src}
          title="Indwe Risk Services — Headline Sponsor"
          loading="lazy"
          className="w-full block border-0 aspect-[5/3] sm:aspect-[1600/333]"
        />
      </div>
    </div>
  );
}
