import { products } from "@/data/products";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { ProductCard } from "@/components/ui/product-card";

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="UNITOP 제품 포트폴리오"
        description="제품별 정보는 분리하되, 전체 페이지에서는 UNITOP의 공급 체계와 제품 밸런스가 먼저 보이도록 구성했습니다."
      />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
