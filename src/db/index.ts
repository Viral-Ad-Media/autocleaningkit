import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Both drivers expose the same query API; type them as one so callers don't see a union.
type Db = NodePgDatabase<typeof schema>;

/**
 * Neon in production (HTTP driver, no connection pool needed on serverless).
 * Plain Postgres for local development when DATABASE_URL is not a Neon host.
 *
 * The connection is opened on first use, not at import time, so `next build`
 * can load every route module without DATABASE_URL being set.
 */
function create(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
  if (/\.neon\.tech|\.neon\.build/.test(url)) {
    return drizzleNeon({ client: neon(url), schema }) as unknown as Db;
  }
  return drizzlePg({ client: new Pool({ connectionString: url }), schema });
}

const globalForDb = globalThis as unknown as { db?: Db };

function getDb(): Db {
  if (!globalForDb.db) globalForDb.db = create();
  return globalForDb.db;
}

export const db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
