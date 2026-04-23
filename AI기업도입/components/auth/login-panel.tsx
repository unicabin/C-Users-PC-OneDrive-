"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import type { Route } from "next";
import { LoaderCircle, LogIn, UserPlus } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

export function LoginPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp, loading, error, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState<string | null>(null);

  const redirectParam = searchParams?.get("redirect");
  const redirect = redirectParam?.startsWith("/") ? redirectParam : "/projects";

  useEffect(() => {
    if (user) {
      router.replace(redirect as Route);
    }
  }, [redirect, router, user]);

  async function handleSubmit(nextMode: "login" | "signup") {
    setMode(nextMode);
    setMessage(null);

    if (!email.trim() || !password.trim()) {
      setMessage("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    const ok =
      nextMode === "login"
        ? await signIn(email, password)
        : await signUp(email, password);

    if (!ok) return;

    if (nextMode === "signup") {
      setMessage("회원가입이 완료되었습니다. 인증 메일이 설정된 경우 메일함을 확인해 주세요.");
    } else {
      router.replace(redirect as Route);
    }
  }

  return (
    <div className="grid min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.08),_transparent_42%),linear-gradient(180deg,_#f8fbfd_0%,_#eef4f7_100%)] px-6 py-10">
      <div className="m-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[36px] border border-white/70 bg-slate-950 p-8 text-white shadow-panel">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
            UNITOP SMART AI
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">
            제조업 제품개발 의사결정을 위한 관리자 플랫폼
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            기술자료 검색, 특허 분석, 성능 예측, 아이디어 생성, 보고서 출력까지
            하나의 흐름으로 연결된 실무형 AI 시스템입니다.
          </p>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-20 items-center justify-center rounded-2xl bg-white px-3">
                <Image
                  src="/unitop-logo.png"
                  alt="유니탑 로고"
                  width={96}
                  height={44}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-sm font-semibold">스마트 제품개발 플랫폼</p>
                <p className="mt-1 text-xs text-slate-400">
                  프로젝트별 데이터와 분석 흐름을 사용자 단위로 관리합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[36px] border border-white/70 bg-white p-8 shadow-panel">
          <div>
            <p className="text-sm font-medium text-brand-700">사용자 인증</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              이메일로 로그인
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Supabase Auth를 통해 로그인 상태를 유지하고 프로젝트 페이지 접근을
              제어합니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                이메일
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                비밀번호
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="8자 이상 입력"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </label>
          </div>

          {message ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => void handleSubmit("login")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
            >
              {loading && mode === "login" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              로그인
            </button>
            <button
              onClick={() => void handleSubmit("signup")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
            >
              {loading && mode === "signup" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              회원가입
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
