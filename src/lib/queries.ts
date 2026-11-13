import { and, asc, desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

const { posts, categories, products } = schema;

export async function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.position));
}

export async function getCategory(slug: string) {
  return db.query.categories.findFirst({ where: eq(categories.slug, slug) });
}

export async function getPublishedPosts(opts: { category?: string; limit?: number } = {}) {
  return db.query.posts.findMany({
    where: and(eq(posts.published, true), opts.category ? eq(posts.categorySlug, opts.category) : undefined),
    orderBy: [desc(posts.publishedAt)],
    limit: opts.limit,
    with: { category: true },
  });
}

export async function getPublishedPost(slug: string) {
  return db.query.posts.findFirst({
    where: and(eq(posts.slug, slug), eq(posts.published, true)),
    with: { category: true, products: { orderBy: [asc(products.position)] } },
  });
}

export type PostWithCategory = Awaited<ReturnType<typeof getPublishedPosts>>[number];
