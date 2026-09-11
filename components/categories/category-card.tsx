import { CmsImage } from "@/components/ui/cms-image";
import type { Category } from "@/lib/strapi/types";
import Link from "next/link";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block overflow-hidden rounded-2xl"
    >
      <CmsImage
        media={category.image}
        alt={category.image?.alternativeText || category.name}
        className="aspect-[4/3]"
        imageClassName="transition-transform duration-500 group-hover:scale-[1.04]"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-surface">
        <h3 className="font-serif text-2xl">{category.name}</h3>
        {category.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-surface/80">
            {category.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
