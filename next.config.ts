import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "https://api.spicykitchengorkha.com/api";
const IS_EXPORT = process.env.NEXT_PUBLIC_API_URL === "https://api.spicykitchengorkha.com/api";

const nextConfig: NextConfig = {
  output: IS_EXPORT ? "export" : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(IS_EXPORT
    ? {}
    : {
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
      }),
};

export default nextConfig;

