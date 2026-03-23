import Link from "next/link";
import { navigation } from "@/data/site";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="border-t border-line bg-navy py-14 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-2xl font-semibold tracking-[0.2em]">UNITOP</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              Forklift Total Solution for safety, cabin, HVAC and expandable smart
              operation environments.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Sitemap
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Contact
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Industrial Vehicle Solution Partner</p>
              <p>Future-ready structure for KR / JP expansion</p>
              <Link href="/contact" className="inline-flex text-white transition hover:text-blue-200">
                문의 페이지 바로가기
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
