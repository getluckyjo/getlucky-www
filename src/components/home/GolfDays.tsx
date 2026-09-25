import Link from "next/link";
import { ArrowRight, Camera, Gift, Heart, Megaphone, MessageCircle, Target, Users } from "lucide-react";
import { ROUTES, SITE } from "@/lib/constants";
import SectionHeader from "@/components/ui/SectionHeader";
import VideoFrame from "@/components/ui/VideoFrame";

const benefits = [
  {
    icon: Target,
    title: "Premium activation",
    text: "Branded signage, tee box setup, and prize boards turn the par-3 into the highlight of the day.",
  },
  {
    icon: Users,
    title: "Fully managed",
    text: "We handle everything — setup, ambassadors, rules, camera verification, and prize fulfilment.",
  },
  {
    icon: Megaphone,
    title: "Brand exposure",
    text: "Custom branding on the challenge hole. Perfect for sponsors looking for high-visibility activations.",
  },
  {
    icon: Camera,
    title: "Every shot captured",
    text: "Solar-powered 4G cameras record every attempt. Share the highlights with your team after the event.",
  },
  {
    icon: Gift,
    title: "Free swing vouchers",
    text: "Every golfer at your event receives a complimentary swing voucher — instant engagement from tee-off.",
  },
  {
    icon: Heart,
    title: "Premium ambassadors",
    text: "Get Lucky brand ambassadors on the hole to engage golfers, explain the challenge, and drive participation.",
  },
];

/**
 * The golf-day pitch on the homepage: the film leads, six benefits follow
 * as a quiet two-column spec list, and the two ways to book close it.
 */
export default function GolfDays() {
  return (
    <section id="corporate" className="section bg-white scroll-mt-20">
      <div className="wrap">
        <SectionHeader
          kicker="Premium golf activations"
          title={
            <>
              Make your golf day <span className="text-green">unforgettable</span>
            </>
          }
          lede="Add the Get Lucky Hole-in-One Challenge to your next corporate golf day. We invest. Your event benefits. Prizes up to R1,000,000."
          action={
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={ROUTES.corporate} className="btn-lime">
                Book a corporate golf day
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp us now
              </a>
            </div>
          }
        />

        <div className="mt-14 grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 lg:gap-14 items-start">
          <VideoFrame />

          <ul className="grid sm:grid-cols-2 lg:grid-cols-1 gap-x-8">
            {benefits.map((item) => (
              <li
                key={item.title}
                className="reveal flex gap-4 py-4 border-t border-line"
              >
                <item.icon className="w-5 h-5 text-green shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[15px] font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
