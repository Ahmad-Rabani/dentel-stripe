"use client";

import { CmsImage } from "@/components/ui/cms-image";
import { cn } from "@/lib/cn";
import type { MediaAsset } from "@/lib/strapi/types";
import { useMemo, useState } from "react";

export function ProductGallery({
  name,
  image,
  additionalImages,
}: {
  name: string;
  image: MediaAsset | null;
  additionalImages: MediaAsset[];
}) {
  const images = useMemo(() => {
    const all = [image, ...additionalImages].filter(
      (item): item is MediaAsset => Boolean(item),
    );
    const seen = new Set<string>();
    return all.filter((item) => {
      if (seen.has(item.url)) {
        return false;
      }
      seen.add(item.url);
      return true;
    });
  }, [image, additionalImages]);

  const [active, setActive] = useState(0);
  const current = images[active] ?? null;

  return (
    <div className="grid gap-3">
      <CmsImage
        media={current}
        alt={current?.alternativeText || name}
        className="aspect-[4/5] rounded-3xl sm:aspect-square"
        sizes="(min-width: 1024px) 48vw, 100vw"
        priority
      />
      {images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((item, index) => (
            <button
              key={item.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1} of ${name}`}
              aria-pressed={index === active}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border",
                index === active ? "border-forest" : "border-transparent",
              )}
            >
              <CmsImage
                media={item}
                alt=""
                className="h-full w-full"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
