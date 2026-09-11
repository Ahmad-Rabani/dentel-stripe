import { ProductGrid } from "@/components/products/product-card";
import { Container } from "@/components/ui/container";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildPageMetadata } from "@/lib/seo";
import { getProducts } from "@/lib/strapi/queries";

export const metadata = buildPageMetadata({
  title: "Products",
  description: "Clinical instruments, imaging, hygiene, and operatory systems from Dentel.",
  path: "/products",
});

export default async function ProductsPage() {
  const { items, meta } = await getProducts();

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow="Catalog"
        title="The collection."
        description="Every system is specified for daily clinical use: serviceable parts, considered acoustics, and documentation that a practice can actually keep."
      />
      <div className="mt-12">
        {meta.unavailable ? (
          <ErrorState />
        ) : items.length === 0 ? (
          <EmptyState
            title="No products published yet"
            description="Once products are added in Strapi, they will appear in this grid."
          />
        ) : (
          <ProductGrid products={items} />
        )}
      </div>
    </Container>
  );
}
