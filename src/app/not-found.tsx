import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-24 md:py-36">
      <p className="t-label text-muted">Page not found</p>
      <h1 className="t-h1-page mt-5 max-w-[18ch]">We couldn&apos;t find that page.</h1>
      <p className="t-lead measure mt-5 text-ink/80">It may have moved when the site was rebuilt. Every guide is still listed on one page.</p>
      <div className="btn-row mt-8 flex flex-wrap gap-3">
        <Link href="/blog" className="btn btn--primary">
          Browse all guides
        </Link>
        <Link href="/" className="btn btn--secondary">
          Go to the home page
        </Link>
      </div>
    </div>
  );
}
