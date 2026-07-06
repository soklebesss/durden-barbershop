import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* A single browser client. Guarded so a missing/half-configured .env never
   throws at import time — the UI checks `isSupabaseConfigured` and degrades to
   a clear "not configured" message instead of a white screen. */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, { auth: { persistSession: false } })
  : null;
