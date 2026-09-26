import type { NewsDetail, NewsItem } from "@/types/domain";

/** Bentuk mentah `GET /news` asli (dikonfirmasi user lewat tes langsung ke
 *  backend) — cuma field yang benar-benar dipetakan ke `NewsItem` yang
 *  dideklarasikan di sini, field lain (`slug`, `content` penuh,
 *  `updated_at`) sengaja diabaikan sama seperti pola adapter domain lain.
 *  `is_featured` datang sebagai angka 0/1 (bukan boolean). */
export interface RawNewsItem {
  id?: string | number;
  slug?: string | null;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  /** `/news` (admin) memakai `cover_image`, `/news/published` memakai
   *  `cover_image_url` — adapter membaca keduanya dengan fallback. */
  cover_image?: string | null;
  cover_image_url?: string | null;
  status?: string;
  is_featured?: number;
  created_at?: string;
}

/** Teks polos dari HTML editor (untuk ringkasan bila BE tak kirim `excerpt`). */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function mapRawNewsItem(raw: RawNewsItem, fallbackId?: string): NewsItem {
  const resolvedId =
    raw.id !== undefined && raw.id !== null && raw.id !== ""
      ? String(raw.id)
      : typeof fallbackId === "string"
        ? fallbackId
        : "";
  return {
    id: resolvedId,
    title: raw.title,
    excerpt: raw.excerpt ?? (raw.content ? stripHtml(raw.content) : ""),
    coverImage: raw.cover_image_url || raw.cover_image || null,
    createdAt: raw.created_at ?? new Date().toISOString(),
    status: raw.status ?? "draft",
    isFeatured: raw.is_featured === 1,
  };
}

export function mapRawNewsDetail(raw: RawNewsItem, fallbackId?: string): NewsDetail {
  return { ...mapRawNewsItem(raw, fallbackId), content: raw.content ?? "" };
}
