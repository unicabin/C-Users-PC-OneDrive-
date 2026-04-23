"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { getLiveDashboardStats, type LiveDashboardStats } from "@/services/dashboard-stats-service";

const tones = {
  sky: "from-accent-sky to-white",
  rose: "from-accent-rose to-white",
  mint: "from-accent-mint to-white",
  amber: "from-accent-amber to-white",
};

const FALLBACK_STATS: LiveDashboardStats = {
  activeProjects: 12,
  highRiskPatents: 3,
  totalPredictions: 28,
  totalAutomations: 0,
  source: "fallback",
};

export function StatsGrid() {
  const [stats, setStats] = useState<LiveDashboardStats>(FALLBACK_STATS);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const live = await getLiveDashboardStats();
      setStats(live);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const cards = [
    {
      title: "활성 프로젝트",
      value: `${stats.activeProjects}건`,
      description: "완료 제외 진행 중",
      tone: "sky" as const,
    },
    {
      title: "특허 고위험 이슈",
      value: `${stats.highRiskPatents}건`,
      description: "회피 설계 검토 필요",
      tone: "rose" as const,
    },
    {
      title: "예측 완료 모델",
      value: `${stats.totalPredictions}건`,
      description: "누적 성능 예측 결과",
      tone: "mint" as const,
    },
    {
      title: "자동화 생성 이력",
      value: `${stats.totalAutomations}건`,
      description: "코드/설계 산출물",
      tone: "amber" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={cn(
            "rounded-[28px] border border-white/70 bg-gradient-to-br p-5 shadow-panel",
            tones[card.tone],
          )}
        >
          <p className="text-sm font-medium text-slate-500">{card.title}</p>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="text-3xl font-semibold tracking-tight text-slate-900">
                {card.value}
              </p>
              <p className="mt-2 text-xs text-slate-500">{card.description}</p>
            </div>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
              {stats.source === "supabase" ? "실시간" : "샘플"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
