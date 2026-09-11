import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getCategories, getSiteSettings } from "@/lib/strapi/queries";
import type { ReactNode } from "react";

export async function SiteShell({ children }: { children: ReactNode }) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-surface"
      >
        Skip to content
      </a>
      <Header settings={settings} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer
        settings={settings}
        categoryLinks={categories.items.map((category) => ({
          href: `/categories/${category.slug}`,
          label: category.name,
        }))}
      />
    </>
  );
}
