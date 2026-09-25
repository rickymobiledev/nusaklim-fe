import type { NewsDetail, NewsItem } from "@/types/domain";

/** Bentuk mentah `GET /news` asli — cuma field yang benar-benar dipetakan ke
 *  `NewsItem`/`NewsDetail` yang dideklarasikan di sini, field lain (`slug`,
 *  `status`, `is_featured`, `updated_at`) sengaja diabaikan sama seperti pola
 *  adapter domain lain. `excerpt`/`content` opsional: daftar biasanya cuma
 *  punya `excerpt`, detail (`GET /news?id=`) punya `content` (HTML). */
export interface RawNewsItem {
  id: string | number;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image: string | null;
  created_at: string;
}

/** Teks polos dari HTML editor (untuk ringkasan bila BE tak kirim `excerpt`). */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function mapRawNewsItem(raw: RawNewsItem): NewsItem {
  return {
    id: String(raw.id),
    title: raw.title,
    excerpt: raw.excerpt ?? (raw.content ? stripHtml(raw.content) : ""),
    coverImage: raw.cover_image || null,
    createdAt: raw.created_at,
  };
}

export function mapRawNewsDetail(raw: RawNewsItem): NewsDetail {
  return { ...mapRawNewsItem(raw), content: raw.content ?? "" };
}
