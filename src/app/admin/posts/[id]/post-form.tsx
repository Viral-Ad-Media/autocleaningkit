"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { ImageRef } from "@/db/schema";
import { deletePost, savePost, type SaveState } from "../../actions";

type Product = { id: number; name: string; summary: string; url: string | null; image: ImageRef | null };
type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  categorySlug: string;
  featuredImage: ImageRef | null;
  published: boolean;
  products: Product[];
};

const input =
  "mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export function PostForm({
  post,
  categories,
  justCreated,
}: {
  post: Post | null;
  categories: { slug: string; name: string }[];
  justCreated?: boolean;
}) {
  const action = savePost.bind(null, post?.id ?? null);
  const [state, formAction, pending] = useActionState<SaveState, FormData>(action, { saved: justCreated });
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [extra, setExtra] = useState(post ? 1 : 3);
  const existing = post?.products ?? [];

  return (
    <form action={formAction} className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{post ? "Edit post" : "New post"}</h1>
        <div className="flex items-center gap-3">
          {post && (
            <Link href={`/${post.slug}`} target="_blank" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View ↗
            </Link>
          )}
          <button disabled={pending} className="rounded-full bg-brand-500 px-6 py-2 font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {state.error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      {state.saved && !state.error && <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">Saved.</p>}

      <section className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Title</span>
          <input
            name="title"
            required
            defaultValue={post?.title}
            className={input}
            onChange={(e) => !slugTouched && setSlug(slugify(e.target.value))}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">URL slug</span>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={input}
          />
          <span className="mt-1 block text-xs text-ink/50">autocleaningkit.com/{slug || "…"}</span>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <select name="categorySlug" defaultValue={post?.categorySlug ?? categories[0]?.slug} className={input}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Excerpt</span>
          <textarea name="excerpt" rows={2} defaultValue={post?.excerpt} className={input} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Featured image path</span>
          <input name="featuredImage" defaultValue={post?.featuredImage?.src ?? ""} placeholder="/uploads/2026/07/example.jpg" className={input} />
        </label>
        <label className="flex items-center gap-2 self-end pb-2">
          <input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="size-4 accent-brand-500" />
          <span className="text-sm font-medium">Published</span>
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium">Article text (Markdown)</span>
          <textarea
            name="body"
            rows={16}
            defaultValue={post?.body}
            placeholder={"## Why this matters\n\nWrite the guide here. Use ## for headings, - for lists and [text](https://…) for links."}
            className={`${input} font-mono text-sm`}
          />
        </label>
      </section>

      <section>
        <h2 className="text-lg font-bold">Product picks</h2>
        <p className="text-sm text-ink/60">Shown as a numbered list under the article. Add a link to show a “Check price” button.</p>
        <div className="mt-4 space-y-3">
          {existing.map((p, i) => (
            <ProductRow key={p.id} index={i} product={p} />
          ))}
          {Array.from({ length: extra }, (_, k) => (
            <ProductRow key={`new-${k}`} index={existing.length + k} product={null} />
          ))}
        </div>
        <button type="button" onClick={() => setExtra((n) => n + 1)} className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700">
          + Add another product
        </button>
      </section>

      {post && (
        <section className="border-t border-black/10 pt-6">
          <button
            type="button"
            onClick={async () => {
              if (confirm(`Delete “${post.title}”? This can't be undone.`)) await deletePost(post.id);
            }}
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Delete this post
          </button>
        </section>
      )}
    </form>
  );
}

function ProductRow({ index, product }: { index: number; product: Product | null }) {
  const f = (name: string) => `product.${index}.${name}`;
  return (
    <fieldset className="grid gap-3 rounded-xl border border-black/10 p-4 md:grid-cols-[2fr_3fr]">
      {product && <input type="hidden" name={f("id")} value={product.id} />}
      <label className="block">
        <span className="text-xs font-medium text-ink/70">{product ? `#${index + 1} Name` : "New product name"}</span>
        <input name={f("name")} defaultValue={product?.name} className={input} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-ink/70">Link (Amazon or retailer)</span>
        <input name={f("url")} type="url" defaultValue={product?.url ?? ""} placeholder="https://www.amazon.com/dp/…" className={input} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-ink/70">Image path</span>
        <input name={f("image")} defaultValue={product?.image?.src ?? ""} placeholder="/uploads/…" className={input} />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-ink/70">Short summary</span>
        <input name={f("summary")} defaultValue={product?.summary} className={input} />
      </label>
      {product && (
        <label className="flex items-center gap-2 text-sm text-red-700 md:col-span-2">
          <input type="checkbox" name={f("remove")} className="size-4 accent-red-600" />
          Remove this product
        </label>
      )}
    </fieldset>
  );
}
