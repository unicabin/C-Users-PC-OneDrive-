import { ReactNode } from "react";
import { Container } from "@/components/ui/container";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  actions
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_42%),linear-gradient(180deg,#f8fbff_0%,#ffffff_80%)] py-20 sm:py-24">
      <div className="absolute inset-0 bg-hero-grid bg-[length:42px_42px] opacity-40" />
      <Container className="relative">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            {description}
          </p>
          {actions ? <div className="mt-8 flex flex-wrap gap-4">{actions}</div> : null}
        </div>
      </Container>
    </section>
  );
}
