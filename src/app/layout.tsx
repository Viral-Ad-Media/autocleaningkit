import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// Display face for headings, text face for everything else (two families, fixed jobs).
const display = Bricolage_Grotesque({
  variable: "--font-display-face",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "wdth"],
});
const text = Figtree({
  variable: "--font-text",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL ?? "https://autocleaningkit.com"),
  title: { default: "Auto Cleaning Kit: Car Detailing Guides & Product Reviews", template: "%s | Auto Cleaning Kit" },
  description:
    "Honest guides to car cleaning kits, polishers, interior cleaners and detailing tools, so you can detail your car at home.",
  openGraph: { siteName: "Auto Cleaning Kit", type: "website" },
};

export const viewport: Viewport = { themeColor: "#f3f3f0" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="top" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
