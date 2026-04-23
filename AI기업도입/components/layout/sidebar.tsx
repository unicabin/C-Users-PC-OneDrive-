"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { getPlatformMenuGroups } from "@/services/architecture-service";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const rawPathname = usePathname();
  const pathname = rawPathname ?? "/";
  const router = useRouter();
  const menuGroups = getPlatformMenuGroups();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/60 bg-slate-950 text-white lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-6 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-16 items-center justify-center rounded-2xl bg-white/95 p-2 shadow-sm">
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
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                UNITOP AI
              </p>
              <h1 className="mt-1 whitespace-nowrap text-lg font-semibold text-slate-50">
                스마트 제품개발 플랫폼
              </h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-5">
            {menuGroups.map((group) => (
              <section key={group.title}>
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {group.title}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const active = isActivePath(pathname, item.href);

                    return (
                      <li key={`${group.title}-${item.href}-${item.label}`}>
                        <button
                          type="button"
                          onClick={() => router.push(item.href)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition",
                            active
                              ? "bg-brand-500 text-white shadow-lg shadow-brand-950/20"
                              : "text-slate-300 hover:bg-white/5 hover:text-white",
                          )}
                          title={item.description}
                        >
                          <span className="text-left">{item.label}</span>
                          <ChevronRight className="h-4 w-4 opacity-70" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </nav>

        <div className="m-4 rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            AI 운영 구조
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-200">
            RAG 기반 지식검색과 ML 기반 예측분석을 통합해 제품개발 의사결정을
            지원합니다.
          </p>
        </div>
      </div>
    </aside>
  );
}
