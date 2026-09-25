/**
 * Indwe Risk Services headline-sponsor banner strip.
 *
 * Renders one of the self-contained animated banner creatives that live under
 * /public/indwe-banner*. Pass `src` to choose which creative shows — each page
 * uses a different message (homepage: "your handicap changes"; corporate golf
 * days: "built something worth protecting"; partner courses: "SA's oldest
 * broker, est. 1903"). Sits in a plain white band with a hairline under it,
 * so the sponsor gets clean air and nothing competes with the creative.
 */
export default function IndweBannerStrip({ src }: { src: string }) {
  return (
    <section aria-label="Headline sponsor" className="bg-white border-b border-line">
      <div className="wrap py-5 sm:py-7">
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
          className="mx-auto w-full max-w-3xl block border-0 aspect-[5/3] sm:aspect-[1600/333]"
        />
      </div>
    </section>
  );
}
