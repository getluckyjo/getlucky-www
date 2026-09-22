import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SponsorLogo from "@/components/SponsorLogo";
import { PGA_GOLF_SHOW, ROUTES } from "@/lib/constants";
import { isDbConfigured, getEntry, entryToSheet } from "@/lib/db";

export const metadata: Metadata = {
  title: `You're In — ${PGA_GOLF_SHOW.name}`,
  robots: { index: false, follow: false },
};

/**
 * /pga-golf-show/success — after a paid R100 show entry.
 *
 * Its own page rather than /form/success because everything on that one is
 * wrong here: it is dressed in our colours instead of the show's, and it sends
 * the golfer to /form, which asks for a course off the affiliated list. A
 * golfer standing at the stand needs the show's page and the show's form.
 */
export default async function PgaGolfShowSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const ref = params.ref || "";

  // Best-effort: the prize and the name are decoration. A golfer who has paid
  // should never see a failure page because a lookup did not resolve, so both
  // sources are allowed to come back empty and the reference stands alone.
  let row: Record<string, string> | null = null;
  if (ref && isDbConfigured()) {
    try {
      const rec = await getEntry(ref);
      row = rec ? entryToSheet(rec) : null;
    } catch {
      // Postgres did not answer — render minimally.
    }
  }

  const prize = row?.Prize || PGA_GOLF_SHOW.paidEntry.prize;
  const name = row?.Name || "";

  return (
    <main className="pga-theme min-h-screen bg-cream text-green">
      <div className="bg-green-dark border-b-4 border-green">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3 text-white">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
            {PGA_GOLF_SHOW.name}
          </p>
          <p className="eyebrow eyebrow--dark whitespace-nowrap">
            {PGA_GOLF_SHOW.dates}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-7 sm:pt-10">
        <div className="flex items-center justify-center gap-5 sm:gap-7">
          <SponsorLogo
            name={PGA_GOLF_SHOW.showLogo.name}
            file={PGA_GOLF_SHOW.showLogo.file}
            height={88}
            wordmarkClassName="text-2xl text-green-dark"
          />
          <div className="h-16 w-px bg-green-dark/25" aria-hidden />
          <Image
            src="/brand/logo-lockup.svg"
            alt="Get Lucky Hole-in-One Challenge"
          width={552}
          height={588}
          unoptimized
            className="h-20 sm:h-24 w-auto flex-shrink-0"
            priority
          />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-7 pb-10">
        <div className="card bg-white shadow-green-dark/10 border-t-4 border-green p-6 sm:p-8 rounded-xl card--hover">
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-green text-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-7 h-7" aria-hidden>
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <h1 className="text-center font-heading text-3xl sm:text-4xl text-green uppercase">
            You&apos;re In
          </h1>
          {name && (
            <p className="text-center text-sm text-charcoal-light/70 mt-2">{name}</p>
          )}
          <p className="text-center text-sm text-charcoal-light/80 mt-3 leading-relaxed">
            Payment received. Show this screen at the stand and take your shot.
          </p>

          <dl className="mt-6 bg-cream/60 rounded-xl divide-y divide-green-dark/10 text-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <dt className="text-charcoal-light/70 font-semibold uppercase tracking-wider text-xs">Win</dt>
              <dd className="text-green font-bold">{prize}</dd>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <dt className="text-charcoal-light/70 font-semibold uppercase tracking-wider text-xs">Where</dt>
              <dd className="text-green font-medium text-right">{PGA_GOLF_SHOW.name}</dd>
            </div>
          </dl>

          {ref && (
            <div className="mt-5 text-center">
              <p className="eyebrow mb-1">Reference</p>
              <p className="font-mono text-base text-green font-bold tracking-wider">{ref}</p>
            </div>
          )}

          <Link
            href={ROUTES.pgaGolfShow}
            className="btn-lime mt-6 w-full text-center"
          >
            Enter Another Player
          </Link>
        </div>
      </div>

      <footer className="max-w-md mx-auto px-4 pb-10 text-center text-[11px] text-green/60 space-x-3">
        <span>&copy; {new Date().getFullYear()} Get Lucky Golf Club (Pty) Ltd</span>
        <Link href={ROUTES.terms} className="underline hover:text-green">Terms</Link>
        <Link href={ROUTES.privacy} className="underline hover:text-green">Privacy</Link>
      </footer>
    </main>
  );
}
