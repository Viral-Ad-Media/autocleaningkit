import type { NextConfig } from "next";

// Old WordPress URLs that should keep their search traffic.
const renamed: Record<string, string> = {
  "best-polishing-machines-2023": "best-polishing-machines-2026",
  "car-detailing-brushes-2023": "car-detailing-brushes-2026",
  "paint-protection-2023": "paint-protection-2026",
  "best-leather-cleaners-2023": "best-leather-cleaners-2026",
  "best-wheel-cleaners-for-cars-2023": "best-wheel-cleaners-for-cars-2026",
  "9-top-grade-tire-covers-2023": "9-top-grade-tire-covers-2026",
};

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      ...Object.entries(renamed).map(([from, to]) => ({ source: `/${from}`, destination: `/${to}`, permanent: true })),
      // Date-based permalinks from 2022, e.g. /2022/12/18/paint-protection-2023/
      ...Object.entries(renamed).map(([from, to]) => ({
        source: `/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/${from}`,
        destination: `/${to}`,
        permanent: true,
      })),
      { source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug", destination: "/:slug", permanent: true },
      { source: "/category/:slug", destination: "/:slug", permanent: true },
      { source: "/feed", destination: "/blog", permanent: false },
      // WordPress admin and login paths: there is no WordPress here any more.
      { source: "/wp-admin/:path*", destination: "/sign-in", permanent: false },
      { source: "/wp-login.php", destination: "/sign-in", permanent: false },
    ];
  },
};

export default nextConfig;
