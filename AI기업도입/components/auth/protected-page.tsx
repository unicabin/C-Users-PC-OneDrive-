"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { hasSupabaseEnv } from "@/lib/supabase/client";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasSupabaseEnv()) return;
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname ?? "/")}` as `/login?redirect=${string}`);
    }
  }, [loading, pathname, router, user]);

  if (hasSupabaseEnv() && (loading || !user)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-panel">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            인증 상태를 확인하고 있습니다
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            프로젝트 관리는 로그인한 사용자만 접근할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
