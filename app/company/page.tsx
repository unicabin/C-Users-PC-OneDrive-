import { brandPillars, companyTimeline } from "@/data/site";
import { Container } from "@/components/ui/container";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

const capabilities = [
  "생산, 설계, 시공을 하나의 흐름으로 연결하는 실행 구조",
  "산업 차량과 현장 조건을 함께 고려하는 실무형 커스터마이징 대응",
  "제품 단위가 아닌 브랜드 단위로 신뢰를 전달하는 공급 체계"
];

const brandTags = ["Design", "Manufacturing", "Installation"];

const visualSlots = [
  {
    label: "Factory",
    title: "공장 / 생산 인프라",
    subtitle:
      "실제 공장 전경, 생산 설비, 조립 라인 이미지로 교체하기 좋은 대표 비주얼 슬롯입니다.",
    tags: ["Factory", "Production", "Scale"],
    className: "sm:col-span-2"
  },
  {
    label: "Installation",
    title: "시공 / 설치 현장",
    subtitle:
      "현장 시공, 장착 과정, 프로젝트 대응 이미지를 넣어 신뢰감을 강화할 수 있습니다.",
    tags: ["Installation", "Project", "Field"]
  },
  {
    label: "Product",
    title: "제품 / 적용 결과",
    subtitle:
      "완성된 제품, 장착 차량, 결과 컷 등 브랜드 완성도를 보여주는 슬롯입니다.",
    tags: ["Product", "Application", "Result"]
  }
];

export default function CompanyPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(15,30,57,0.12),transparent_28%),linear-gradient(180deg,#f7fbff_0%,#ffffff_72%,#f3f7fc_100%)] py-24 sm:py-28">
        <div className="absolute inset-0 bg-hero-grid bg-[length:42px_42px] opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.5)_46%,transparent_100%)]" />
        <Container className="relative">
          <div className="max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-blue">
              Company
            </p>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-navy sm:text-6xl lg:text-7xl">
              UNITOP
            </h1>
            <p className="mt-4 max-w-3xl text-2xl font-medium leading-10 text-slate-700 sm:text-3xl">
              산업 현장에 필요한 솔루션을 설계하고
              <br />
              실제 적용까지 연결하는 브랜드
            </p>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-600">
              UNITOP은 안전, HVAC, 캐빈, 스마트 확장 솔루션을 중심으로 현장
              적용성과 시공 완성도를 함께 고려합니다. 단순한 회사 소개가 아니라,
              일본 바이어가 보더라도 신뢰할 수 있는 산업 브랜드의 인상을 만드는
              구조를 목표로 페이지를 설계했습니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {brandTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="rounded-[30px] border border-white/70 bg-white px-8 py-8 shadow-[0_28px_70px_rgba(15,30,57,0.12)]">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue">
                Brand Story
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-navy">
                UNITOP 브랜드 소개
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-600">
                UNITOP은 산업 차량과 작업 현장의 현실적인 요구를 기반으로, 제품
                공급을 넘어 설계와 생산, 시공, 적용까지 이어지는 통합 솔루션을
                만들어 왔습니다. ADAS는 그중 하나의 핵심 제품군이며, 회사 전체는
                UNITOP 브랜드가 가진 총체적 역량이 먼저 보이도록 구성되어
                있습니다.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {brandTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 rounded-[24px] border border-blue-100 bg-[linear-gradient(135deg,#eff6ff,#f8fbff)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue">
                  Brand Direction
                </p>
                <p className="mt-3 text-base leading-7 text-slate-700">
                  신뢰할 수 있는 산업 브랜드 톤, 일본 진출을 고려한 확장 구조,
                  실제 제품 이미지 교체가 쉬운 placeholder 기반 UI를 함께
                  고려했습니다.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {visualSlots.map((slot) => (
                <PlaceholderPanel
                  key={slot.title}
                  label={slot.label}
                  title={slot.title}
                  subtitle={slot.subtitle}
                  tags={slot.tags}
                  className={slot.className}
                  minHeightClassName={slot.className ? "min-h-72" : "min-h-64"}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {companyTimeline.map((item) => (
              <div
                key={item.year}
                className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_24px_60px_rgba(15,30,57,0.1)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue">
                  {item.year}
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-navy">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="rounded-[30px] border border-white/70 bg-white p-8 shadow-[0_28px_70px_rgba(15,30,57,0.12)]">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue">
                  Integrated Capability
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-navy">
                  생산 / 설계 / 시공 통합 역량
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  브랜드 소개 페이지가 단순 텍스트가 아니라, UNITOP이 실제로
                  무엇을 만들고 어떻게 공급하는지를 신뢰감 있게 전달하도록
                  구성했습니다.
                </p>
              </div>

              <div className="grid gap-4">
                {capabilities.map((capability) => (
                  <div
                    key={capability}
                    className="rounded-[22px] border border-line bg-slate-50 px-5 py-5 text-base leading-7 text-slate-700"
                  >
                    {capability}
                  </div>
                ))}
                {brandPillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="rounded-[24px] border border-line bg-[linear-gradient(180deg,#ffffff,#f8fbff)] px-5 py-5 shadow-sm"
                  >
                    <div className="flex flex-wrap gap-2">
                      {brandTags.map((tag) => (
                        <span
                          key={`${pillar.title}-${tag}`}
                          className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-navy">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
