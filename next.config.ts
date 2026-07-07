import type { NextConfig } from "next";

/* Security headers. Kept to the pure-win set: clickjacking protection, MIME
   sniffing off, HTTPS pinning, sane referrer. Deliberately no strict CSP —
   it would need per-nonce wiring for Next/framer/three and risks breaking the
   3D hero and animations for little gain on a no-auth marketing site.
   Motion sensors (gyroscope/accelerometer) are left enabled — the hero uses
   device-orientation. */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
