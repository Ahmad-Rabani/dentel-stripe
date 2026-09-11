import { ArticleCard } from "@/components/blog/article-card";
import { Container } from "@/components/ui/container";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildPageMetadata } from "@/lib/seo";
import { getArticles } from "@/lib/strapi/queries";

export const metadata = buildPageMetadata({
  title: "Journal",
  description: "Notes from the Dentel studio on practice, materials, and clinical systems.",
  path: "/blog",
});

export default async function BlogPage() {
  const { items, meta } = await getArticles();
  const [featured, ...rest] = items;

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading
        as="h1"
        eyebrow="Journal"
        title="Writing for people who specify rooms, not slogans."
        description="Clinical notes, service thinking, and the quieter decisions behind a well-made operatory."
      />
      <div className="mt-12">
        {meta.unavailable ? (
          <ErrorState />
        ) : items.length === 0 ? (
          <EmptyState
            title="No articles published yet"
            description="Journal entries added in Strapi will appear here."
          />
        ) : (
          <div className="grid gap-14">
            {featured ? <ArticleCard article={featured} featured /> : null}
            {rest.length > 0 ? (
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </Container>
  );
}
