export function getStrapiUrl(): string | null {
  const value = process.env.NEXT_PUBLIC_STRAPI_URL?.trim();
  if (!value) {
    return null;
  }

  return value.replace(/\/$/, "");
}

export function isStrapiConfigured(): boolean {
  return Boolean(getStrapiUrl());
}
