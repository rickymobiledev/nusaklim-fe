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
    // `cover_image` dari `GET /news` (kartu Berita Pilihan) berupa URL S3
    // eksternal, bukan asset lokal `public/` — host ini dari contoh
    // response asli yang dikonfirmasi user. Kalau backend nanti pakai
    // bucket/host lain, tambahkan pattern baru di sini.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iopri-storage-prod-ap-southeast-1-001.s3-ap-southeast-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
