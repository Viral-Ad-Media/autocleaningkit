/**
 * Creates (or resets the password of) an editor account.
 *   npm run create-admin -- you@example.com "a long password" "Your Name"
 */
import { config } from "dotenv";
config({ path: [".env.local", ".env"] });

async function main() {
  const [email, password, name = "Editor"] = process.argv.slice(2);
  if (!email || !password || password.length < 10) {
    console.error('Usage: npm run create-admin -- <email> "<password, 10+ chars>" ["Name"]');
    process.exit(1);
  }
  const { db, schema } = await import("../src/db");
  const { and, eq } = await import("drizzle-orm");
  const { hashPassword } = await import("better-auth/crypto");
  const hash = await hashPassword(password);
  const normalized = email.toLowerCase();

  const u = await db.query.user.findFirst({ where: eq(schema.user.email, normalized) });
  if (!u) {
    const id = crypto.randomUUID();
    await db.insert(schema.user).values({ id, email: normalized, name, emailVerified: true });
    await db.insert(schema.account).values({
      id: crypto.randomUUID(),
      accountId: id,
      providerId: "credential",
      userId: id,
      password: hash,
    });
    console.log(`Created editor ${normalized}`);
  } else {
    await db
      .update(schema.account)
      .set({ password: hash, updatedAt: new Date() })
      .where(and(eq(schema.account.userId, u.id), eq(schema.account.providerId, "credential")));
    console.log(`Updated password for ${normalized}`);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
