import type { Session, User } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type AuthPayload = {
  email: string;
  password: string;
};

export async function getCurrentSession() {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return {
      session: null,
      user: null,
      error: new Error("Supabase 환경변수가 설정되지 않았습니다."),
    };
  }

  const { data, error } = await client.auth.getSession();

  return {
    session: data.session,
    user: data.session?.user ?? null,
    error: error ?? null,
  };
}

export async function signInWithEmail(payload: AuthPayload) {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return {
      session: null,
      user: null,
      error: new Error("Supabase 환경변수가 설정되지 않았습니다."),
    };
  }

  const { data, error } = await client.auth.signInWithPassword(payload);

  return {
    session: data.session,
    user: data.user,
    error: error ?? null,
  };
}

export async function signUpWithEmail(payload: AuthPayload) {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return {
      session: null,
      user: null,
      error: new Error("Supabase 환경변수가 설정되지 않았습니다."),
    };
  }

  const { data, error } = await client.auth.signUp(payload);

  return {
    session: data.session,
    user: data.user,
    error: error ?? null,
  };
}

export async function signOutUser() {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return { error: new Error("Supabase 환경변수가 설정되지 않았습니다.") };
  }

  const { error } = await client.auth.signOut();
  return { error: error ?? null };
}

export function subscribeAuthStateChange(
  callback: (session: Session | null, user: User | null) => void,
) {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return {
      unsubscribe: () => undefined,
    };
  }

  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((_event, session) => {
    callback(session, session?.user ?? null);
  });

  return {
    unsubscribe: () => subscription.unsubscribe(),
  };
}
