import Image from "next/image";
import Link from "next/link";
import type { PostWithCategory } from "@/lib/queries";
import { formatDate } from "@/lib/format";

/**
 * The site's one card. The title's link stretches over the whole card, so the card
 * lifts 2px and the picture zooms inside its frame on hover; the category link sits above it.
 * `size="lead"` is the same card laid out wide for the newest guide.
 */
export function PostCard({
  post,
  priority,
  size = "default",
}: {
  post: PostWithCategory;
  priority?: boolean;
  size?: "default" | "lead";
}) {
  const img = post.featuredImage;
  const wide = img ? img.width / img.height > 1.2 : false;
  const lead = size === "lead";
  return (
    <article className={`card h-full ${lead ? "md:grid md:grid-cols-12" : ""}`}>
      <div className={`card__media aspect-[3/2] ${lead ? "md:col-span-7 md:aspect-auto md:min-h-[420px]" : ""}`}>
        {img && (
          <Image
            src={img.src}
            alt=""
            fill
            sizes={lead ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"}
            priority={priority}
            className={wide ? "object-cover" : "object-contain p-8"}
          />
        )}
      </div>
      <div className={`flex flex-1 flex-col p-6 ${lead ? "md:col-span-5 md:justify-center md:p-10 lg:p-12" : ""}`}>
        <Link href={`/${post.categorySlug}`} className="card__above t-label link self-start text-accent">
          {post.category.name}
        </Link>
        <h3 className={`card__title mt-3 ${lead ? "t-h3 md:text-[34px]" : "t-card"}`}>
          <Link href={`/${post.slug}`} className="card__link">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className={`mt-3 text-ink/80 ${lead ? "t-lead" : "line-clamp-3"}`}>{post.excerpt}</p>}
        <p className="mt-auto pt-6 text-sm text-muted">{formatDate(post.publishedAt)}</p>
      </div>
    </article>
  );
}
