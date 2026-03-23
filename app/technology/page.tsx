import Link from "next/link";
import { technologyAreas } from "@/data/site";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

const solutionNotes = [
  "ADAS와 센서 연동 구조를 현장 안전 솔루션으로 확장",
  "IoT 연결을 통해 운영 데이터와 상태 정보의 후속 활용 준비",
  "스마트 안전 및 관제 영역으로 이어질 수 있는 제품 구조 설계"
];

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology"
        title="기술 그 자체보다 현장 적용 가능한 통합 솔루션을 지향합니다."
        description="UNITOP의 기술 페이지는 연구소 소개처럼 보이기보다, 실제 제품과 현장 운영 안에서 AI, IoT, 센서, 모니터링이 어떻게 연결될 수 있는지 설명하는 구조에 집중합니다."
        actions={
          <Link href="/products/adas" className="primary-button">
            ADAS 상세 보기
          </Link>
        }
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {technologyAreas.map((area) => (
              <div key={area.title} className="panel p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue">
                  Technology Area
                </p>
                <h2 className="mt-4 text-2xl font-semibold text-navy">{area.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="panel p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue">
                Integrated Solution View
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-navy">
                기술 중심 회사가 아니라 솔루션 중심 회사
              </h2>
              <div className="mt-6 grid gap-4">
                {solutionNotes.map((note) => (
                  <div
                    key={note}
                    className="rounded-[22px] border border-line bg-slate-50 px-5 py-5 text-base leading-7 text-slate-700"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
            <PlaceholderPanel
              title="Monitoring / IoT Placeholder"
              subtitle="관제 화면, 센서 네트워크 다이어그램, 적용 이미지 등으로 대체 가능한 기술 시각화 영역입니다."
            />
          </div>
        </Container>
      </section>
    </>
  );
}
