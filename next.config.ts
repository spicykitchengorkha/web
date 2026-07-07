import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "https://api.spicykitchengorkha.com/api";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendBase = BACKEND_URL.replace(/\/api$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
      {
        source: "/storage/:path*",
        destination: `${backendBase}/storage/:path*`,
      },
    ];
  },

};

export default nextConfig;
