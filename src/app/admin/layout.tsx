import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireUser();
  return (
    <div className="container-site py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
        <nav className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/admin" className="hover:text-brand-600">Posts</Link>
          <Link href="/admin/posts/new" className="hover:text-brand-600">New post</Link>
          <Link href="/" className="text-ink/60 hover:text-brand-600">View site ↗</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm text-ink/60">
          <span>{user.email}</span>
          <SignOutButton />
        </div>
      </div>
      <div className="pt-8">{children}</div>
    </div>
  );
}
