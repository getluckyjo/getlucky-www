"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Flag, MapPin } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { MEMBERSHIP_JOIN_URL } from "@/lib/solutions";
import SectionHeader from "@/components/ui/SectionHeader";

const memberClubs = [
  { name: "Metropolitan Golf Club", slug: "metropolitan", region: "Cape Town", image: "/images/courses/metropolitan.jpg" },
  { name: "Clovelly Golf Club", slug: "clovelly", region: "Cape Town", image: "/images/courses/clovelly.jpg" },
  { name: "Paarl Golf Club", slug: "paarl", region: "Cape Winelands", image: "/images/courses/paarl.jpg" },
  // The membership site has no /join/boschenmeer page yet, so this tile joins the club-wide plan.
  { name: "Boschenmeer Golf Estate", slug: "boschenmeer", join: "get-lucky", region: "Cape Winelands", image: "/images/courses/boschenmeer.jpg" },
  { name: "Atlantic Beach Golf Estate", slug: "atlantic-beach", region: "Cape Town", image: "/images/courses/atlantic-beach.jpg" },
  { name: "Bellville Golf Club", slug: "bellville", region: "Cape Town", image: "/images/courses/bellville.jpg" },
  { name: "Durbanville Golf Club", slug: "durbanville", region: "Cape Town", image: "/images/courses/durbanville.jpg" },
  { name: "Rondebosch Golf Club", slug: "rondebosch", region: "Cape Town", image: "/images/courses/rondebosch.jpg" },
  { name: "Mossel Bay Golf Club", slug: "mossel-bay", region: "Garden Route", image: "/images/courses/mossel-bay.jpg" },
  { name: "Goose Valley Golf Estate", slug: "goose-valley", region: "Garden Route", image: "/images/courses/goose-valley.jpg" },
  { name: "St Francis Links", slug: "st-francis", region: "Garden Route", image: "/images/courses/st-francis-links.jpg" },
  { name: "East London Golf Club", slug: "east-london", region: "Eastern Cape", image: "/images/courses/east-london.jpg" },
  { name: "Centurion Golf Estate", slug: "centurion", region: "Gauteng", image: "/images/courses/centurion.jpg" },
  { name: "State Mines Golf Club", slug: "state-mines", region: "Gauteng", image: "/images/courses/state-mines.jpg" },
  { name: "Highland Gate Golf Estate", slug: "highland-gate", region: "Mpumalanga", image: "/images/courses/highland-gate.jpg" },
  { name: "Killarney Golf Club", slug: "killarney", region: "Gauteng", image: "/images/courses/killarney.jpg" },
  { name: "Graceland Golf Club", slug: "graceland", region: "KZN", image: "/images/courses/graceland.jpg" },
  { name: "Umhlali Country Club", slug: "umhlali", region: "KZN", image: "/images/courses/umhlali.jpg" },
  { name: "Zimbali Golf Club", slug: "zimbali", region: "KZN", image: "/images/courses/zimbali.jpg" },
];

const ALL = "All regions";
const REGIONS = [ALL, ...Array.from(new Set(memberClubs.map((c) => c.region)))];

/**
 * The partner courses as a filterable wall: region chips on top, course
 * photos below. On phones the wall becomes a swipeable row so the section
 * stays one screen tall. Each course opens its club's membership page.
 */
export default function Courses() {
  const [region, setRegion] = useState(ALL);
  const clubs = useMemo(
    () => (region === ALL ? memberClubs : memberClubs.filter((c) => c.region === region)),
    [region],
  );

  return (
    <section id="courses" className="section bg-paper">
      <div className="wrap">
        <SectionHeader
          kicker="Partner courses"
          title="Get Lucky partner courses"
          lede="Every course below has the challenge live on its signature par 3. Turn up, scan the QR on the tee and swing — or tap your club to join for R149/month and swing unlimited."
        />

        <div
          role="group"
          aria-label="Filter courses by region"
          className="reveal mt-10 -mx-5 px-5 sm:mx-0 sm:px-0 flex sm:flex-wrap gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {REGIONS.map((r) => {
            const on = r === region;
            return (
              <button
                key={r}
                type="button"
                aria-pressed={on}
                onClick={() => setRegion(r)}
                className={`shrink-0 min-h-11 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                  on
                    ? "bg-ink text-white"
                    : "bg-white text-ink/70 border border-line hover:border-line-strong hover:text-ink"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>

        <ul className="mt-6 snap-row -mx-5 px-5 scroll-px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-3 lg:grid-cols-4 sm:overflow-visible sm:gap-3">
          {clubs.map((club) => (
            <li key={club.slug}>
              <a
                href={`${MEMBERSHIP_JOIN_URL}/${"join" in club && club.join ? club.join : club.slug}`}
                className="group relative block overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-[4/3] bg-surface"
              >
                <Image
                  src={club.image}
                  alt={club.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 75vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/15 to-transparent" />
                <ArrowUpRight className="absolute top-3 right-3 w-8 h-8 p-2 rounded-full bg-white/90 text-ink transition-all sm:opacity-0 sm:-translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-white text-[15px] font-semibold leading-tight">
                    {club.name}
                  </p>
                  <p className="text-white/70 text-[12px] flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {club.region}
                    <span className="text-white/45">·</span>
                    <span className="text-lime">Join · R149/mo</span>
                  </p>
                </div>
              </a>
            </li>
          ))}

          {/* The challenge travels: bring it to your own day */}
          <li>
            <Link
              href={ROUTES.corporate}
              className="group relative flex flex-col justify-between rounded-2xl aspect-[4/5] sm:aspect-[4/3] bg-lime text-green-dark p-5 overflow-hidden"
            >
              <span className="icon-disc bg-green-dark/10 text-green-dark">
                <Flag className="w-5 h-5" />
              </span>
              <span>
                <span className="block font-heading text-2xl leading-none">
                  Book Get Lucky for your golf day
                </span>
                <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold">
                  The challenge travels{" "}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
