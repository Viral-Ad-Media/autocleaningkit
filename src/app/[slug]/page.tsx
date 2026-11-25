import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Arrow } from "@/components/arrow";
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
      <div className="wrap pt-12 pb-20 md:pt-20 md:pb-28">
        <nav aria-label="Breadcrumb" className="t-label text-muted">
          <Link href="/" className="link">
            Home
          </Link>{" "}
          / <Link href="/blog" className="link">Guides</Link>
        </nav>
        <h1 className="t-h1-page mt-5">{category.name}</h1>
        <p className="t-lead measure mt-4 text-ink/80">{category.description}</p>
        <p className="mt-3 text-muted">
          {posts.length} {posts.length === 1 ? "guide" : "guides"}
        </p>
        {posts.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
            {posts.map((p, i) => (
              <PostCard key={p.id} post={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-ink/80">No guides in this category yet.</p>
        )}
      </div>
    );
  }

  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const img = post.featuredImage;
  const wide = img ? img.width / img.height > 1.2 : false;
  const related = (await getPublishedPosts({ category: post.categorySlug })).filter((p) => p.id !== post.id).slice(0, 3);
  const picks = post.products.length;

  return (
    <article>
      <header className="wrap grid items-center gap-10 pt-10 pb-12 md:grid-cols-12 md:gap-12 md:pt-16 md:pb-20">
        <div className="enter md:col-span-6">
          <nav aria-label="Breadcrumb" className="t-label text-muted">
            <Link href="/" className="link">
              Home
            </Link>{" "}
            /{" "}
            <Link href={`/${post.categorySlug}`} className="link text-accent">
              {post.category.name}
            </Link>
          </nav>
          <h1 className="t-h1-page mt-5">{post.title}</h1>
          {post.excerpt && <p className="t-lead measure mt-5 text-ink/80">{post.excerpt}</p>}
          <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted">
            <span>Updated {formatDate(post.updatedAt > post.publishedAt ? post.updatedAt : post.publishedAt)}</span>
            {picks > 0 && (
              <a href="#picks" className="link font-medium text-ink">
                Jump to the {picks} picks
              </a>
            )}
          </p>
        </div>
        {img && (
          <div className={`enter-picture relative overflow-hidden rounded-lg border border-line bg-card md:col-span-6 ${wide ? "aspect-[3/2]" : "aspect-[4/3]"}`}>
            <Image src={img.src} alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className={wide ? "object-cover" : "object-contain p-10"} />
          </div>
        )}
      </header>

      <div className="border-t border-line bg-card">
        <div className="wrap py-14 md:py-20">
          <div className="mx-auto max-w-[720px]">
            {post.body && (
              <div className="article-body prose prose-lg max-w-none prose-headings:font-normal prose-headings:tracking-tight">
                <Markdown remarkPlugins={[remarkGfm]}>{post.body}</Markdown>
              </div>
            )}

            {picks > 0 && (
              <section id="picks" className={post.body ? "mt-16" : ""}>
                <h2 className="t-h2">Our picks</h2>
                <ol className="mt-8 space-y-5">
                  {post.products.map((pr, i) => (
                    <li key={pr.id} id={`pick-${i + 1}`} className="grid gap-6 rounded-lg border border-line bg-ground p-5 sm:grid-cols-[176px_1fr] sm:items-center sm:p-6">
                      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-card sm:w-44">
                        {pr.image && <Image src={pr.image.src} alt={pr.name} fill sizes="176px" className="object-contain p-4" />}
                      </div>
                      <div>
                        <p className="display text-[28px] leading-none text-muted">{String(i + 1).padStart(2, "0")}</p>
                        <h3 className="t-card mt-3">{pr.name}</h3>
                        {pr.summary && <p className="mt-2 text-ink/80">{pr.summary}</p>}
                        {pr.url && (
                          <a href={pr.url} target="_blank" rel="sponsored nofollow noopener" className="btn btn--primary mt-5">
                            Check price on Amazon
                            <Arrow />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 text-sm text-muted">
                  Product details and prices change. Check the retailer&apos;s listing for current specs before you buy.
                </p>
              </section>
            )}

            {!post.body && picks === 0 && (
              <p className="rounded-lg bg-ground p-6 text-ink/80">This guide is being updated. Check back soon.</p>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="wrap py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="t-h2">More in {post.category.name}</h2>
            <Link href={`/${post.categorySlug}`} className="link font-medium">
              See the category
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
