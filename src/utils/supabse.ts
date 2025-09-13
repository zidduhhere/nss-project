import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const value = process.env[name as keyof NodeJS.ProcessEnv];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const supabaseUrl = requireEnv("VITE_SUPABASE_URL");
const supabaseKey = requireEnv("VITE__SUPABASE_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseKey);
