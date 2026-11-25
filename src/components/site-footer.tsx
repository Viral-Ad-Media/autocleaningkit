import Link from "next/link";

const categories = [
  { href: "/exterior", label: "Exterior" },
  { href: "/interior", label: "Interior" },
  { href: "/paint-correction", label: "Paint correction" },
  { href: "/accessories", label: "Accessories" },
  { href: "/general-accessories", label: "Kits and essentials" },
  { href: "/car-detailing", label: "Car detailing" },
];

const start = [
  { href: "/how-to-detail-a-car-at-home", label: "Detail a car at home" },
  { href: "/car-cleaning-kits-2026", label: "Car cleaning kits" },
  { href: "/best-polishing-machines-2026", label: "Polishing machines" },
  { href: "/blog", label: "All guides" },
];

export function SiteFooter() {
  return (
    <footer className="on-dark bg-inv text-inv-ink">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <p className="display text-[28px] leading-tight">Auto Cleaning Kit</p>
          <p className="mt-4 max-w-sm text-inv-muted">
            Buying guides and step-by-step how-tos for cleaning, polishing and protecting your car at home.
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="t-label text-inv-muted">Categories</p>
          <ul className="mt-4 space-y-3">
            {categories.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="t-label text-inv-muted">Start here</p>
          <ul className="mt-4 space-y-3">
            {start.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="t-label text-inv-muted">Affiliate disclosure</p>
          <p className="mt-4 text-inv-muted">
            As an Amazon Associate we earn from qualifying purchases. It doesn&apos;t change the price you pay.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-wrap items-center justify-between gap-2 py-6 text-sm text-inv-muted">
          <p>© {new Date().getFullYear()} autocleaningkit.com</p>
          <Link href="/sign-in" className="link">
            Editor sign-in
          </Link>
        </div>
      </div>
    </footer>
  );
}
