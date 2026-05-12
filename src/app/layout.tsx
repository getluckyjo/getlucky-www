import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { GOOGLE_ADS } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const posterGothic = localFont({
  src: "../../public/fonts/PosterGothicRoundATF-Heavy.woff2",
  variable: "--font-poster-gothic",
  weight: "800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.getluckygolf.co.za"),
  title: {
    default:
      "Get Lucky Golf Club | Hole-in-One Challenge South Africa — Win Up to R1,000,000",
    template: "%s | Get Lucky Golf Club",
  },
  description:
    "South Africa's leading hole-in-one golf activation. Buy a swing from R50, play the signature par-3, and win up to R1,000,000 at 20+ premium courses nationwide. Fully insured by Santam & Indwe Risk Services.",
  keywords: [
    "hole-in-one challenge",
    "hole-in-one challenge South Africa",
    "golf challenge",
    "win money golf",
    "corporate golf day South Africa",
    "golf day activation",
    "hole-in-one competition",
    "golf voucher South Africa",
    "Get Lucky Golf Club",
    "Indwe Risk Services golf",
  ],
  authors: [{ name: "Get Lucky Golf Club" }],
  creator: "Get Lucky Golf Club",
  publisher: "Get Lucky Golf Club",
  formatDetection: {
    telephone: true,
    email: true,
  },
  alternates: {
    canonical: "https://www.getluckygolf.co.za",
  },
  openGraph: {
    title: "Get Lucky Golf Club | Hole-in-One Challenge South Africa",
    description:
      "Buy a swing from R50, sink a hole-in-one on the signature par-3, and win up to R1,000,000. Live at 20+ premium courses across South Africa. Insured by Santam & Indwe Risk Services.",
    type: "website",
    locale: "en_ZA",
    url: "https://www.getluckygolf.co.za",
    siteName: "Get Lucky Golf Club",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Get Lucky Golf Club — Hole-in-One Challenge across South Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Lucky Golf Club | Hole-in-One Challenge South Africa",
    description:
      "Buy a swing from R50. Sink a hole-in-one. Win up to R1,000,000. 20+ premium courses across SA.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Get Lucky Golf Club",
    url: "https://www.getluckygolf.co.za",
    logo: "https://www.getluckygolf.co.za/logos/logo-full.png",
    description:
      "South Africa's leading hole-in-one golf activation. Buy a swing, play the signature par-3, and win up to R1,000,000 at 20+ premium courses. Insured by Santam & Indwe Risk Services.",
    email: "johannes@getluckygolfclub.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ZA",
    },
    sameAs: ["https://www.instagram.com/getluckygolfclub"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Hole-in-One Challenge Entries",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Bronze Swing",
          price: "50",
          priceCurrency: "ZAR",
          description: "Win R25,000 with a hole-in-one",
        },
        {
          "@type": "Offer",
          name: "Silver Swing",
          price: "100",
          priceCurrency: "ZAR",
          description: "Win R60,000 with a hole-in-one",
        },
        {
          "@type": "Offer",
          name: "Birdie Swing",
          price: "150",
          priceCurrency: "ZAR",
          description: "Win R100,000 with a hole-in-one",
        },
        {
          "@type": "Offer",
          name: "Gold Swing",
          price: "250",
          priceCurrency: "ZAR",
          description: "Win R200,000 with a hole-in-one",
        },
        {
          "@type": "Offer",
          name: "Platinum Swing",
          price: "500",
          priceCurrency: "ZAR",
          description: "Win R500,000 with a hole-in-one",
        },
        {
          "@type": "Offer",
          name: "Diamond Swing",
          price: "1000",
          priceCurrency: "ZAR",
          description: "Win R1,000,000 with a hole-in-one",
        },
      ],
    },
  };

  return (
    <html
      lang="en"
      className={`${posterGothic.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Privacy-friendly analytics by Plausible */}
        <Script
          src="https://plausible.io/js/pa-DhU3ymkajLquFKpm18YuS.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </Script>
        {/* Google Ads gtag.js — conversion tracking + remarketing */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS.conversionId}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GOOGLE_ADS.conversionId}');`}
        </Script>
        {children}
      </body>
    </html>
  );
}
