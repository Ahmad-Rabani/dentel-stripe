import type { NextConfig } from "next";

function strapiRemotePatterns() {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
      protocol: "http",
      hostname: "localhost",
      port: "1337",
      pathname: "/uploads/**",
    },
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
    {
      protocol: "https",
      hostname: "**.strapiapp.com",
    },
    {
      protocol: "https",
      hostname: "**.media.strapiapp.com",
    },
    {
      protocol: "https",
      hostname: "**.up.railway.app",
      pathname: "/uploads/**",
    },
  ];

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!strapiUrl) {
    return patterns;
  }

  try {
    const parsed = new URL(strapiUrl);
    patterns.push({
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      port: parsed.port || undefined,
      pathname: "/uploads/**",
    });
  } catch {
    console.warn("NEXT_PUBLIC_STRAPI_URL is not a valid URL.");
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: strapiRemotePatterns(),
  },
};

export default nextConfig;
