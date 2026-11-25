import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Editor sign-in", robots: { index: false } };

export default async function SignInPage(props: PageProps<"/sign-in">) {
  const { next } = await props.searchParams;
  const dest = typeof next === "string" && next.startsWith("/admin") ? next : "/admin";
  if (await getSession()) redirect(dest);
  return (
    <div className="container-site flex justify-center py-20">
      <div className="w-full max-w-sm rounded-lg border border-line bg-card p-8">
        <h1 className="t-h3">Editor sign-in</h1>
        <p className="mt-1 text-muted">Manage guides and product picks.</p>
        <SignInForm next={dest} />
      </div>
    </div>
  );
}
