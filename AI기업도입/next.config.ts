import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "next-dist",
  experimental: {
    typedRoutes: true,
  },
  // Disable output file tracing — OneDrive + Korean path causes nft.json ENOENT on Windows.
  outputFileTracingExcludes: { "*": ["**"] },
  // Disable persistent webpack cache for OneDrive stability.
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }

    return config;
  },
};

export default nextConfig;
