import "@/env/server";
import { NextConfig } from "next/types";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
