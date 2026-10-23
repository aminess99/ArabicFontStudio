import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to serve the font catalog.");
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
});

export const db = drizzle(pool, { schema });
