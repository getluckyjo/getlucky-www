import type { NextConfig } from "next";

const LEGACY = "https://legacy.getluckygolfclub.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "getluckygolfclub.com" },
      { protocol: "https", hostname: "www.getluckygolfclub.com" },
      { protocol: "https", hostname: "legacy.getluckygolfclub.com" },
      { protocol: "https", hostname: "getluckygolf.co.za" },
      { protocol: "https", hostname: "www.getluckygolf.co.za" },
    ],
  },
  async redirects() {
    return [
      // .com (legacy brand domain) → .co.za (primary), preserving path.
      // Triggered for any traffic that lands on www.getluckygolfclub.com or
      // the apex once GoDaddy DNS is pointed at Vercel.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.getluckygolfclub.com" }],
        destination: "https://www.getluckygolf.co.za/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "getluckygolfclub.com" }],
        destination: "https://www.getluckygolf.co.za/:path*",
        permanent: true,
      },
      // Old WordPress paths → new internal pages — for any traffic still
      // hitting these routes (e.g. Google indexed old URLs, bookmarks).
      { source: "/signup", destination: "/become-a-partner", permanent: true },
      { source: "/signup/", destination: "/become-a-partner", permanent: true },
      { source: "/book", destination: "/corporate-golf-days", permanent: true },
      { source: "/book/", destination: "/corporate-golf-days", permanent: true },
      { source: "/buyswingvoucher", destination: "/buy-a-swing", permanent: true },
      { source: "/buyswingvoucher/", destination: "/buy-a-swing", permanent: true },
      { source: "/golf-courses", destination: "/#courses", permanent: true },
      { source: "/golf-courses/", destination: "/#courses", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      { source: "/terms-and-conditions/", destination: "/terms", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // WordPress admin / REST passthrough so the legacy site keeps working
        // for any tooling that still hits these paths during the migration.
        { source: "/wp-admin/:path*", destination: `${LEGACY}/wp-admin/:path*` },
        { source: "/wp-content/:path*", destination: `${LEGACY}/wp-content/:path*` },
        { source: "/wp-includes/:path*", destination: `${LEGACY}/wp-includes/:path*` },
        { source: "/wp-json/:path*", destination: `${LEGACY}/wp-json/:path*` },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
