import { ApiError, type ApiListResponse } from "@/types/api";
import type { NewsItem } from "@/types/domain";
import { createApiClient } from "./fetcher";
import { mapRawNewsItem, type RawNewsItem } from "./adapters/news-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { NewsApi } from "./news-api";

// TODO(sementara — cek visual lokal): true = pakai data mock di bawah,
// BUKAN hit backend asli. Set balik ke `false` (atau hapus blok ini)
// begitu mau lanjut tes endpoint /news asli.
const TEMP_USE_MOCK_NEWS = true;

const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "Prediksi Iklim Indonesia 2026",
    excerpt:
      "Ulasan ini memberikan gambaran penting terkait perubahan cuaca, tren suhu, serta proyeksi musim kemarau yang perlu diantisipasi secara nasional.",
    coverImage: null,
    createdAt: "2026-08-30",
  },
  {
    id: "2",
    title: "Pentingnya Data Iklim (Curah Hujan)",
    excerpt: "",
    coverImage: null,
    createdAt: "2026-08-30",
  },
  {
    id: "3",
    title: "Perubahan Iklim dan Pengaruhnya terhadap Tanaman Kelapa Sawit",
    excerpt: "",
    coverImage: null,
    createdAt: "2026-08-30",
  },
  {
    id: "4",
    title: "Tanaman Kelapa Sawit Hemat Lahan dan Air",
    excerpt: "",
    coverImage: null,
    createdAt: "2026-08-30",
  },
  {
    id: "5",
    title: "Benarkah Kelapa Sawit Adalah Sumber Emisi Karbon Terbesar?",
    excerpt: "",
    coverImage: null,
    createdAt: "2026-08-30",
  },
];

/** Satu-satunya implementasi "Berita Pilihan" — pola identik
 *  `rainfall-today-client.ts`: `createApiClient()` (TANPA companyId, lihat
 *  `NewsApi`), cek `res.data.status`, `ApiError` kalau gagal, TIDAK ada
 *  fallback diam-diam ke mock. Response asli tidak punya `meta`
 *  pagination — disintesis di sini (`page: 1, pageSize/total = jumlah
 *  item`) supaya tetap ikut kontrak `ApiListResponse<T>` yang sama untuk
 *  semua endpoint (lihat CLAUDE.md bagian "Kontrak response API"). */
export const newsClient: NewsApi = {
  async getNews(): Promise<ApiListResponse<NewsItem>> {
    if (TEMP_USE_MOCK_NEWS) {
      return {
        data: MOCK_NEWS,
        meta: { page: 1, pageSize: MOCK_NEWS.length, total: MOCK_NEWS.length },
      };
    }

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

      const data = res.data.data.map(mapRawNewsItem);

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
