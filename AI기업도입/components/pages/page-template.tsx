import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getModuleStatuses } from "@/services/app-service";

type PageTemplateProps = {
  title: string;
  description: string;
};

export function PageTemplate({ title, description }: PageTemplateProps) {
  const modules = getModuleStatuses();

  return (
    <div className="space-y-5">
      <div className="rounded-[32px] border border-white/70 bg-brand-900 bg-dashboard-grid bg-[size:22px_22px] px-6 py-7 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-200">Module Page</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-100">{description}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <SectionCard
          title={`${title} 작업 보드`}
          description="실제 서비스 확장 시 이 영역에 검색, 분석, 자동화 폼과 결과 화면을 연결하면 됩니다."
        >
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
            <p className="text-base font-medium text-slate-700">
              실무 기능 컴포넌트를 붙이기 위한 기본 캔버스
            </p>
            <p className="mt-2 text-sm text-slate-500">
              입력 패널, 결과 표, 그래프, 로그, 보고서 미리보기까지 단계적으로 확장할 수 있습니다.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="기본 모듈 상태"
          description="각 메뉴에서 공통으로 재사용할 수 있는 상태 요약 예시입니다."
        >
          <div className="space-y-3">
            {modules.map((module) => (
              <div
                key={module.name}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <span className="font-medium text-slate-700">{module.name}</span>
                <StatusBadge label={module.status} variant="neutral" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
