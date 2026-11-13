import Image from "next/image";
import Link from "next/link";
import seed from "@/content/seed.json";

const nav = [
  { href: "/exterior", label: "Exterior" },
  { href: "/interior", label: "Interior" },
  { href: "/paint-correction", label: "Paint Correction" },
  { href: "/accessories", label: "Accessories" },
  { href: "/car-detailing", label: "Car Detailing" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const logo = seed.brand.logo;
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="Auto Cleaning Kit home">
          <Image src={logo.src} width={logo.width} height={logo.height} alt="Car Cleaning Kit" priority className="h-10 w-auto sm:h-11" />
        </Link>
        <nav className="hidden items-center gap-6 text-[15px] font-medium lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink/80 transition-colors hover:text-brand-500">
              {n.label}
            </Link>
          ))}
        </nav>
        <details className="group relative lg:hidden">
          <summary className="flex cursor-pointer list-none items-center rounded-md p-2 text-ink hover:bg-brand-50" aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <nav className="absolute right-0 mt-2 w-56 rounded-lg border border-black/5 bg-white p-2 shadow-lg">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="block rounded-md px-3 py-2 font-medium hover:bg-brand-50 hover:text-brand-600">
                {n.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
