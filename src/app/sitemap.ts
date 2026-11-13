import type { MetadataRoute } from "next";
import { getCategories, getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.BETTER_AUTH_URL ?? "https://autocleaningkit.com";
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "weekly" },
    ...categories.map((c) => ({ url: `${base}/${c.slug}` })),
    ...posts.map((p) => ({ url: `${base}/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
