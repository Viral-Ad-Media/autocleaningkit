"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignInForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Sign-in failed.");
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input name="email" type="email" required autoComplete="email" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
      </label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-brand-500 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
