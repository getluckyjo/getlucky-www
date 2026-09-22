import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  robots: { index: false, follow: false },
};

export default function FormCancelPage() {
  return (
    <main className="min-h-screen relative">
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

      <div className="flex justify-center pt-12 pb-2 px-4">
        <Image
          src="/brand/logo-lockup.svg"
          alt="Get Lucky Hole-in-One Challenge"
          width={552}
          height={588}
          unoptimized
          className="h-32 sm:h-40 w-auto drop-shadow-xl"
          priority
        />
      </div>

      <div className="max-w-md mx-auto px-4 pb-10">
        <div className="card bg-white border-white/40 p-6 sm:p-8 text-center rounded-xl card--hover">
          <h1 className="font-heading text-2xl sm:text-3xl text-green uppercase mb-3">
            Payment Cancelled
          </h1>
          <p className="text-sm text-charcoal-light/80 leading-relaxed mb-6">
            No charge was made. You can try again, or speak to a marshal at the
            par-3 if you need help.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/form"
              className="btn-lime btn-lime--dark"
            >
              Try Again
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
    </main>
  );
}
