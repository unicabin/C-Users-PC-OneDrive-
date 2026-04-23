import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

export function getAuthBrowserClient() {
  return getSupabaseBrowserClient();
}

export function isAuthConfigured() {
  return isSupabaseConfigured();
}
