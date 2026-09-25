import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, ShieldCheck } from "lucide-react";
import { PRIZE_TIERS } from "@/lib/constants";

/** The ladder in the hero card climbs in even steps, not to scale. */
const RUNG_WIDTH = [54, 62, 70, 78, 88, 100];

/**
 * The homepage hero: a course at golden hour under a deep scrim, the promise
 * in one Poster Gothic line, two actions, and, on wide screens, the prize
 * ladder as a live card beside it. Swings are bought at the tee box through
 * the QR form, so there is no buy button here.
 */
export default function HomeHero() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-night text-white">
      <Image
        src="/images/hero-bg.avif"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover -z-20"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/95 via-night/65 to-night/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/10 to-night/50" />

      <div className="wrap min-h-[100svh] lg:min-h-[860px] flex flex-col justify-center lg:justify-end pt-28 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] gap-12 lg:gap-14 items-end">
          {/* Promise */}
          <div>
            <Image
              src="/brand/logo-lockup.svg"
              alt="Get Lucky Hole-in-1 Challenge"
              width={552}
              height={588}
              unoptimized
              priority
              className="lg:hidden h-28 sm:h-32 w-auto mb-6 -rotate-3 drop-shadow-[0_14px_30px_rgba(0,0,0,0.35)] scale-in"
            />
            <span className="chip chip--dark fade-up">
              <span className="live-dot" aria-hidden />
              Live at 20+ courses across South Africa
            </span>

            <h1 className="display-xl lg:text-[clamp(3.5rem,5.3vw,5.25rem)] mt-6 fade-up-1">
              Win a million
              <br />
              for a <span className="text-lime whitespace-nowrap">hole-in-1</span>
              <span className="sr-only">
                {" "}— Get Lucky Golf Club, South Africa&apos;s leading
                hole-in-one golf activation
              </span>
            </h1>

            <p className="lede lede--dark mt-6 max-w-xl fade-up-2">
              Choose a par 3. Back yourself. Scan the QR on the tee, swing
              from R50 and{" "}
              <strong className="text-white font-semibold">win up to R1 Million</strong>{" "}
              — every shot on camera, every prize insured by Santam &amp; Indwe.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 fade-up-3">
              <Link href="/#courses" className="btn-lime btn-lime--dark">
                Find a course
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/#prizes" className="btn-outline btn-outline--dark">
                See the prizes
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 max-w-lg fade-up-4">
              {[
                { v: "R50", l: "Swings from" },
                { v: "R1M", l: "Top prize" },
                { v: "15", l: "Working days to payout" },
              ].map((s, i) => (
                <div
                  key={s.l}
                  className={`flex flex-col-reverse justify-end ${i > 0 ? "pl-5 border-l border-white/15" : ""}`}
                >
                  <dt className="mt-1.5 text-xs text-white/55">{s.l}</dt>
                  <dd className="font-heading text-2xl sm:text-3xl leading-none">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The ladder, as a live card */}
          <div className="hidden lg:block scale-in relative">
            {/* The challenge lockup, stuck on the card like a sticker */}
            <Image
              src="/brand/logo-lockup.svg"
              alt="Get Lucky Hole-in-1 Challenge"
              width={552}
              height={588}
              unoptimized
              priority
              className="absolute -top-[118px] right-2 z-10 h-32 w-auto rotate-6 drop-shadow-[0_18px_30px_rgba(0,0,0,0.4)]"
            />
            <div className="card--glass p-6">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
                  Prize ladder
                </p>
                <span className="inline-flex items-center gap-2 text-[12px] font-medium text-lime">
                  <span className="live-dot" aria-hidden />
                  Insured on every swing
                </span>
              </div>

              <ul className="mt-5 space-y-2.5">
                {PRIZE_TIERS.map((t, i) => (
                  <li key={t.entry} className="grid grid-cols-[64px_1fr] items-center gap-3">
                    <span className="text-[13px] font-semibold text-white/70 tabular-nums">
                      {t.entry}
                    </span>
                    <span
                      className={`relative flex items-center justify-between gap-2 h-9 min-w-[158px] rounded-xl px-3 ${
                        t.popular
                          ? "bg-lime text-green-dark"
                          : "bg-white/[0.07] text-white"
                      }`}
                      style={{ width: `${RUNG_WIDTH[i]}%` }}
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] opacity-70 truncate">
                        {t.label.replace(" Swing", "")}
                      </span>
                      <span
                        className={`font-heading text-[17px] leading-none tabular-nums ${
                          t.popular ? "" : "text-gold"
                        }`}
                      >
                        {t.prize}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-4 text-[13px] text-white/65">
                <span className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-lime shrink-0" />
                  4G camera on every swing
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-lime shrink-0" />
                  Insured by Santam &amp; Indwe
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
