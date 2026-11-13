/**
 * Loads the content recovered from the Oct 19 2026 WordPress backup
 * (src/content/seed.json) into the database. Safe to re-run: existing posts are
 * left alone unless you pass --force, so edits made in /admin are not lost.
 */
import { config } from "dotenv";
config({ path: [".env.local", ".env"] });

async function main() {
  const { db, schema } = await import("../src/db");
  const { eq } = await import("drizzle-orm");
  const seed = (await import("../src/content/seed.json", { with: { type: "json" } })).default;
  const force = process.argv.includes("--force");

  for (const [i, c] of seed.categories.entries()) {
    await db
      .insert(schema.categories)
      .values({ ...c, position: i })
      .onConflictDoUpdate({ target: schema.categories.slug, set: { name: c.name, description: c.description, position: i } });
  }

  let created = 0;
  for (const p of seed.posts) {
    const existing = await db.query.posts.findFirst({ where: eq(schema.posts.slug, p.slug) });
    if (existing && !force) continue;
    if (existing) await db.delete(schema.posts).where(eq(schema.posts.id, existing.id));
    const [row] = await db
      .insert(schema.posts)
      .values({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        categorySlug: p.category,
        featuredImage: p.featuredImage,
        published: p.published,
        publishedAt: new Date(p.publishedAt),
      })
      .returning({ id: schema.posts.id });
    if (p.products.length) {
      await db.insert(schema.products).values(
        p.products.map((pr, position) => ({ postId: row.id, position, name: pr.name, image: pr.image })),
      );
    }
    created++;
  }
  console.log(`Seeded ${seed.categories.length} categories and ${created} posts.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
