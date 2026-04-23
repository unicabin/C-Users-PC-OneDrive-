import type { DataTableDefinition } from "@/types/data-catalog";
import { getDataCatalog } from "@/services/data-catalog-service";

function HoldingsTable({
  title,
  rows,
}: {
  title: string;
  rows: ReturnType<typeof getDataCatalog>["rag"]["holdings"];
}) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white p-6 shadow-panel">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3">데이터명</th>
              <th className="px-4 py-3">데이터 유형</th>
              <th className="px-4 py-3">현재 보유</th>
              <th className="px-4 py-3">향후 구축</th>
              <th className="px-4 py-3">활용 기능</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {rows.map((row) => (
              <tr key={row.name}>
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="px-4 py-3">{row.dataType}</td>
                <td className="px-4 py-3">{row.hasNow}</td>
                <td className="px-4 py-3">{row.nextPlan}</td>
                <td className="px-4 py-3">{row.featureUsage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SchemaCard({ table }: { table: DataTableDefinition }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">{table.table}</h3>
        <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-600">
          {table.domain}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{table.description}</p>
      <p className="mt-1 text-xs text-slate-500">{table.relation}</p>

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr className="text-left">
              <th className="px-3 py-2">필드명</th>
              <th className="px-3 py-2">타입</th>
              <th className="px-3 py-2">설명</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {table.fields.map((field) => (
              <tr key={`${table.table}-${field.name}`}>
                <td className="px-3 py-2 font-medium text-slate-700">{field.name}</td>
                <td className="px-3 py-2 text-slate-600">{field.type}</td>
                <td className="px-3 py-2 text-slate-600">{field.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default function TechStatusPage() {
  const catalog = getDataCatalog();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/70 bg-brand-900 px-6 py-7 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-200">
          Technology & Data Status
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          기술 구조 및 데이터 현황
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-brand-100">
          본 플랫폼은 RAG 기반 비정형 데이터 활용 체계와 ML 기반 정형 데이터
          예측 체계를 분리 운영하며, 단계별 데이터 축적을 통해 모델 고도화를
          추진합니다.
        </p>
      </section>

      <HoldingsTable title="RAG 데이터 보유 현황" rows={catalog.rag.holdings} />
      <HoldingsTable title="ML 데이터 보유 현황" rows={catalog.ml.holdings} />

      <section className="rounded-3xl border border-white/70 bg-white p-6 shadow-panel">
        <h2 className="text-xl font-semibold text-slate-900">RAG 데이터 스키마 정의</h2>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {catalog.rag.tables.map((table) => (
            <SchemaCard key={table.table} table={table} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/70 bg-white p-6 shadow-panel">
        <h2 className="text-xl font-semibold text-slate-900">ML 데이터 스키마 정의</h2>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {catalog.ml.tables.map((table) => (
            <SchemaCard key={table.table} table={table} />
          ))}
        </div>
      </section>
    </div>
  );
}
