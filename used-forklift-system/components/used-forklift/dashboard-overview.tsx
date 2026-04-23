import { DataBadge } from "@/components/used-forklift/data-badge";
import { SectionCard } from "@/components/used-forklift/section-card";
import { getConsultTone, getShipmentStatusTone } from "@/lib/used-forklift-utils";
import { DashboardRecentItem } from "@/types/used-forklift";

type DashboardOverviewProps = {
  recentConsultations: DashboardRecentItem[];
  recentShipments: DashboardRecentItem[];
};

function getTone(status: string) {
  if (status === "준비중" || status === "출고완료" || status === "인도완료") {
    return getShipmentStatusTone(status);
  }
  return getConsultTone(status as "신규" | "상담중" | "계약예정" | "종료");
}

export function DashboardOverview({
  recentConsultations,
  recentShipments,
}: DashboardOverviewProps) {
  return (
    <div className="grid gap-6 border-b border-line bg-white px-6 py-6 lg:grid-cols-2">
      <SectionCard
        title="최근 상담 5건"
        description="최근 등록된 상담 흐름을 빠르게 확인할 수 있습니다."
      >
        <div className="space-y-3">
          {recentConsultations.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-3xl border border-line bg-slate-50/70 px-4 py-4"
            >
              <div>
                <p className="text-sm font-semibold text-navy">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.subtitle}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{item.meta}</p>
                <div className="mt-2">
                  <DataBadge tone={getTone(item.status)}>{item.status}</DataBadge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="최근 출고 5건"
        description="출고 등록 이후 진행 상태를 한눈에 볼 수 있습니다."
      >
        <div className="space-y-3">
          {recentShipments.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-3xl border border-line bg-slate-50/70 px-4 py-4"
            >
              <div>
                <p className="text-sm font-semibold text-navy">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.subtitle}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{item.meta}</p>
                <div className="mt-2">
                  <DataBadge tone={getTone(item.status)}>{item.status}</DataBadge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
