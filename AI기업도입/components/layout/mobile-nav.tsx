"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { getPlatformMenuGroups } from "@/services/architecture-service";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const rawPathname = usePathname();
  const pathname = rawPathname ?? "/";
  const router = useRouter();
  const menuGroups = getPlatformMenuGroups();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={drawerRef}
        className="absolute left-0 top-0 flex h-full w-72 flex-col bg-slate-950 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-14 items-center justify-center rounded-xl bg-white/95 p-1.5">
              <Image
                src="/unitop-logo.png"
                alt="유니탑 로고"
                width={80}
                height={36}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">UNITOP AI</p>
              <p className="text-sm font-semibold text-slate-50">스마트 제품개발</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
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
                          onClick={() => {
                            router.push(item.href);
                            onClose();
                          }}
                          className={cn(
                            "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition",
                            active
                              ? "bg-brand-500 text-white shadow-lg shadow-brand-950/20"
                              : "text-slate-300 hover:bg-white/5 hover:text-white",
                          )}
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
      </div>
    </div>
  );
}
