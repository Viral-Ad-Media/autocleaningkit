import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog", alternates: { canonical: "/blog" } };

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <div className="container-site py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">All guides</h1>
      <p className="mt-2 text-ink/70">Every product round-up and how-to on Auto Cleaning Kit.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <PostCard key={p.id} post={p} priority={i < 3} />
        ))}
      </div>
    </div>
  );
}
