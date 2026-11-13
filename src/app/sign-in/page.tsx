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
      <div className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Editor sign-in</h1>
        <p className="mt-1 text-sm text-ink/60">Manage guides and product picks.</p>
        <SignInForm next={dest} />
      </div>
    </div>
  );
}
