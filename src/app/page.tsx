import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import seed from "@/content/seed.json";
import { getCategories, getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

const bannerLinks = [
  "/car-detailing-brushes-2026",
  "/best-car-carpets-2023",
  "/top-polish-applicator-2023",
  "/best-polishing-machines-2026",
];
const bannerAlts = [
  "Best car detailing brushes",
  "Best car carpets for cars",
  "Best polish applicators for cars",
  "Best polishing machines for cars",
];

export default async function HomePage() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const [lead, ...rest] = posts;
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.categorySlug, (counts.get(p.categorySlug) ?? 0) + 1);
  const hero = seed.brand.hero;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        {hero && (
          <Image src={hero.src} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-40" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        <div className="container-site py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sun">Detail your car at home</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            The right kit, the right steps, a showroom finish.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">
            Hands-on guides and product round-ups for cleaning, polishing and protecting every part of your car.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/how-to-detail-a-car-at-home" className="rounded-full bg-brand-500 px-6 py-3 font-semibold transition hover:bg-brand-600">
              Start with the 9-step guide
            </Link>
            <Link href="/blog" className="rounded-full border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10">
              Browse all guides
            </Link>
          </div>
        </div>
      </section>

      <section className="container-site relative z-10 -mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {seed.brand.banners.map((b, i) => (
          <Link
            key={b.src}
            href={bannerLinks[i]}
            className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Image src={b.src} width={b.width} height={b.height} alt={bannerAlts[i]} className="h-auto w-full" />
          </Link>
        ))}
      </section>

      {lead && (
        <section className="container-site mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold sm:text-3xl">Latest guides</h2>
            <Link href="/blog" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[lead, ...rest].slice(0, 6).map((p, i) => (
              <PostCard key={p.id} post={p} priority={i < 3} />
            ))}
          </div>
        </section>
      )}

      <section className="container-site mt-20">
        <h2 className="text-2xl font-bold sm:text-3xl">Shop by area of the car</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="group rounded-xl border border-black/5 bg-brand-50 p-6 transition hover:border-brand-500/30 hover:bg-brand-100"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold group-hover:text-brand-700">{c.name}</h3>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-brand-600">
                  {counts.get(c.slug) ?? 0} {(counts.get(c.slug) ?? 0) === 1 ? "guide" : "guides"}
                </span>
              </div>
              <p className="mt-2 text-[15px] text-ink/70">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
