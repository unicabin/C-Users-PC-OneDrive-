"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import {
  getCurrentSession,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  subscribeAuthStateChange,
} from "@/services/auth-service";
import { hasSupabaseEnv } from "@/lib/supabase/client";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(hasSupabaseEnv());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseEnv()) return;

    let mounted = true;

    const timer = window.setTimeout(async () => {
      const result = await getCurrentSession();

      if (!mounted) return;

      setSession(result.session);
      setUser(result.user);
      setError(result.error ? result.error.message : null);
      setLoading(false);
    }, 0);

    const subscription = subscribeAuthStateChange((nextSession, nextUser) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextUser);
    });

    return () => {
      mounted = false;
      window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user,
    session,
    loading,
    error,
    signIn: async (email, password) => {
      setLoading(true);
      const result = await signInWithEmail({ email, password });
      setSession(result.session);
      setUser(result.user);
      setError(result.error ? result.error.message : null);
      setLoading(false);
      return !result.error;
    },
    signUp: async (email, password) => {
      setLoading(true);
      const result = await signUpWithEmail({ email, password });
      setSession(result.session);
      setUser(result.user);
      setError(result.error ? result.error.message : null);
      setLoading(false);
      return !result.error;
    },
    signOut: async () => {
      setLoading(true);
      const result = await signOutUser();
      setError(result.error ? result.error.message : null);
      if (!result.error) {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
