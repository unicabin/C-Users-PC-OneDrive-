import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export async function getSupabaseClientAndUserId() {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return {
      client: null,
      userId: null,
      error: new Error("Supabase environment is not configured."),
    };
  }

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) {
    return {
      client,
      userId: null,
      error: error ?? new Error("Authenticated user not found."),
    };
  }

  return {
    client,
    userId: user.id,
    error: null,
  };
}
