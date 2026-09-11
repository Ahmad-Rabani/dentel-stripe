import { cmsRevalidateSeconds } from "@/config/site";
import { getStrapiUrl } from "@/lib/strapi/env";

export { getStrapiUrl, isStrapiConfigured } from "@/lib/strapi/env";

export class StrapiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "StrapiRequestError";
    this.status = status;
  }
}

type QueryValue = string | number | boolean | QueryValue[] | QueryParams;

export type QueryParams = {
  [key: string]: QueryValue;
};

function appendQuery(
  searchParams: URLSearchParams,
  params: QueryParams,
  prefix = "",
) {
  for (const [key, value] of Object.entries(params)) {
    const path = prefix ? `${prefix}[${key}]` : key;

    if (value == null) {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((entry, index) => {
        if (typeof entry === "object" && entry !== null) {
          appendQuery(searchParams, entry as QueryParams, `${path}[${index}]`);
        } else {
          searchParams.append(`${path}[${index}]`, String(entry));
        }
      });
      continue;
    }

    if (typeof value === "object") {
      appendQuery(searchParams, value, path);
      continue;
    }

    searchParams.append(path, String(value));
  }
}

export function buildStrapiUrl(path: string, params?: QueryParams): string {
  const base = getStrapiUrl();
  if (!base) {
    throw new StrapiRequestError("Strapi URL is not configured.", 500);
  }

  const url = new URL(path.startsWith("http") ? path : `${base}${path}`);
  if (params) {
    appendQuery(url.searchParams, params);
  }

  return url.toString();
}

type StrapiFetchOptions = {
  params?: QueryParams;
  method?: "GET" | "POST";
  body?: unknown;
  revalidate?: number | false;
};

export async function strapiFetch<T>(
  path: string,
  options: StrapiFetchOptions = {},
): Promise<T> {
  const { params, method = "GET", body, revalidate = cmsRevalidateSeconds } = options;
  const url = buildStrapiUrl(path, params);
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  const token = process.env.STRAPI_API_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    ...(revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate } }),
  });

  if (!response.ok) {
    throw new StrapiRequestError(
      `Strapi request failed with status ${response.status}.`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
