import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  agentRules: false,
  experimental: {
    serverActions: { bodySizeLimit: "9mb" },
  },
};

export default nextConfig;
