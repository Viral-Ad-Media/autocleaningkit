import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PostCard } from "@/components/post-card";
import { formatDate } from "@/lib/format";
import { getCategory, getPublishedPost, getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

// WordPress served posts and category archives from the same top-level URLs
// (/best-polishing-machines-2026/, /exterior/), so this route handles both.

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategory(slug);
  if (category) return { title: category.name, description: category.description, alternates: { canonical: `/${slug}` } };
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featuredImage ? [post.featuredImage.src] : undefined,
    },
  };
}

export default async function SlugPage(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;

  const category = await getCategory(slug);
  if (category) {
    const posts = await getPublishedPosts({ category: slug });
    return (
      <div className="container-site py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">Category</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{category.name}</h1>
        <p className="mt-2 max-w-2xl text-ink/70">{category.description}</p>
        {posts.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <PostCard key={p.id} post={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-ink/60">No guides in this category yet.</p>
        )}
      </div>
    );
  }

  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const img = post.featuredImage;
  const wide = img ? img.width / img.height > 1.2 : false;
  const related = (await getPublishedPosts({ category: post.categorySlug })).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article>
      <header className="bg-brand-50">
        <div className="container-site grid items-center gap-8 py-12 md:grid-cols-2">
          <div>
            <Link href={`/${post.categorySlug}`} className="text-sm font-semibold uppercase tracking-wider text-brand-500 hover:text-brand-700">
              {post.category.name}
            </Link>
            <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
            {post.excerpt && <p className="mt-4 text-lg text-ink/70">{post.excerpt}</p>}
            <p className="mt-4 text-sm text-ink/50">Updated {formatDate(post.updatedAt > post.publishedAt ? post.updatedAt : post.publishedAt)}</p>
          </div>
          {img && (
            <div className={`relative overflow-hidden rounded-xl bg-white shadow-sm ${wide ? "aspect-[3/2]" : "aspect-square"}`}>
              <Image src={img.src} alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className={wide ? "object-cover" : "object-contain p-8"} />
            </div>
          )}
        </div>
      </header>

      <div className="container-site mt-10 max-w-3xl">
        {post.body && (
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-brand-600">
            <Markdown remarkPlugins={[remarkGfm]}>{post.body}</Markdown>
          </div>
        )}

        {post.products.length > 0 && (
          <section className={post.body ? "mt-12" : ""}>
            <h2 className="text-2xl font-bold">Our picks</h2>
            <ol className="mt-6 space-y-5">
              {post.products.map((pr, i) => (
                <li key={pr.id} id={`pick-${i + 1}`} className="flex flex-col gap-5 rounded-xl border border-black/5 p-5 shadow-sm sm:flex-row sm:items-center">
                  <div className="relative mx-auto aspect-square w-40 shrink-0 sm:mx-0">
                    {pr.image && <Image src={pr.image.src} alt={pr.name} fill sizes="160px" className="object-contain" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-brand-500">#{i + 1}</p>
                    <h3 className="text-xl font-bold">{pr.name}</h3>
                    {pr.summary && <p className="mt-2 text-ink/75">{pr.summary}</p>}
                    {pr.url && (
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                        className="mt-4 inline-block rounded-full bg-sun px-5 py-2 text-sm font-bold text-ink transition hover:brightness-95"
                      >
                        Check price on Amazon
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {!post.body && post.products.length === 0 && (
          <p className="rounded-xl bg-brand-50 p-6 text-ink/70">This guide is being updated. Check back soon.</p>
        )}
      </div>

      {related.length > 0 && (
        <section className="container-site mt-16">
          <h2 className="text-2xl font-bold">More in {post.category.name}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
