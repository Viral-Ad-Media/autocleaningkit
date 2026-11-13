import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");

/**
 * Neon in production (HTTP driver, no connection pool needed on serverless).
 * Plain Postgres for local development when DATABASE_URL is not a Neon host.
 */
const isNeon = /\.neon\.tech|\.neon\.build/.test(url);

// Both drivers expose the same query API; type them as one so callers don't see a union.
type Db = NodePgDatabase<typeof schema>;

function create(): Db {
  if (isNeon) return drizzleNeon({ client: neon(url!), schema }) as unknown as Db;
  return drizzlePg({ client: new Pool({ connectionString: url }), schema });
}

const globalForDb = globalThis as unknown as { db?: ReturnType<typeof create> };
export const db = globalForDb.db ?? create();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export { schema };
