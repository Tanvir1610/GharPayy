import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Browser client for client-side DB operations (saved_pgs, etc.)
// Uses anon key — relies on service role being set for read access
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
