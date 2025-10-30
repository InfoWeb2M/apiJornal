import "dotenv/config"; // já carrega o .env
import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL);
