import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, MessageCircle, QrCode, ShieldCheck } from "lucide-react";
import { MEMBERSHIP, SITE } from "@/lib/constants";
import { INDWE_QUOTE_URL, SOLUTIONS } from "@/lib/solutions";
import SectionHeader from "@/components/ui/SectionHeader";

/**
 * Everything Get Lucky offers, on one screen. Golfers get the three ways to
 * play up top; organisations get every service below, each one line and a
 * link. It replaces the hero's four pillar cards and routes each visitor to
 * their page in one tap.
 */
export default function Products() {
  return (
    <section className="section bg-paper" aria-labelledby="products-title">
      <div className="wrap">
        <SectionHeader
          kicker="One platform"
          title={
            <span id="products-title">
              Golf&apos;s biggest shot,
              <br className="hidden sm:block" /> built for everyone
            </span>
          }
          lede="Players swing for a million. Clubs, brands, schools and charities run it with us — insured, camera-verified and managed end to end."
        />

        {/* For golfers */}
        <div className="mt-14 grid gap-3 lg:grid-cols-4 lg:grid-rows-2">
          <Link
            href="/#how-it-works"
            className="reveal group on-dark relative isolate overflow-hidden rounded-3xl bg-night text-white p-7 sm:p-9 min-h-[340px] lg:col-span-2 lg:row-span-2 flex flex-col justify-end"
          >
            <Image
              src="/images/golf-day/IMG_4419.jpg"
              alt="A golfer scanning the QR code on the Get Lucky challenge sign at the tee box"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover -z-20 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/60 to-night/5" />
            <span className="icon-disc icon-disc--lime">
              <QrCode className="w-5 h-5" />
            </span>
            <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
              For golfers
            </p>
            <h3 className="display-md mt-2">Play the challenge</h3>
            <p className="mt-3 text-white/70 max-w-md">
              Scan the QR code at the tee box, pick your entry from R50 to
              R1,000, and take one swing on the signature par 3. No app, no
              handicap, no membership needed.
            </p>
            <span className="link-arrow mt-6">
              How it works <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/#membership"
            className="reveal group card card--hover p-7 lg:col-span-2 flex flex-col"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="icon-disc">
                <BadgeCheck className="w-5 h-5" />
              </span>
              <span className="chip-lime">R{MEMBERSHIP.amount}/month</span>
            </div>
            <h3 className="mt-6 text-xl font-semibold tracking-[-0.015em] text-ink">
              Become a member
            </h3>
            <p className="mt-2 text-muted">
              Unlimited swings at {MEMBERSHIP.prize}, every round, at every
              partner course. No lock-in.
            </p>
            <span className="link-arrow mt-auto pt-5">
              See membership <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <a
            href={INDWE_QUOTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal group card card--hover p-7 lg:col-span-2 flex flex-col"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="icon-disc">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="chip">12 months free</span>
            </div>
            <h3 className="mt-6 text-xl font-semibold tracking-[-0.015em] text-ink">
              Get an insurance quote
            </h3>
            <p className="mt-2 text-muted">
              An obligation-free quote from Indwe unlocks a year of Get Lucky
              membership and complimentary deals.
            </p>
            <span className="link-arrow mt-auto pt-5">
              Get a quote <ArrowUpRight className="w-4 h-4" />
            </span>
          </a>
        </div>

        {/* For organisations */}
        <div className="mt-20 flex items-baseline justify-between gap-6 border-b border-line pb-5">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
            For organisations
          </h3>
          <span className="text-[13px] text-muted hidden sm:block">
            Fully managed · Fully insured · Anywhere in SA
          </span>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-6">
          {SOLUTIONS.map((s) => (
            <li key={s.href} className="reveal">
              <Link
                href={s.href}
                className="group card card--hover h-full p-4 sm:p-6 grid grid-cols-[auto_1fr_auto] items-center gap-x-4 sm:flex sm:flex-col sm:items-start"
              >
                <span className="icon-disc transition-colors group-hover:bg-lime group-hover:text-green-dark">
                  <s.icon className="w-5 h-5" />
                </span>
                <span className="min-w-0 sm:mt-5">
                  <span className="block text-[16px] sm:text-[17px] font-semibold tracking-[-0.01em] text-ink">
                    {s.label}
                  </span>
                  <span className="block mt-1 sm:mt-1.5 text-[14px] leading-snug sm:leading-relaxed text-muted">
                    {s.blurb}
                  </span>
                </span>
                <span className="sm:mt-auto sm:pt-5">
                  <ArrowRight className="w-5 h-5 text-ink/25 transition-all group-hover:text-green group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
          <li className="reveal">
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full rounded-[20px] border border-dashed border-line-strong p-4 sm:p-6 grid grid-cols-[auto_1fr_auto] items-center gap-x-4 sm:flex sm:flex-col sm:items-start hover:border-green transition-colors"
            >
              <span className="icon-disc">
                <MessageCircle className="w-5 h-5" />
              </span>
              <span className="min-w-0 sm:mt-5">
                <span className="block text-[16px] sm:text-[17px] font-semibold tracking-[-0.01em] text-ink">
                  Something else?
                </span>
                <span className="block mt-1 sm:mt-1.5 text-[14px] leading-snug sm:leading-relaxed text-muted">
                  Tell us your idea on WhatsApp. If there&apos;s a par 3, we can
                  put a prize on it.
                </span>
              </span>
              <span className="sm:mt-auto sm:pt-5">
                <ArrowUpRight className="w-5 h-5 text-ink/25 transition-all group-hover:text-green" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
