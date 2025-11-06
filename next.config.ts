import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/stream/**",
      },
      {
        protocol: "https",
        hostname: "**", // optional: kalau nanti di-deploy (Railway/VPS)
      },
    ],
  },
};

export default nextConfig;
