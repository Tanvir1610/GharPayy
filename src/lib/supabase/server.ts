import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Admin client — bypasses RLS, use for all server-side DB operations
// Auth is now handled by Clerk, not Supabase
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// Alias for backward compat in any places that import createClient
export const createClient = createAdminClient;
