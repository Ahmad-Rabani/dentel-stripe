import { ArticleCard } from "@/components/blog/article-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Article } from "@/lib/strapi/types";

export function FeaturedArticlesSection({ articles }: { articles: Article[] }) {
  const [featured, ...rest] = articles;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Journal"
            title="Notes from the studio and the chair."
          />
          <ButtonLink href="/blog" variant="secondary">
            Read the journal
          </ButtonLink>
        </div>
        {articles.length === 0 ? (
          <EmptyState
            title="No articles yet"
            description="Publish journal entries in Strapi to fill this space."
          />
        ) : (
          <div className="grid gap-12">
            {featured ? <ArticleCard article={featured} featured /> : null}
            {rest.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2">
                {rest.slice(0, 2).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </Container>
    </section>
  );
}
