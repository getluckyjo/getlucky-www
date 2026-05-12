import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { readSubmissions } from "@/lib/sheets";

export const metadata: Metadata = {
  title: "You're In",
  robots: { index: false, follow: false },
};

/**
 * /form/success — confirmation after a successful PayFast course-entry payment.
 * Memberships don't land here — they redirect to the membership site's own
 * success page (membership.getluckygolfclub.com/join/{slug}/success) so the
 * member sees the same confirmation flow as any other Club signup.
 */
export default async function FormSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const ref = params.ref || "";

  // Best-effort lookup of the entry row so we can show course + prize.
  // If the Sheet isn't reachable we degrade gracefully and just show the ref.
  let row: Record<string, string> | null = null;
  if (ref) {
    try {
      const rows = await readSubmissions("entry");
      row = rows.find((r) => r.Reference === ref) || null;
    } catch {
      // Apps Script unreachable — render minimally.
    }
  }

  const prize = row?.Prize || "";
  const course = row?.Course || "";
  const name = row?.Name || "";

  return (
    <main className="min-h-screen relative">
      {/* Hero background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-bg.avif"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-dark/85 via-green-dark/65 to-green-dark/90" />
      </div>

      {/* Logo */}
      <div className="flex justify-center pt-8 sm:pt-12 pb-2 px-4">
        <Image
          src="/logos/challenge-bordered.png"
          alt="Get Lucky Hole-in-One Challenge"
          width={420}
          height={420}
          className="h-32 sm:h-40 w-auto drop-shadow-xl"
          priority
        />
      </div>

      {/* Success card */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="text-center mb-6">
          <h1 className="font-heading text-3xl sm:text-4xl text-cream uppercase tracking-wide drop-shadow-md">
            You&apos;re In
          </h1>
          <p className="text-sm text-cream/85 mt-2 leading-relaxed drop-shadow">
            Entry received. Take your best shot and have a great round.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-white/40 p-6 sm:p-8">
          {/* Big checkmark */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-green text-cream flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="w-7 h-7"
                aria-hidden
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {name && (
            <p className="text-center text-sm text-charcoal-light/70 mb-1">Welcome,</p>
          )}
          {name && (
            <p className="text-center font-heading text-xl text-green-dark uppercase tracking-wide mb-5">
              {name}
            </p>
          )}

          {(course || prize) && (
            <dl className="bg-cream/60 rounded-xl divide-y divide-green-dark/10 text-sm">
              {prize && (
                <div className="flex items-center justify-between px-4 py-3">
                  <dt className="text-charcoal-light/70 font-semibold uppercase tracking-wider text-xs">Win</dt>
                  <dd className="text-gold font-bold">{prize}</dd>
                </div>
              )}
              {course && (
                <div className="flex items-center justify-between px-4 py-3">
                  <dt className="text-charcoal-light/70 font-semibold uppercase tracking-wider text-xs">Course</dt>
                  <dd className="text-green-dark font-medium text-right">{course}</dd>
                </div>
              )}
            </dl>
          )}

          {ref && (
            <div className="mt-5 text-center">
              <p className="text-xs uppercase tracking-widest text-charcoal-light/60 mb-1">Reference</p>
              <p className="font-mono text-base text-green-dark font-bold tracking-wider">{ref}</p>
            </div>
          )}

          <Link
            href="/form"
            className="mt-6 block w-full text-center bg-green hover:bg-green-light text-cream font-semibold text-sm px-6 py-3 rounded-full transition-all"
          >
            Enter Another Player
          </Link>
        </div>

        <p className="text-center text-[11px] text-cream/60 mt-4 drop-shadow">
          Need help?{" "}
          <Link href={ROUTES.terms} className="underline hover:text-cream">Terms</Link>
          {" · "}
          <a href="mailto:johannes@getluckygolfclub.com" className="underline hover:text-cream">
            Contact us
          </a>
        </p>
      </div>

      {/* Indwe sponsor banner */}
      <div className="max-w-md mx-auto px-4 pb-8 sm:pb-12">
        <div className="rounded-xl overflow-hidden border border-white/30 shadow-2xl bg-white">
          <iframe
            src="/indwe-banner/index.html"
            title="Indwe Risk Services — Headline Sponsor"
            loading="lazy"
            className="w-full block border-0"
            style={{ aspectRatio: "1600 / 333", minHeight: "170px" }}
          />
        </div>
      </div>
    </main>
  );
}
