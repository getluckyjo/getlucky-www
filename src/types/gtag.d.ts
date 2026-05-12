/**
 * Type declarations for Google's gtag.js (Google Ads + GA4).
 * Loaded globally via the script in src/app/layout.tsx.
 *
 * Usage from a client component (form submit handler):
 *
 *   if (typeof window !== "undefined" && window.gtag) {
 *     window.gtag("event", "conversion", {
 *       send_to: "AW-XXXXXXXXX/abc123",
 *     });
 *   }
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "config" | "event" | "js" | "set" | "consent",
      target: string | Date,
      params?: Record<string, unknown>,
    ) => void;
  }
}

export {};
