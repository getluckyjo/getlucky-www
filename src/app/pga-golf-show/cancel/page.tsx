import type { Metadata } from "next";
import Link from "next/link";
import { PGA_GOLF_SHOW, ROUTES, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Payment Cancelled — ${PGA_GOLF_SHOW.name}`,
  robots: { index: false, follow: false },
};

/**
 * /pga-golf-show/cancel — a paid show entry that was abandoned at PayFast.
 *
 * The free shot is still there, so the page says so: nobody should leave the
 * stand with nothing because a card did not go through.
 */
export default function PgaGolfShowCancelPage() {
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

      <div className="max-w-md mx-auto px-4 pt-10 pb-10">
        <div className="card bg-white shadow-green-dark/10 border-t-4 border-green p-6 sm:p-8 text-center rounded-xl card--hover">
          <h1 className="font-heading text-2xl sm:text-3xl text-green uppercase mb-3">
            Payment Cancelled
          </h1>
          <p className="text-sm text-charcoal-light/80 leading-relaxed mb-6">
            No charge was made. The free shot at {PGA_GOLF_SHOW.prize} is still
            open — go back and take it, or try the {PGA_GOLF_SHOW.paidEntry.entry}{" "}
            entry again.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={ROUTES.pgaGolfShow}
              className="btn-lime"
            >
              Back to the Entry Form
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              className="btn-outline"
            >
              Need Help?
            </a>
          </div>
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
