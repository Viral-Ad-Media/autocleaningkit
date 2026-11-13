"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.replace("/sign-in");
        router.refresh();
      }}
      className="rounded-full border border-black/15 px-3 py-1 font-medium text-ink hover:bg-black/5"
    >
      Sign out
    </button>
  );
}
