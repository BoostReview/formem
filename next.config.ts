import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ["react-hook-form", "@hookform/resolvers"],
  typescript: {
    // Ignorer les erreurs TypeScript pendant le build (les erreurs ont été corrigées mais le linter pose problème)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

