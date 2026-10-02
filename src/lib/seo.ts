import type { Metadata } from "next";

const SITE_URL = "https://www.getluckygolf.co.za";
const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Get Lucky Golf Club — Hole-in-One Challenge across South Africa",
};

/**
 * A page's own link preview (WhatsApp, LinkedIn, X). Next replaces the
 * layout's `openGraph` and `twitter` objects wholesale rather than merging
 * them, so a page that sets its own title restates the image, site name and
 * locale here. Without this every service page previews as the homepage.
 */
export function socialMeta(
  path: string,
  title: string,
  description: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  // The layout's title template doesn't reach link previews, so the brand
  // goes on here when the page title doesn't already carry it.
  const shareTitle = title.includes("Get Lucky") ? title : `${title} | Get Lucky Golf Club`;
  return {
    openGraph: {
      title: shareTitle,
      description,
      type: "website",
      locale: "en_ZA",
      url: `${SITE_URL}${path}`,
      siteName: "Get Lucky Golf Club",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
