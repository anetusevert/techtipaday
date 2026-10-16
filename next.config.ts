import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/categories/iphone", destination: "/iphone", permanent: true },
      { source: "/categories/android", destination: "/android", permanent: true },
      { source: "/categories/mac", destination: "/mac", permanent: true },
      { source: "/categories/windows", destination: "/windows", permanent: true },
      { source: "/categories/browser", destination: "/chrome", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
