// Side-effect-only module: loads .env.local before any module that reads process.env.
// Imported first by scripts that run outside Next.js (e.g. pnpm db:seed).
import { config } from "dotenv";
config({ path: ".env.local" });
