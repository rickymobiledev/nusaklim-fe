import type { NewsItem } from "@/types/domain";

/** Bentuk mentah `GET /news` asli (dikonfirmasi user lewat tes langsung ke
 *  backend) — cuma field yang benar-benar dipetakan ke `NewsItem` yang
 *  dideklarasikan di sini, field lain (`slug`, `content` penuh,
 *  `updated_at`) sengaja diabaikan sama seperti pola adapter domain lain.
 *  `is_featured` datang sebagai angka 0/1 (bukan boolean). */
export interface RawNewsItem {
  id: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  status: string;
  is_featured: number;
  created_at: string;
}

export function mapRawNewsItem(raw: RawNewsItem): NewsItem {
  return {
    id: raw.id,
    title: raw.title,
    excerpt: raw.excerpt,
    coverImage: raw.cover_image || null,
    createdAt: raw.created_at,
    status: raw.status,
    isFeatured: raw.is_featured === 1,
  };
}
