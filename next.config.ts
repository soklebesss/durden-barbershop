import type { NextConfig } from "next";

// ponytail: static export for GitHub Pages. Pages serves the repo at a
// subpath (/durden-barbershop), so basePath/assetPrefix come from an env var
// — empty in local dev, set in the deploy workflow. next/image needs
// unoptimized under export. The previous async headers() is dropped: static
// hosting can't set response headers, and Pages ignores them anyway. If this
// ever moves to a Node host (Vercel), restore headers() there.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
