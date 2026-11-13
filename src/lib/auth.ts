import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    // This is a publishing site, not a membership site: editors are created with
    // `npm run create-admin`. Set ALLOW_SIGNUP=true only if you want open sign-ups.
    disableSignUp: process.env.ALLOW_SIGNUP !== "true",
    minPasswordLength: 10,
  },
  plugins: [nextCookies()],
});

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Use at the top of every admin page and server action. */
export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session.user;
}
