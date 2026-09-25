import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";

/**
 * The last word before the footer: one lime panel, one line, both doors —
 * play, or bring it to your day.
 */
export default function FinalCta() {
  return (
    <section className="bg-white py-[clamp(56px,7vw,88px)]">
      <div className="wrap">
        <div className="reveal relative overflow-hidden rounded-[32px] bg-lime text-green-dark px-7 py-14 sm:px-14 sm:py-20">
          <p className="relative text-[12px] font-semibold uppercase tracking-[0.14em] text-green-dark/70">
            It&apos;s only a matter of time
          </p>
          <h2 className="relative display-xl mt-4 max-w-3xl">
            Your <span className="whitespace-nowrap">hole-in-one</span> is out there
          </h2>
          <div className="relative mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/#courses" className="btn-ink">
              Find a course
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={ROUTES.corporate}
              className="btn-outline border-green-dark/25 text-green-dark hover:border-green-dark"
            >
              Book a golf day
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
