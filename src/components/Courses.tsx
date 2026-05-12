import { COURSES, ROUTES } from "@/lib/constants";
import Link from "next/link";
import { MapPin } from "lucide-react";

const regions = [
  {
    name: "Western Cape",
    courses: [
      "Metropolitan Golf Club",
      "Clovelly Golf Club",
      "Paarl Golf Club",
      "Boschenmeer Golf Estate",
      "Atlantic Beach Golf Estate",
      "Bellville Golf Club",
      "Durbanville Golf Club",
      "Rondebosch Golf Club",
    ],
  },
  {
    name: "Gauteng & Mpumalanga",
    courses: [
      "Centurion Golf Estate",
      "State Mines Golf Club",
      "Killarney Golf Club",
      "Highland Gate Golf Estate",
    ],
  },
  {
    name: "Garden Route, Eastern Cape & KZN",
    courses: [
      "Mossel Bay Golf Club",
      "Goose Valley Golf Estate",
      "St Francis Links",
      "East London Golf Club",
      "Umhlali Country Club",
      "Zimbali Golf Club",
      "Graceland Golf Club",
    ],
  },
];

export default function Courses() {
  return (
    <section id="courses" className="py-24 sm:py-32 bg-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-green text-xs font-semibold uppercase tracking-widest">
            Live at {COURSES.length}+ Premium Courses Nationwide
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-green-dark mt-3 uppercase tracking-wide">
            Find a Course Near You
          </h2>
          <p className="text-green-dark/60 mt-4 max-w-lg mx-auto">
            The Get Lucky Hole-in-One Challenge is installed at select premium
            courses from Cape Town to KZN — and we&apos;re adding new courses
            every month. Only 60 limited premium partner slots available.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => (
            <div
              key={region.name}
              className="bg-white border border-green-dark/8 rounded-2xl p-6"
            >
              <h3 className="text-sm font-bold text-green uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {region.name}
              </h3>
              <ul className="space-y-2">
                {region.courses.map((course) => (
                  <li
                    key={course}
                    className="text-green-dark/70 text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-green-dark/50 text-sm mb-4">
            Want to add the Get Lucky activation to your course? Zero cost. Zero risk.
          </p>
          <Link
            href={ROUTES.partner}
            className="inline-block bg-green hover:bg-green-light text-cream font-semibold text-sm px-8 py-3 rounded-full transition-all hover:scale-105"
          >
            Become a Partner Course
          </Link>
        </div>
      </div>
    </section>
  );
}
