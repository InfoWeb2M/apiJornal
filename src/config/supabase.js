// src/config/supabase.js
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// ⚠️ força o carregamento do .env antes de criar o client
dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY_SERVICE) {
  console.error("❌ Variáveis de ambiente do Supabase não encontradas!");
  console.error("Verifique se o arquivo .env está na raiz e contém SUPABASE_URL e SUPABASE_KEY_SERVICE.");
  process.exit(1);
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY_SERVICE
);
