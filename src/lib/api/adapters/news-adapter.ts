import type { NewsItem } from "@/types/domain";

/** Bentuk mentah `GET /news` asli (dikonfirmasi user lewat tes langsung ke
 *  backend) — cuma field yang benar-benar dipetakan ke `NewsItem` yang
 *  dideklarasikan di sini, field lain (`slug`, `content` penuh, `status`,
 *  `updated_at`) sengaja diabaikan sama seperti pola adapter domain lain. */
export interface RawNewsItem {
  id: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  created_at: string;
}

export function mapRawNewsItem(raw: RawNewsItem): NewsItem {
  return {
    id: raw.id,
    title: raw.title,
    excerpt: raw.excerpt,
    coverImage: raw.cover_image || null,
    createdAt: raw.created_at,
  };
}
