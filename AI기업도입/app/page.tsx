import { OverviewBoard } from "@/components/dashboard/overview-board";
import { StatsGrid } from "@/components/dashboard/stats-grid";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-[32px] border border-white/70 bg-brand-900 px-6 py-7 text-white shadow-panel">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-200">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">통합 관리자 대시보드</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-brand-100">
          진행 중인 프로젝트, 특허 위험 알림, AI 추천 아이디어를 한 화면에서 확인하고 실무 흐름을 바로 시작하세요.
        </p>
      </section>

      <StatsGrid />
      <OverviewBoard />
    </div>
  );
}
