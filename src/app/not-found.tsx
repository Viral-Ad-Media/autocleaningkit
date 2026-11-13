import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-500">404</p>
      <h1 className="mt-2 text-3xl font-bold">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-ink/70">It may have moved when the site was rebuilt.</p>
      <Link href="/blog" className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600">
        Browse all guides
      </Link>
    </div>
  );
}
