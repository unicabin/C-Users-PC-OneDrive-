import { getArchitectureDataAssets, getPlatformMenuGroups } from "@/services/architecture-service";

function GroupCard({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Array<{ label: string; description: string }>;
}) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white p-6 shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={`${title}-${item.label}`} className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="font-medium">{item.label}</p>
            <p className="mt-1 text-xs text-slate-500">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DashboardPage() {
  const menuGroups = getPlatformMenuGroups();
  const assets = getArchitectureDataAssets();

  const ragOwned = assets.rag.filter((row) => row.owned !== "미보유").length;
  const mlOwned = assets.ml.filter((row) => row.owned !== "미보유").length;

  const ragGroup = menuGroups.find((group) => group.title === "RAG 기반 AI Agent");
  const mlGroup = menuGroups.find((group) => group.title === "ML 기반 예측/분석");

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/70 bg-brand-900 px-6 py-7 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-200">Platform Architecture</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          제조업 스마트 AI 플랫폼 기술 구조
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-brand-100">
          본 플랫폼은 RAG 기반 지식형 AI Agent와 ML 기반 예측/분석 엔진의 이중
          구조로 구성되어, 제품기획·설계 단계의 실무 의사결정을 지원합니다.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
          <p className="text-sm font-medium text-slate-500">RAG 데이터 보유 현황</p>
          <p className="mt-4 text-3xl font-semibold text-brand-700">
            {ragOwned} / {assets.rag.length}
          </p>
        </div>
        <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-panel">
          <p className="text-sm font-medium text-slate-500">ML 데이터 보유 현황</p>
          <p className="mt-4 text-3xl font-semibold text-emerald-700">
            {mlOwned} / {assets.ml.length}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {ragGroup ? (
          <GroupCard
            title={ragGroup.title}
            description="비정형 데이터 검색·요약·근거 생성 중심의 지식형 AI 서비스"
            items={ragGroup.items}
          />
        ) : null}
        {mlGroup ? (
          <GroupCard
            title={mlGroup.title}
            description="정형 데이터 기반 성능/위험 예측 및 설계 최적화 분석 서비스"
            items={mlGroup.items}
          />
        ) : null}
      </div>
    </div>
  );
}
