import { ButtonLink } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/strapi/types";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col">
      <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-2xl">
        <CmsImage
          media={product.image}
          alt={product.image?.alternativeText || product.name}
          className="aspect-[4/5] w-full rounded-2xl"
          imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
        />
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        {product.category ? (
          <p className="text-xs uppercase tracking-[0.18em] text-brass">
            {product.category.name}
          </p>
        ) : null}
        <h3 className="mt-1 font-serif text-2xl leading-snug">
          <Link href={`/products/${product.slug}`} className="hover:text-forest">
            {product.name}
          </Link>
        </h3>
        {product.shortDescription ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {product.shortDescription}
          </p>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="text-sm font-medium">
            {formatPrice(product.price) ?? "On request"}
          </p>
          <ButtonLink href={`/products/${product.slug}`} variant="secondary" size="sm">
            View details
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
