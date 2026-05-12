import Image from "next/image";
import { MapPin, Flag } from "lucide-react";

const memberClubs = [
  { name: "Metropolitan Golf Club", slug: "metropolitan", region: "Cape Town", image: "/images/courses/metropolitan.jpg" },
  { name: "Clovelly Golf Club", slug: "clovelly", region: "Cape Town", image: "/images/courses/clovelly.jpg" },
  { name: "Paarl Golf Club", slug: "paarl", region: "Cape Winelands", image: "/images/courses/paarl.jpg" },
  { name: "Boschenmeer Golf Estate", slug: "boschenmeer", region: "Cape Winelands", image: "/images/courses/boschenmeer.jpg" },
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

const MEMBERSHIP_BASE = "https://membership.getluckygolfclub.com/join";

export default function PartnerCourses() {
  return (
    <section id="courses" className="py-24 sm:py-32 bg-green-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-5xl text-cream uppercase tracking-wide">
            Get Lucky <span className="text-gold">Partner Courses</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {memberClubs.map((club) => (
            <a
              key={club.slug}
              href={`${MEMBERSHIP_BASE}/${club.slug}`}
              className="relative rounded-xl overflow-hidden group aspect-[4/3]"
            >
              {club.image ? (
                <Image
                  src={club.image}
                  alt={club.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-green/30" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-bold leading-tight group-hover:text-gold transition-colors">
                  {club.name}
                </p>
                <p className="text-white/60 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {club.region}
                </p>
              </div>
            </a>
          ))}

          {/* Mobile Unit CTA card */}
          <a
            href="/#corporate"
            className="relative rounded-xl overflow-hidden group aspect-[4/3] bg-gold/10 border-2 border-dashed border-gold/30 hover:border-gold/60 transition-all flex flex-col items-center justify-center text-center p-4"
          >
            <div className="w-12 h-12 bg-gold/15 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Flag className="w-6 h-6 text-gold" />
            </div>
            <p className="text-cream text-sm font-bold leading-tight group-hover:text-gold transition-colors">
              Book Get Lucky for your golf day
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
