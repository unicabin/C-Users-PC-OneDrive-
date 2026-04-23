"use client";

import { useRouter } from "next/navigation";

import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDashboardOverview } from "@/services/dashboard-service";

export function OverviewBoard() {
  const router = useRouter();
  const {
    recentProjects,
    recentDocuments,
    patentAlerts,
    ideaRecommendations,
    predictionSummaries,
    quickActions,
    workflowCards,
  } = getDashboardOverview();

  return (
    <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-5">
        <SectionCard
          title="최근 프로젝트"
          description="진행 중인 핵심 제품개발 과제를 한눈에 확인합니다."
          action={<button onClick={() => router.push("/projects")} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">프로젝트 보기</button>}
        >
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.name}
                className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{project.name}</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {project.owner} · 업데이트 {project.updatedAt}
                    </p>
                  </div>
                  <StatusBadge label={project.stage} variant="success" />
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs text-slate-500">
                    <span>진행률</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard
            title="최근 검색 자료"
            description="최근 업무 흐름에서 다시 참고한 기술자료입니다."
          >
            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <div
                  key={doc.title}
                  className="rounded-3xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">{doc.title}</p>
                    <StatusBadge label={doc.category} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                    <span className="ml-auto">{doc.savedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="특허 위험 알림"
            description="회피 설계가 필요한 이슈를 우선순위로 정렬했습니다."
          >
            <div className="space-y-3">
              {patentAlerts.map((alert) => (
                <div
                  key={alert.name}
                  className="rounded-3xl border border-rose-100 bg-rose-50/70 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">{alert.name}</p>
                    <StatusBadge
                      label={alert.risk}
                      variant={alert.risk === "높음" ? "danger" : "warning"}
                    />
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{alert.issue}</p>
                  <p className="mt-2 text-xs font-medium text-rose-700">{alert.action}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="space-y-5">
        <SectionCard
          title="빠른 실행"
          description="실무 흐름을 바로 시작할 수 있는 단축 작업입니다."
        >
          <div className="grid gap-3">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-brand-300 hover:bg-white"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium text-slate-800">{item.label}</span>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="추천 아이디어"
          description="시장 요구와 현재 기술 자산을 반영해 추천된 컨셉입니다."
        >
          <div className="space-y-3">
            {ideaRecommendations.map((idea, index) => (
              <div
                key={idea}
                className="rounded-3xl border border-slate-200 bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
                  Concept {index + 1}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{idea}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="성능 예측 결과 요약"
          description="최근 시뮬레이션 모델의 핵심 결과입니다."
        >
          <div className="space-y-3">
            {predictionSummaries.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.value}</p>
                </div>
                <StatusBadge label={item.status} variant="success" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="통합 업무 흐름"
        description="기술자료 검색부터 보고서 출력까지 연결된 단계형 구조입니다."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workflowCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => router.push(card.href)}
                className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 text-left transition hover:border-brand-300 hover:bg-white hover:shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-semibold text-slate-900">{card.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {card.description}
                </p>
              </button>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
