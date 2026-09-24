import { ApiError, type ApiListResponse } from "@/types/api";
import type { NewsItem } from "@/types/domain";
import { createApiClient } from "./fetcher";
import { mapRawNewsItem, type RawNewsItem } from "./adapters/news-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { NewsApi } from "./news-api";

/** SEMENTARA cuma tampilkan berita berstatus "draft" (keputusan user —
 *  belum ada berita "published" di backend). Ganti ke "published" (atau
 *  hapus filter ini) begitu alur publish berita sudah dipakai. */
const VISIBLE_NEWS_STATUS = "draft";

/** Berita `is_featured` di paling depan (jadi kartu besar di
 *  `NewsCard.tsx`), sisanya terbaru dulu. `created_at` asli berformat
 *  seragam ("2026-09-24 18:33:06.6884411") jadi aman dibandingkan sebagai
 *  string; `Array.sort` stabil, jadi urutan antar-featured mengikuti
 *  aturan yang sama. */
function compareNews(a: NewsItem, b: NewsItem): number {
  if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
  return b.createdAt.localeCompare(a.createdAt);
}

/** Satu-satunya implementasi "Berita Pilihan" — pola identik
 *  `rainfall-today-client.ts`: `createApiClient()` (TANPA companyId, lihat
 *  `NewsApi`), cek `res.data.status`, `ApiError` kalau gagal, TIDAK ada
 *  fallback diam-diam ke mock. Response asli tidak punya `meta`
 *  pagination — disintesis di sini (`page: 1, pageSize/total = jumlah
 *  item`) supaya tetap ikut kontrak `ApiListResponse<T>` yang sama untuk
 *  semua endpoint (lihat CLAUDE.md bagian "Kontrak response API"). */
export const newsClient: NewsApi = {
  async getNews(): Promise<ApiListResponse<NewsItem>> {
    try {
      const client = createApiClient();
      const res = await client.get<{
        status: boolean;
        message: string;
        data: RawNewsItem[];
      }>("/news");

      if (!res.data.status) {
        throw new ApiError(
          "NEWS_FETCH_FAILED",
          res.data.message || "Gagal mengambil data berita dari server.",
        );
      }

      const data = res.data.data
        .map(mapRawNewsItem)
        .filter((item) => item.status === VISIBLE_NEWS_STATUS)
        .sort(compareNews);

      return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "NEWS_FETCH_FAILED",
        extractBackendErrorMessage(err) ?? "Gagal terhubung ke server berita.",
      );
    }
  },
};
