import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { PostCard } from "@/components/post-card";
import { Statement } from "@/components/statement";
import seed from "@/content/seed.json";
import { getCategories, getPublishedPosts, getStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

// One real product from each area of the car, shot on white, for the category cards.
const categoryPictures: Record<string, { src: string; alt: string }> = {
  exterior: { src: "/uploads/2022/12/Meguiars-G180132-Ultimate-All-Wheel-Cleaner.jpg", alt: "A bottle of wheel cleaner" },
  interior: { src: "/uploads/2022/12/Chemical-Guys-Sprayable-Leather-Cleaner-and-conditioner.jpg", alt: "Leather cleaner and conditioner bottles" },
  "paint-correction": { src: "/uploads/2022/12/Adams-Swirl-Killer-15mm-Car-Polisher.jpg", alt: "A dual-action car polisher" },
  accessories: { src: "/uploads/2022/12/SPTA-Car-Detailing-Brush-Kit.jpeg", alt: "A set of detailing brushes" },
  "general-accessories": { src: "/uploads/2022/12/Chemical-Guys-HOL126-14-Piece-Car-Wash-Kit.jpg", alt: "A car wash kit with bucket and bottles" },
  "car-detailing": { src: "/uploads/2022/12/AUTODECO-25Pcs-Microfibre-Car-Wash-Set.webp", alt: "Microfibre towels and wash mitts" },
};

export default async function HomePage() {
  const [posts, categories, stats] = await Promise.all([getPublishedPosts(), getCategories(), getStats()]);
  const [lead, ...rest] = posts;
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.categorySlug, (counts.get(p.categorySlug) ?? 0) + 1);
  const hero = seed.brand.hero;

  return (
    <>
      {/* Hero: what the site is, one hard fact, the two ways in. */}
      <section className="wrap grid items-center gap-10 pt-10 pb-4 md:grid-cols-12 md:gap-12 md:pt-16 md:pb-24 lg:min-h-[calc(100svh-var(--nav))]">
        <div className="enter md:col-span-6 lg:col-span-6">
          <p className="t-label text-muted">Car detailing at home</p>
          <h1 className="t-h1 mt-5">Car cleaning kits and the steps to use them.</h1>
          <p className="t-lead measure mt-6 text-ink/80">
            Buying guides for polishers, cleaners, brushes and covers, each with what to check before you buy, plus a
            nine-step routine that puts them to work.
          </p>
          {stats.guides > 0 && (
            <p className="mt-6 text-muted">
              {stats.guides} guides · {stats.picks} products compared
            </p>
          )}
          <div className="btn-row mt-8 flex flex-wrap gap-3">
            <Link href="/how-to-detail-a-car-at-home" className="btn btn--primary">
              Start the 9-step guide
              <Arrow />
            </Link>
            <Link href="/blog" className="btn btn--secondary">
              Browse all guides
            </Link>
          </div>
        </div>
        {hero && (
          <div className="enter-picture relative aspect-[4/3] overflow-hidden rounded-lg bg-surface md:col-span-6 md:aspect-[4/5] lg:aspect-[5/6]">
            <Image
              src={hero.src}
              alt="A man polishing a car's paintwork in a garage"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[30%_50%]"
            />
          </div>
        )}
      </section>

      {/* Latest guides: the newest one wide, the next three under it. */}
      {lead && (
        <section className="wrap py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="t-h2">New buying guides</h2>
            <Link href="/blog" className="link font-medium">
              See all {posts.length} guides
            </Link>
          </div>
          <div className="mt-10 md:mt-12">
            <PostCard post={lead} priority size="lead" />
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(0, 3).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* The one statement the page stands on; it lights up word by word as it scrolls past. */}
      <section className="border-y border-line bg-card">
        <div className="wrap grid gap-10 py-24 md:grid-cols-12 md:py-36">
          <div className="md:col-span-9">
            <Statement parts="Wash, decontaminate, polish, then *protect what you polished.* Most swirl marks come from doing those four in the wrong order." />
          </div>
          <div className="flex items-end md:col-span-3 md:justify-end">
            <Link href="/how-to-detail-a-car-at-home" className="btn btn--secondary">
              Read the routine
              <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories: one real product photo for each part of the car. */}
      <section className="wrap py-20 md:py-28">
        <h2 className="t-h2">Shop by part of the car</h2>
        <p className="t-lead measure mt-4 text-ink/80">Pick the area you&apos;re working on and see every guide for it.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {categories.map((c) => {
            const pic = categoryPictures[c.slug];
            const n = counts.get(c.slug) ?? 0;
            return (
              <article key={c.slug} className="card">
                <div className="card__media aspect-[16/10] border-b border-line">
                  {pic && (
                    <Image src={pic.src} alt={pic.alt} fill sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="object-contain p-8" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="card__title t-card">
                      <Link href={`/${c.slug}`} className="card__link">
                        {c.name}
                      </Link>
                    </h3>
                    <span className="shrink-0 text-sm text-muted">
                      {n} {n === 1 ? "guide" : "guides"}
                    </span>
                  </div>
                  <p className="mt-2 text-ink/80">{c.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Brand band: the one block in the brand colour, for a first-time buyer. */}
      <section className="wrap pb-20 md:pb-28">
        <div className="on-dark grid items-center gap-8 overflow-hidden rounded-lg bg-accent text-white md:grid-cols-12">
          <div className="p-8 md:col-span-6 md:p-14 lg:p-16">
            <h2 className="t-h2">New to detailing? Start with one kit.</h2>
            <p className="t-lead mt-5 max-w-[44ch] text-white/90">
              A complete kit covers the wash, the wax and the interior in one box, so you can learn the routine before
              buying single products.
            </p>
            <div className="btn-row mt-8 flex flex-wrap gap-3">
              <Link href="/car-cleaning-kits-2026" className="btn btn--light">
                Compare car cleaning kits
                <Arrow />
              </Link>
            </div>
          </div>
          <div className="relative mx-8 mb-8 aspect-[4/3] overflow-hidden rounded-md bg-white md:col-span-6 md:m-8 md:ml-0">
            <Image
              src="/uploads/2022/12/Meguiars-G55032SP-Complete-Car-Care-Kit.jpg"
              alt="A complete car care kit with wash, wax and interior products"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-contain p-6"
            />
          </div>
        </div>
      </section>
    </>
  );
}

