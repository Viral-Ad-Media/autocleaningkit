import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.BETTER_AUTH_URL ?? "https://autocleaningkit.com";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/sign-in", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
