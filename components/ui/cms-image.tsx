"use client";

import { cn } from "@/lib/cn";
import { getStrapiMediaUrl } from "@/lib/strapi/utils";
import type { MediaAsset } from "@/lib/strapi/types";
import Image from "next/image";
import { useState } from "react";

type CmsImageProps = {
  media?: MediaAsset | string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

function Placeholder({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#efe8d9,_#d8cbb6)]"
      role="img"
      aria-label={label}
    />
  );
}

export function CmsImage({
  media,
  alt,
  className,
  imageClassName,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  fill = true,
  width,
  height,
}: CmsImageProps) {
  const url = getStrapiMediaUrl(media);
  const [failed, setFailed] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);

  if (url !== currentUrl) {
    setCurrentUrl(url);
    setFailed(false);
  }
  const resolvedAlt =
    alt || (typeof media === "object" && media?.alternativeText) || "Image";
  const showImage = Boolean(url) && !failed;

  return (
    <div className={cn("relative isolate overflow-hidden bg-sand", className)}>
      {showImage ? (
        fill ? (
          <Image
            src={url as string}
            alt={resolvedAlt}
            fill
            sizes={sizes}
            priority={priority}
            onError={() => setFailed(true)}
            className={cn("object-cover", imageClassName)}
          />
        ) : (
          <Image
            src={url as string}
            alt={resolvedAlt}
            width={width ?? 1200}
            height={height ?? 800}
            sizes={sizes}
            priority={priority}
            onError={() => setFailed(true)}
            className={cn("h-auto w-full object-cover", imageClassName)}
          />
        )
      ) : (
        <Placeholder label={resolvedAlt} />
      )}
    </div>
  );
}
