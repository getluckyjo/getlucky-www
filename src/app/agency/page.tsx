import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GolfAgency from "@/components/GolfAgency";
import AgencyForm from "@/components/forms/AgencyForm";

export const metadata: Metadata = {
  title: "The Get Lucky Golf Agency",
  description:
    "South Africa's only integrated golf marketing platform. Reach 153K+ registered golfers across on-course activations, digital content, club websites, and event bookings — through one agency.",
  alternates: { canonical: "/agency" },
  openGraph: {
    title: "The Get Lucky Golf Agency",
    description:
      "South Africa's only integrated golf marketing platform. Reach 153,000 affluent golfers across on-course activations, a YouTube show, club websites, event bookings, and bespoke campaigns — through one agency.",
    type: "website",
    locale: "en_ZA",
    url: "https://www.getluckygolf.co.za/agency",
    siteName: "Get Lucky Golf Agency",
    images: [
      {
        url: "/og-agency-v4.jpg",
        width: 1200,
        height: 630,
        alt: "The Get Lucky Golf Agency — South Africa's integrated golf marketing platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Get Lucky Golf Agency",
    description:
      "South Africa's only integrated golf marketing platform. 153K affluent golfers. Five channels. One agency.",
    images: ["/og-agency-v4.jpg"],
  },
};

export default function AgencyPage() {
  return (
    <>
      <Navbar />
      <main>
        <GolfAgency variant="page" />

        <section id="enquire" className="bg-cream py-20 sm:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                Partner Enquiry
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-green-dark mt-3 uppercase tracking-wide">
                Reach the Golfer Audience
              </h2>
              <p className="text-base sm:text-lg text-charcoal-light/80 mt-5 leading-relaxed">
                Tell us about your brand and what you&apos;re trying to achieve.
                We&apos;ll send a media kit, audience data, and the right entry
                point across our platforms and bespoke campaigns.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-green-dark/10 p-6 sm:p-10">
              <AgencyForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
