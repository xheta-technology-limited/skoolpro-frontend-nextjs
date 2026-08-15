import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async rewrites() {
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
  },
};

export default nextConfig;
