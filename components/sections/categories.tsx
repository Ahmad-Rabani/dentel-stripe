import { CategoryCard } from "@/components/categories/category-card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Category } from "@/lib/strapi/types";

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <SectionHeading
          eyebrow="Departments"
          title="A complete room, specified in parts."
        />
        {categories.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="No categories yet"
            description="Add categories in Strapi to organize the catalog."
          />
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
