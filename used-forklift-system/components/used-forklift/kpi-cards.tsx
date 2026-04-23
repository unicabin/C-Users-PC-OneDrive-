import { KpiCardItem } from "@/types/used-forklift";

type KpiCardsProps = {
  items: KpiCardItem[];
};

export function KpiCards({ items }: KpiCardsProps) {
  return (
    <div className="grid gap-4 border-b border-line bg-slate-50/70 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-3xl border border-line bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold text-navy">{item.value}</p>
          {item.helper ? (
            <p className="mt-2 text-xs font-medium text-slate-400">{item.helper}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
