import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const migrationUrl =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error(
    "DATABASE_URL_UNPOOLED (preferred) or DATABASE_URL must be set in .env.local",
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl,
  },
  verbose: true,
  strict: true,
});
