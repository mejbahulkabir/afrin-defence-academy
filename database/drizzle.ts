import { config } from "dotenv";
config({ path: ".env.local" });

import * as appSchema from "@/database/app-schema";
import * as authSchema from "@/database/auth-schema";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const schema = {
  ...appSchema,
  ...authSchema,
};

const connectionUrl = process.env.DATABASE_URL!;

if (!connectionUrl) {
  console.warn("Warning: DATABASE_URL is not defined in environment variables.");
}

declare global {
  // eslint-disable-next-line no-var
  var drizzlePoolCache: mysql.Pool | undefined;
}

const pool =
  global.drizzlePoolCache ??
  mysql.createPool(connectionUrl);

if (process.env.NODE_ENV !== "production") {
  global.drizzlePoolCache = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });