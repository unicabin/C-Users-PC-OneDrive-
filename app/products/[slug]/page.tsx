import Link from "next/link";
import { notFound } from "next/navigation";
import { productMap, productSlugList } from "@/data/products";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return productSlugList.map((slug) => ({ slug }));
}

export default async function ProductDetailPage({
  params
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = productMap[slug as keyof typeof productMap];

  if (!product) {
    notFound();
  }

  const imageLabels = [
    {
      label: "Hero Visual",
      title: `${product.title} 대표 이미지 영역`,
      subtitle: "실제 제품 메인 컷, 장착 이미지, 제품 전체 샷으로 교체할 수 있는 대표 비주얼 슬롯입니다.",
      tags: [product.title, "Hero", "Main Shot"]
    },
    {
      label: "Use Case",
      title: `${product.title} 적용 사례 영역`,
      subtitle: "현장 장착 사례, 설치 전후 비교, 차량 적용 이미지 등 실제 활용 장면으로 확장할 수 있습니다.",
      tags: [product.title, "Application", "Case Study"]
    },
    {
      label: "Detail View",
      title: `${product.title} 디테일 컷 영역`,
      subtitle: "센서, 제어부, 구조 상세, 구성품 이미지 등 제품의 신뢰감을 높이는 세부 컷에 적합한 슬롯입니다.",
      tags: [product.title, "Detail", "Component"]
    }
  ];

  return (
    <>
      <PageHero
        eyebrow={product.heroLabel}
        title={`${product.title} by UNITOP`}
        description={product.heroSubcopy}
        actions={
          <>
            <Link href="/contact" className="primary-button">
              문의하기
            </Link>
            <Link href="/products" className="secondary-button">
              제품 목록
            </Link>
          </>
        }
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="panel p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue">
                Product Overview
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-navy">
                {product.intro}
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-600">
                {product.longDesc}
              </p>
            </div>
            <PlaceholderPanel
              label="Product Hero"
              title={`${product.title} 대표 이미지 영역`}
              subtitle="실제 제품 사진, 설치 사례, 핵심 비주얼로 교체하면 바로 상세 페이지 완성도를 높일 수 있는 브랜드형 이미지 슬롯입니다."
              tags={[product.title, "Hero", "Product"]}
              minHeightClassName="min-h-80"
            />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {product.features.map((feature) => (
              <div key={feature.title} className="panel p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue">
                  Key Feature
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-navy">
                  {feature.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="panel grid gap-8 p-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue">
                Expected Impact
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-navy">
                적용 효과
              </h2>
            </div>
            <div className="grid gap-4">
              {product.effects.map((effect) => (
                <div
                  key={effect}
                  className="rounded-[22px] border border-line bg-slate-50 px-5 py-5 text-base leading-7 text-slate-700"
                >
                  {effect}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {imageLabels.map((image) => (
              <PlaceholderPanel
                key={image.title}
                label={image.label}
                title={image.title}
                subtitle={image.subtitle}
                tags={image.tags}
                minHeightClassName="min-h-72"
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
