import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Verify if the user has provided actual, real Supabase credentials
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("sua-url-do-supabase") && 
  supabaseUrl.startsWith("https://");

// Initialize client if credentials are real, otherwise export null to fallback to simulated authentication
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured && process.env.NODE_ENV === "development") {
  console.warn(
    "⚠️ EbookForge AI: Supabase não está configurado. Rodando em modo de simulação (Local Storage). Adicione suas credenciais reais no arquivo .env.local para conectar ao banco de dados real."
  );
}
