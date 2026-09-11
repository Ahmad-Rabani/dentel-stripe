import { getStrapiUrl } from "@/lib/strapi/env";
import type { MediaAsset } from "@/lib/strapi/types";

type UnknownRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function asBoolean(value: unknown): boolean {
  return value === true;
}

export function unwrapEntity(value: unknown): UnknownRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  if (isRecord(value.data)) {
    return unwrapEntity(value.data);
  }

  if (isRecord(value.attributes)) {
    return {
      id: value.id ?? value.documentId,
      documentId: value.documentId,
      ...value.attributes,
    };
  }

  return value;
}

export function unwrapCollection(value: unknown): UnknownRecord[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => unwrapEntity(entry))
      .filter((entry): entry is UnknownRecord => entry !== null);
  }

  if (isRecord(value) && Array.isArray(value.data)) {
    return unwrapCollection(value.data);
  }

  const entity = unwrapEntity(value);
  return entity ? [entity] : [];
}

export function getStrapiMediaUrl(
  image: MediaAsset | string | null | undefined,
): string | null {
  if (!image) {
    return null;
  }

  const url = typeof image === "string" ? image : image.url;
  if (!url) {
    return null;
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  const base = getStrapiUrl();
  if (!base) {
    return url.startsWith("/") ? url : `/${url}`;
  }

  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

function mediaFromRecord(value: UnknownRecord): MediaAsset | null {
  const url = asString(value.url);
  if (!url) {
    return null;
  }

  return {
    url,
    alternativeText: asString(
      value.alternativeText ?? value.alternative_text ?? value.caption,
    ),
    width: asNumber(value.width),
    height: asNumber(value.height),
    mime: asString(value.mime) || null,
  };
}

export function normalizeMedia(value: unknown): MediaAsset | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return {
      url: value,
      alternativeText: "",
      width: null,
      height: null,
      mime: null,
    };
  }

  if (Array.isArray(value)) {
    return normalizeMedia(value[0]);
  }

  const entity = unwrapEntity(value);
  if (!entity) {
    return null;
  }

  return mediaFromRecord(entity);
}

export function normalizeMediaList(value: unknown): MediaAsset[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeMedia(entry))
      .filter((entry): entry is MediaAsset => entry !== null);
  }

  if (isRecord(value) && Array.isArray(value.data)) {
    return normalizeMediaList(value.data);
  }

  const single = normalizeMedia(value);
  return single ? [single] : [];
}
