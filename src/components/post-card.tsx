import Image from "next/image";
import Link from "next/link";
import type { PostWithCategory } from "@/lib/queries";
import { formatDate } from "@/lib/format";

export function PostCard({ post, priority }: { post: PostWithCategory; priority?: boolean }) {
  const img = post.featuredImage;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/${post.slug}`} className="relative block aspect-[3/2] overflow-hidden bg-brand-50">
        {img && (
          <Image
            src={img.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className={img.width / img.height > 1.2 ? "object-cover" : "object-contain p-6"}
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/${post.categorySlug}`} className="text-xs font-semibold uppercase tracking-wider text-brand-500 hover:text-brand-700">
          {post.category.name}
        </Link>
        <h3 className="mt-2 text-lg font-bold leading-snug">
          <Link href={`/${post.slug}`} className="hover:text-brand-600">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-[15px] text-ink/70">{post.excerpt}</p>}
        <p className="mt-auto pt-4 text-xs text-ink/50">{formatDate(post.publishedAt)}</p>
      </div>
    </article>
  );
}
