import { ReactNode } from "react";
import { DataBadge } from "@/components/used-forklift/data-badge";

type SectionCardProps = {
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
};

export function SectionCard({
  title,
  description,
  badge,
  children,
}: SectionCardProps) {
  return (
    <section className="panel p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-navy">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        {badge ? (
          <DataBadge tone="bg-slate-100 text-slate-700 ring-1 ring-slate-200">
            {badge}
          </DataBadge>
        ) : null}
      </div>
      {children}
    </section>
  );
}
