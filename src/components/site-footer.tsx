import Link from "next/link";

const links = [
  { href: "/exterior", label: "Exterior" },
  { href: "/interior", label: "Interior" },
  { href: "/paint-correction", label: "Paint Correction" },
  { href: "/accessories", label: "Accessories" },
  { href: "/general-accessories", label: "General Accessories" },
  { href: "/car-detailing", label: "Car Detailing" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-ink text-white/80">
      <div className="container-site grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">Auto Cleaning Kit</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            Guides and product round-ups to help you clean, polish and protect your car at home.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Categories</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm leading-relaxed">
          <p className="font-semibold uppercase tracking-wider text-white">Affiliate disclosure</p>
          <p className="mt-3">
            As an Amazon Associate we earn from qualifying purchases. This doesn&apos;t change the price you pay.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-white/50">
          <p>© {new Date().getFullYear()} autocleaningkit.com</p>
          <Link href="/sign-in" className="hover:text-white">
            Editor sign-in
          </Link>
        </div>
      </div>
    </footer>
  );
}
