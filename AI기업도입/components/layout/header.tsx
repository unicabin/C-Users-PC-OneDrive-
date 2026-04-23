"use client";

import { FormEvent, useState } from "react";
import { Bell, LogOut, Menu, Search, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Header() {
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/research?q=${encodeURIComponent(q)}` as `/research?q=${string}`);
    } else {
      router.push("/research");
    }
    setSearchQuery("");
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <>
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-slate-100/85 backdrop-blur">
        <div className="flex flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-medium text-brand-700">통합 관리자 대시보드</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                RAG/ML 기반 제품개발 의사결정 지원
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="flex min-w-[220px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-200">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="문서, 특허 검색 후 Enter"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </form>

            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm">
              <Bell className="h-5 w-5" />
            </button>

            <div className="hidden items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-panel sm:flex">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <div className="text-sm">
                <p className="font-medium">{user?.email ?? "관리자 모드"}</p>
                <p className="text-xs text-slate-300">인증 세션 정상 연결</p>
              </div>
            </div>

            {user ? (
              <button
                onClick={() => void handleSignOut()}
                disabled={loading}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            ) : null}
          </div>
        </div>
      </header>
    </>
  );
}

