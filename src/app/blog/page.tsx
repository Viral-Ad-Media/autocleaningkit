import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "All guides", alternates: { canonical: "/blog" } };

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <div className="wrap pt-12 pb-20 md:pt-20 md:pb-28">
      <nav aria-label="Breadcrumb" className="t-label text-muted">
        <Link href="/" className="link">
          Home
        </Link>
      </nav>
      <h1 className="t-h1-page mt-5">All guides</h1>
      <p className="t-lead measure mt-4 text-ink/80">
        Every buying guide and how-to on Auto Cleaning Kit, newest first.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
        {posts.map((p, i) => (
          <PostCard key={p.id} post={p} priority={i < 3} />
        ))}
      </div>
    </div>
  );
}
