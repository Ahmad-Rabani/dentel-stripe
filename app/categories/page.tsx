import { CategoryCard } from "@/components/categories/category-card";
import { Container } from "@/components/ui/container";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildPageMetadata } from "@/lib/seo";
import { getCategories } from "@/lib/strapi/queries";

export const metadata = buildPageMetadata({
  title: "Categories",
  description: "Browse Dentel systems by clinical department.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const { items, meta } = await getCategories();

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow="Departments"
        title="Specify by the work of the room."
        description="Clinical systems, imaging, hygiene, and operatory — grouped so a practice can build a complete specification without noise."
      />
      <div className="mt-12">
        {meta.unavailable ? (
          <ErrorState />
        ) : items.length === 0 ? (
          <EmptyState
            title="No categories published yet"
            description="Create categories in Strapi to organize products."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
