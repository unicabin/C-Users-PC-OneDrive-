import type { NextConfig } from "next";

const isLocal = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  // OneDrive 로컬 경로 충돌 방지 — 프로덕션(Vercel)에서는 기본값(.next) 사용
  ...(isLocal ? { distDir: "next-dist" } : {}),
  experimental: {
    typedRoutes: true,
  },
  // OneDrive 한글 경로에서 nft.json ENOENT 오류 방지 — 로컬 전용
  ...(isLocal ? { outputFileTracingExcludes: { "*": ["**"] } } : {}),
  webpack: (config, { dev }) => {
    // 로컬 OneDrive에서 webpack 캐시 비활성화
    if (!dev && isLocal) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
