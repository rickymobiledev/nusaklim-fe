import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    // Dev saja: default 4 jam bikin gambar di `public/` yang isinya diganti di
    // path yang sama tampil usang (cache optimizer `next/image`). Produksi
    // tetap default.
    minimumCacheTTL: process.env.NODE_ENV === "development" ? 0 : undefined,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
