import Image from "next/image";
import Link from "next/link";
import seed from "@/content/seed.json";

// Short one-word labels so the bar never wraps; each lands on its category archive.
export const primaryNav = [
  { href: "/exterior", label: "Exterior" },
  { href: "/interior", label: "Interior" },
  { href: "/paint-correction", label: "Paint" },
  { href: "/accessories", label: "Accessories" },
  { href: "/car-detailing", label: "How-to" },
];

export function SiteHeader() {
  const logo = seed.brand.logo;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ground">
      <div className="wrap flex h-(--nav) items-center justify-between gap-6">
        <a className="skip-link" href="#top">
          Skip to content
        </a>
        <Link href="/" className="shrink-0" aria-label="Auto Cleaning Kit home">
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt="Car Cleaning Kit"
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
          {primaryNav.map((n) => (
            <Link key={n.href} href={n.href} className="link whitespace-nowrap text-ink">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href="/blog" className="btn btn--primary h-11">
            All guides
          </Link>
        </div>

        <details className="group lg:hidden">
          <summary
            className="flex size-11 cursor-pointer list-none items-center justify-center rounded-sm text-ink hover:bg-surface [&::-webkit-details-marker]:hidden"
            aria-label="Open the menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path className="group-open:hidden" d="M4 7h16M4 12h16M4 17h16" />
              <path className="hidden group-open:block" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </summary>
          <nav
            aria-label="Main"
            className="fixed inset-x-0 top-(--nav) bottom-0 overflow-y-auto border-t border-line bg-ground"
          >
            <div className="wrap flex flex-col py-6">
              {primaryNav.map((n) => (
                <Link key={n.href} href={n.href} className="t-h3 border-b border-line py-4 text-ink">
                  {n.label}
                </Link>
              ))}
              <Link href="/blog" className="btn btn--primary mt-8 w-full">
                All guides
              </Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
