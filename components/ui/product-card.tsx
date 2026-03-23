import Link from "next/link";
import { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white shadow-panel transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,30,57,0.14)]">
      <div className={`relative min-h-56 overflow-hidden bg-gradient-to-br ${product.accent} p-6`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,30,57,0.18),transparent_38%)]" />
        <div className="relative flex h-full flex-col justify-between rounded-[22px] border border-white/30 bg-white/50 p-5 backdrop-blur-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {product.category}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-navy">{product.title}</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
            {product.cardHighlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/80 bg-white/70 px-3 py-2 text-center"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-base leading-7 text-slate-600">{product.shortDesc}</p>
        <div className="mt-6">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center rounded-full border border-navy px-5 py-3 text-sm font-semibold text-navy transition hover:border-blue hover:text-blue"
          >
            상세보기
          </Link>
        </div>
      </div>
    </article>
  );
}
