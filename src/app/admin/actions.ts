"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, schema } from "@/db";
import type { ImageRef } from "@/db/schema";
import { requireUser } from "@/lib/auth";

const { posts, products, categories } = schema;

export type SaveState = { error?: string; saved?: boolean };

const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PostInput = z.object({
  title: z.string().trim().min(3, "Title is too short.").max(200),
  slug: z.string().trim().toLowerCase().regex(slugRe, "Slug can only use lowercase letters, numbers and dashes."),
  excerpt: z.string().trim().max(400),
  body: z.string().max(200_000),
  categorySlug: z.string().min(1, "Pick a category."),
  featuredImage: z.string().trim(),
  published: z.boolean(),
});

const ProductInput = z.object({
  id: z.coerce.number().int().optional(),
  name: z.string().trim(),
  summary: z.string().trim().max(2000),
  url: z.union([z.literal(""), z.url("Product links must be full URLs starting with https://")]),
  image: z.string().trim(),
  remove: z.boolean(),
});

/** Image paths must be local uploads or https URLs. Keeps width/height when the src is unchanged. */
function toImage(src: string, previous?: ImageRef | null): ImageRef | null {
  if (!src) return null;
  if (!src.startsWith("/uploads/") && !src.startsWith("https://")) throw new Error(`Image "${src}" must start with /uploads/ or https://`);
  if (previous?.src === src) return previous;
  return { src, width: 1200, height: 800 };
}

const RESERVED = new Set(["admin", "blog", "sign-in", "api", "sitemap.xml", "robots.txt"]);

export async function savePost(postId: number | null, _prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireUser();

  const parsed = PostInput.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") ?? "",
    body: formData.get("body") ?? "",
    categorySlug: formData.get("categorySlug"),
    featuredImage: formData.get("featuredImage") ?? "",
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const input = parsed.data;

  if (RESERVED.has(input.slug)) return { error: `"${input.slug}" is reserved. Pick another slug.` };
  const cat = await db.query.categories.findFirst({ where: eq(categories.slug, input.slug) });
  if (cat) return { error: "That slug is already used by a category." };
  const clash = await db.query.posts.findFirst({
    where: postId ? and(eq(posts.slug, input.slug), ne(posts.id, postId)) : eq(posts.slug, input.slug),
  });
  if (clash) return { error: "Another post already uses that slug." };
  if (!(await db.query.categories.findFirst({ where: eq(categories.slug, input.categorySlug) })))
    return { error: "Unknown category." };

  // Collect product rows: fields are named product.<index>.<field>
  const rows = new Map<string, Record<string, unknown>>();
  for (const [key, value] of formData.entries()) {
    const m = /^product\.(\d+)\.(\w+)$/.exec(key);
    if (!m) continue;
    const row = rows.get(m[1]) ?? {};
    row[m[2]] = value;
    rows.set(m[1], row);
  }
  const productInputs = [];
  for (const row of rows.values()) {
    const p = ProductInput.safeParse({
      id: row.id ? row.id : undefined,
      name: row.name ?? "",
      summary: row.summary ?? "",
      url: row.url ?? "",
      image: row.image ?? "",
      remove: row.remove === "on",
    });
    if (!p.success) return { error: p.error.issues[0].message };
    if (!p.data.name && !p.data.id) continue; // blank "add product" row
    if (!p.data.name && !p.data.remove) return { error: "Every product needs a name." };
    productInputs.push(p.data);
  }

  let id = postId;
  try {
    const existing = id ? await db.query.posts.findFirst({ where: eq(posts.id, id), with: { products: true } }) : null;
    if (id && !existing) return { error: "Post not found." };
    const values = {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      body: input.body,
      categorySlug: input.categorySlug,
      published: input.published,
      featuredImage: toImage(input.featuredImage, existing?.featuredImage),
      updatedAt: new Date(),
    };
    if (existing) {
      await db.update(posts).set(values).where(eq(posts.id, existing.id));
    } else {
      const [row] = await db.insert(posts).values(values).returning({ id: posts.id });
      id = row.id;
    }

    const prevProducts = new Map((existing?.products ?? []).map((p) => [p.id, p]));
    let position = 0;
    for (const p of productInputs) {
      if (p.id && !prevProducts.has(p.id)) continue; // not this post's product
      if (p.id && p.remove) {
        await db.delete(products).where(eq(products.id, p.id));
        continue;
      }
      const data = {
        name: p.name,
        summary: p.summary,
        url: p.url || null,
        image: toImage(p.image, p.id ? prevProducts.get(p.id)?.image : null),
        position: position++,
      };
      if (p.id) await db.update(products).set(data).where(eq(products.id, p.id));
      else await db.insert(products).values({ ...data, postId: id! });
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not save." };
  }

  revalidatePath("/", "layout");
  if (!postId) redirect(`/admin/posts/${id}?saved=1`);
  return { saved: true };
}

export async function deletePost(postId: number) {
  await requireUser();
  await db.delete(posts).where(eq(posts.id, postId));
  revalidatePath("/", "layout");
  redirect("/admin");
}
