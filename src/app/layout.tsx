import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const hind = localFont({
  variable: "--font-hind",
  display: "swap",
  src: [
    { path: "../fonts/hind-300.woff2", weight: "300" },
    { path: "../fonts/hind-400.woff2", weight: "400" },
    { path: "../fonts/hind-500.woff2", weight: "500" },
    { path: "../fonts/hind-600.woff2", weight: "600" },
    { path: "../fonts/hind-700.woff2", weight: "700" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL ?? "https://autocleaningkit.com"),
  title: { default: "Auto Cleaning Kit: Car Detailing Guides & Product Reviews", template: "%s | Auto Cleaning Kit" },
  description:
    "Honest guides to car cleaning kits, polishers, interior cleaners and detailing tools, so you can detail your car at home.",
  openGraph: { siteName: "Auto Cleaning Kit", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={hind.variable}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
