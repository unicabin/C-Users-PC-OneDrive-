"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/data/site";
import { Container } from "@/components/ui/container";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/90 backdrop-blur-xl">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="text-2xl font-semibold tracking-[0.2em] text-navy">
            UNITOP
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/products" && pathname.startsWith("/products"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition ${
                    isActive ? "text-blue" : "text-slate-600 hover:text-navy"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue"
          >
            Contact
          </Link>
        </div>
      </Container>
    </header>
  );
}
