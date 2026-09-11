import { ProductGrid } from "@/components/products/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import type { CmsQueryMeta, Product } from "@/lib/strapi/types";

export function FeaturedProductsSection({
  products,
  meta,
}: {
  products: Product[];
  meta: CmsQueryMeta;
}) {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Collection"
            title="Specified for the chair, not the catalog."
            description="A restrained set of clinical systems — chosen for balance, serviceability, and the hours they will actually work."
          />
          <ButtonLink href="/products" variant="secondary" className="shrink-0">
            All products
          </ButtonLink>
        </div>
        {meta.unavailable ? (
          <ErrorState />
        ) : products.length === 0 ? (
          <EmptyState
            title="Products will appear here"
            description="Publish products in Strapi and they will show in this collection automatically."
          />
        ) : (
          <ProductGrid products={products} />
        )}
      </Container>
    </section>
  );
}
