import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async rewrites() {
    if (process.env.NEXT_PUBLIC_ENV != "development") {
      return [
        {
          source: "/sanctum/:path*",
          destination: "https://api.skoolpro.net/sanctum/:path*",
        },
        {
          source: "/api/v1/:path*",
          destination: "https://api.skoolpro.net/api/v1/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
