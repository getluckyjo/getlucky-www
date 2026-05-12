import Image from "next/image";

export default function Hero() {
  return (
    <>
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-green-dark">
        {/* Golf course background image */}
        <Image
          src="/images/hero-bg.avif"
          alt=""
          fill
          className="object-cover"
          priority
        />

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-dark/90 via-green-dark/50 to-green-dark/30" />

        {/* Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
            <div className="mb-6 flex justify-center">
              <Image
                src="/logos/challenge-full.png"
                alt="Get Lucky Hole-in-1 Challenge logo"
                width={400}
                height={435}
                className="h-36 sm:h-48 md:h-64 w-auto drop-shadow-2xl"
                priority
              />
            </div>

            <div className="mb-6 flex justify-center">
              <Image
                src="/images/hole-in-one.png"
                alt="Win A Million For A Hole-in-1"
                width={800}
                height={400}
                className="w-full max-w-2xl h-auto opacity-90"
                priority
              />
            </div>

            <h1 className="sr-only">
              Get Lucky Golf Club — South Africa&apos;s Leading Hole-in-One Golf Activation
            </h1>

            <p className="text-lg sm:text-xl text-cream/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              Enter the Get Lucky Challenge at any of our partner golf courses
              nationwide, and win up to R1,000,000 for a hole in 1. Simply scan,
              pay, play.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#how-it-works"
                className="border border-cream/30 hover:border-cream/60 text-cream hover:text-white font-bold text-lg px-10 py-4 rounded-full transition-all w-full sm:w-auto"
              >
                How to Play
              </a>
              <a
                href="#courses"
                className="border border-cream/30 hover:border-cream/60 text-cream hover:text-white font-bold text-lg px-10 py-4 rounded-full transition-all w-full sm:w-auto"
              >
                Where to Play
              </a>
            </div>
          </div>
        </div>

        {/* Headline sponsor banner */}
        <div className="relative z-10 bg-white py-4 sm:py-5">
          <div className="max-w-3xl mx-auto px-6">
            <iframe
              src="/indwe-banner/index.html"
              title="Indwe Risk Services — Headline Sponsor"
              loading="lazy"
              className="w-full block border-0"
              style={{ aspectRatio: "1600 / 333" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
