import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" to support dynamic [slug] routes
  // Static export doesn't work with dynamic tenant slugs
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
