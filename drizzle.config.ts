import 'dotenv/config';
import { config } from "dotenv";
import { defineConfig } from 'drizzle-kit';

config({ path: ".env.local" });

export default defineConfig({
  out: './database/migrations',
  schema: [
    "./database/auth-schema.ts",
    "./database/app-schema.ts",
  ],
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
