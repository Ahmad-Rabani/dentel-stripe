import { ProductCard } from "@/components/products/product-card";
import { ProductGallery } from "@/components/products/product-gallery";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatPrice } from "@/lib/format";
import { buildPageMetadata } from "@/lib/seo";
import { getProductBySlug, getRelatedProducts } from "@/lib/strapi/queries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return buildPageMetadata({ title: "Product", path: `/products/${slug}` });
  }

  return buildPageMetadata({
    title: product.name,
    description: product.shortDescription || product.description,
    path: `/products/${product.slug}`,
    image: product.image,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);
  const price = formatPrice(product.price);

  return (
    <Container className="py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <ProductGallery
          name={product.name}
          image={product.image}
          additionalImages={product.additionalImages}
        />
        <div>
          {product.category ? (
            <p className="text-xs uppercase tracking-[0.2em] text-brass">
              {product.category.name}
            </p>
          ) : null}
          <h1 className="mt-3 font-serif text-4xl text-balance sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg">{price ?? "Price on request"}</p>
          {product.shortDescription ? (
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              {product.shortDescription}
            </p>
          ) : null}
          {product.description ? (
            <p className="mt-5 max-w-xl text-sm leading-7 text-foreground/80">
              {product.description}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact">Request a consult</ButtonLink>
            <ButtonLink href="/products" variant="secondary">
              Back to collection
            </ButtonLink>
          </div>
        </div>
      </div>

      {product.specifications.length > 0 ? (
        <section className="mt-16 border-t border-line pt-12">
          <h2 className="font-serif text-3xl">Specifications</h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {product.specifications.map((spec) => (
              <div key={spec.label} className="rounded-2xl border border-line bg-surface px-5 py-4">
                <dt className="text-xs uppercase tracking-[0.16em] text-muted">{spec.label}</dt>
                <dd className="mt-1 text-sm">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-16">
          <SectionHeading title="Related systems" />
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
