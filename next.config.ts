import type { NextConfig } from "next";
import tailwindcss from '@tailwindcss/vite'
const nextConfig: NextConfig = {
  /* config options here */
  plugins: [tailwindcss()],
};

export default nextConfig;
