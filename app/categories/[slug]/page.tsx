import { ProductCard } from "@/components/products/product-card";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { buildPageMetadata } from "@/lib/seo";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/strapi/queries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return buildPageMetadata({ title: "Category", path: `/categories/${slug}` });
  }

  return buildPageMetadata({
    title: category.name,
    description: category.description,
    path: `/categories/${category.slug}`,
    image: category.image,
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category.slug);

  return (
    <>
      <div className="border-b border-line">
        <Container className="grid items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-brass">Category</p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{category.name}</h1>
            {category.description ? (
              <p className="mt-5 max-w-xl text-base leading-7 text-muted">
                {category.description}
              </p>
            ) : null}
          </div>
          <CmsImage
            media={category.image}
            alt={category.image?.alternativeText || category.name}
            className="aspect-[16/10] rounded-3xl"
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority
          />
        </Container>
      </div>
      <Container className="py-14">
        <h2 className="font-serif text-3xl">Systems in this department</h2>
        <div className="mt-8">
          {products.length === 0 ? (
            <EmptyState
              title="No products in this category yet"
              description="Related products will appear here once they are assigned in Strapi."
            />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
