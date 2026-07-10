import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.getluckygolf.co.za";
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}${ROUTES.buyVoucher}`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}${ROUTES.corporate}`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}${ROUTES.charity}`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}${ROUTES.schools}`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}${ROUTES.simulator}`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}${ROUTES.tours}`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}${ROUTES.agency}`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}${ROUTES.partner}`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}${ROUTES.terms}`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}${ROUTES.privacy}`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
