import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GolfAgency from "@/components/GolfAgency";
import AgencyForm from "@/components/forms/AgencyForm";
import EnquirySection from "@/components/ui/EnquirySection";

export const metadata: Metadata = {
  title: "The Get Lucky Golf Agency",
  description:
    "South Africa's only integrated golf marketing platform. Reach 153K+ registered golfers across on-course activations, digital content, and bespoke campaigns — through one agency.",
  alternates: { canonical: "/agency" },
  openGraph: {
    title: "The Get Lucky Golf Agency",
    description:
      "South Africa's only integrated golf marketing platform. Reach 153,000 affluent golfers across on-course activations, a YouTube show, and bespoke campaigns — through one agency.",
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
      "South Africa's only integrated golf marketing platform. 153K affluent golfers. Three channels. One agency.",
    images: ["/og-agency-v4.jpg"],
  },
};

export default function AgencyPage() {
  return (
    <>
      <Navbar />
      <main>
        <GolfAgency variant="page" />

        <EnquirySection
          id="enquire"
          kicker="Partner enquiry"
          title="Reach the golfer audience"
          lede={
            <>
              Tell us about your brand and what you&apos;re trying to achieve.
              We&apos;ll send a media kit, audience data, and the right entry
              point across our platforms and bespoke campaigns.
            </>
          }
          response="An agency partner replies within 1 business day."
          trust={false}
        >
          <AgencyForm />
        </EnquirySection>
      </main>
      <Footer />
    </>
  );
}
