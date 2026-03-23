import Link from "next/link";
import { companyStats, brandPillars } from "@/data/site";
import { products } from "@/data/products";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";
import { SectionHeading } from "@/components/ui/section-heading";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.22),transparent_38%),linear-gradient(135deg,#f7fbff_0%,#ffffff_58%,#eef4ff_100%)] py-20 sm:py-28">
        <div className="absolute inset-0 bg-hero-grid bg-[length:44px_44px] opacity-50" />
        <Container className="relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.34em] text-blue">
                Industrial Brand Website
              </p>
              <h1 className="mt-6 text-5xl font-semibold tracking-tight text-navy sm:text-6xl">
                UNITOP
              </h1>
              <p className="mt-4 text-2xl font-medium text-slate-700 sm:text-3xl">
                Forklift Total Solution
              </p>
              <p className="mt-3 text-base font-medium uppercase tracking-[0.3em] text-slate-500">
                Safety · HVAC · Cabin · IoT
              </p>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
                UNITOP은 산업 차량과 작업 현장에 필요한 안전, 환경 제어, 캐빈,
                스마트 확장 솔루션을 통합적으로 제안하는 B2B 브랜드입니다.
                제품 하나가 아니라 현장 적용 전체를 설계하는 파트너라는 인상을
                중심에 두었습니다.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/products" className="primary-button">
                  제품 보기
                </Link>
                <Link href="/contact" className="secondary-button">
                  문의하기
                </Link>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <PlaceholderPanel
                label="Hero Visual"
                title="대표 이미지 영역"
                subtitle="추후 대표 제품 사진, 공장 전경, 브랜드 이미지를 교체해 사용할 수 있는 메인 비주얼 슬롯입니다."
                tags={["Brand", "Main Visual", "UNITOP"]}
                className="sm:col-span-2"
                minHeightClassName="min-h-72"
              />
              {companyStats.map((stat) => (
                <div key={stat.label} className="panel p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-4 text-4xl font-semibold text-navy">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Product Portfolio"
            title="UNITOP 제품군을 한눈에 보여주는 메인 연결 구조"
            description="ADAS를 포함한 핵심 제품군을 균형 있게 배치해, 홈페이지 전체가 UNITOP 브랜드 중심으로 읽히도록 구성했습니다."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="panel p-8">
              <SectionHeading
                eyebrow="Why UNITOP"
                title="생산, 설계, 시공을 잇는 통합 역량"
                description="단품 판매가 아니라 현장 적용까지 이어지는 구조를 설명하는 데 집중했습니다. 일본 바이어가 보더라도 공급 체계와 확장성을 신뢰할 수 있는 톤을 유지합니다."
              />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {brandPillars.map((pillar) => (
                <div key={pillar.title} className="panel p-6">
                  <h3 className="text-xl font-semibold text-navy">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
