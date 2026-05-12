import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import { Users, Target, Megaphone, Camera, Gift, Heart } from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "Premium Activation",
    text: "Branded signage, tee box setup, and prize boards turn the par-3 into the highlight of the day.",
  },
  {
    icon: Users,
    title: "Fully Managed",
    text: "We handle everything — setup, ambassadors, rules, camera verification, and prize fulfilment.",
  },
  {
    icon: Megaphone,
    title: "Brand Exposure",
    text: "Custom branding on the challenge hole. Perfect for sponsors looking for high-visibility activations.",
  },
  {
    icon: Camera,
    title: "Every Shot Captured",
    text: "Solar-powered 4G cameras record every attempt. Share the highlights with your team after the event.",
  },
  {
    icon: Gift,
    title: "Free Swing Vouchers",
    text: "Every golfer at your event receives a complimentary swing voucher — instant engagement from tee-off.",
  },
  {
    icon: Heart,
    title: "Premium Ambassadors",
    text: "Get Lucky brand ambassadors on the hole to engage golfers, explain the challenge, and drive participation.",
  },
];

export default function CorporateCTA() {
  return (
    <section id="corporate" className="py-24 sm:py-32 bg-green-dark relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[300px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest">
            Premium Golf Activations
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-cream mt-3 uppercase tracking-wide">
            Make Your Golf Day
            <span className="text-gold"> Unforgettable</span>
          </h2>
          <p className="text-cream/70 mt-4 max-w-lg mx-auto">
            Add the Get Lucky Hole-in-One Challenge to your next corporate golf
            day. We invest. Your event benefits. Prizes up to R1,000,000.
          </p>
        </div>

        {/* Video */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-cream/10 shadow-2xl">
            <video
              className="w-full aspect-video"
              controls
              preload="metadata"
              playsInline
              poster="/images/golf-day/video-poster.png"
            >
              <source src="/images/golf-day-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((item) => (
            <div
              key={item.title}
              className="bg-cream/5 border border-cream/10 rounded-xl p-6 hover:border-gold/20 transition-colors"
            >
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="text-cream text-sm font-bold mb-1">
                {item.title}
              </h3>
              <p className="text-cream/60 text-xs leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={ROUTES.corporate}
            className="inline-block bg-gold hover:bg-gold-light text-green-dark font-bold text-lg px-10 py-4 rounded-full transition-all hover:scale-105"
          >
            Book a Corporate Golf Day
          </Link>
          <a
            href="https://wa.me/27609615091"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-cream/20 hover:border-cream/40 text-cream font-medium text-lg px-10 py-4 rounded-full transition-all"
          >
            WhatsApp Us Now
          </a>
        </div>
      </div>
    </section>
  );
}
