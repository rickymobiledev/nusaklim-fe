import { ApiError, type ApiItemResponse, type ApiListResponse } from "@/types/api";
import type { NewsDetail, NewsItem } from "@/types/domain";
import type { CreateNewsInput } from "@/types/user-management";
import { createApiClient } from "./fetcher";
import {
  mapRawNewsDetail,
  mapRawNewsItem,
  type RawNewsItem,
} from "./adapters/news-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { NewsApi } from "./news-api";

// TODO(sementara — cek visual lokal): true = pakai data mock di bawah,
// BUKAN hit backend asli. Default `false` sejak kontrak endpoint /news
// diberikan user (Manajemen Berita); set `true` lagi cuma buat cek visual
// tanpa backend (mutasi tidak tersedia saat true).
const TEMP_USE_MOCK_NEWS = false;

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

const MUTATION_UNAVAILABLE = () =>
  new ApiError(
    "NEWS_MUTATION_UNAVAILABLE",
    "Tambah/ubah/hapus berita belum tersedia selama data berita masih memakai mock (TEMP_USE_MOCK_NEWS).",
  );

interface Envelope<T> {
  status: boolean;
  message: string;
  data: T;
}

/** Bungkus error axios/BE jadi `ApiError` (kode `NEWS_FETCH_FAILED`, BUKAN
 *  `NETWORK_ERROR` — lihat CLAUDE.md "Pesan error dari BE"). */
function toApiError(err: unknown, fallback: string): ApiError {
  if (err instanceof ApiError) return err;
  return new ApiError("NEWS_FETCH_FAILED", extractBackendErrorMessage(err) ?? fallback);
}

function assertOk(body: Envelope<unknown>, fallback: string) {
  if (!body.status) {
    throw new ApiError("NEWS_FETCH_FAILED", body.message || fallback);
  }
}

/** Tambah & ubah SAMA-SAMA `POST /news` multipart (ubah = tambah + field
 *  `id`, sesuai curl dari user). TODO: method ubah (POST vs PUT) diasumsikan
 *  dari curl tanpa `--request` — konfirmasi ke BE. `is_featured` cuma dikirim
 *  saat tambah, "0" (Laravel-style boolean; form belum punya kontrolnya). */
async function saveNews(
  input: CreateNewsInput & { id?: string },
): Promise<ApiItemResponse<NewsItem>> {
  const form = new FormData();
  if (input.id) form.append("id", input.id);
  else form.append("is_featured", "0");
  form.append("title", input.title);
  form.append("content", input.content);
  if (input.cover) form.append("cover_image", input.cover, input.cover.name);

  try {
    const client = createApiClient();
    const res = await client.post<Envelope<RawNewsItem | null>>("/news", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    assertOk(res.data, "Gagal menyimpan berita.");
    // Response simpan kadang tanpa objek berita — cukup balikin bentuk minimal.
    const raw = res.data.data;
    return {
      data: raw
        ? mapRawNewsItem(raw)
        : {
            id: input.id ?? "",
            title: input.title,
            excerpt: "",
            coverImage: null,
            createdAt: new Date().toISOString(),
          },
    };
  } catch (err) {
    throw toApiError(err, "Gagal terhubung ke server berita.");
  }
}

/** Cari string URL di response `upload_adapter` — bentuknya BELUM diketahui
 *  (nama endpoint = adapter CKEditor, umumnya `{ url }`), jadi dicoba
 *  beberapa key umum. TODO: rapikan setelah kontrak response dikonfirmasi. */
function extractUploadedUrl(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const obj = body as Record<string, unknown>;
  for (const key of ["url", "file_url", "location", "path"]) {
    if (typeof obj[key] === "string" && obj[key]) return obj[key] as string;
  }
  return extractUploadedUrl(obj.data);
}

export const newsClient: NewsApi = {
  async createNews(input) {
    if (TEMP_USE_MOCK_NEWS) throw MUTATION_UNAVAILABLE();
    return saveNews(input);
  },

  async updateNews(input) {
    if (TEMP_USE_MOCK_NEWS) throw MUTATION_UNAVAILABLE();
    return saveNews(input);
  },

  async deleteNews(id) {
    if (TEMP_USE_MOCK_NEWS) throw MUTATION_UNAVAILABLE();
    try {
      const client = createApiClient();
      const res = await client.delete<Envelope<unknown>>("/news", {
        data: new URLSearchParams({ id }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      assertOk(res.data, "Gagal menghapus berita.");
    } catch (err) {
      throw toApiError(err, "Gagal menghapus berita.");
    }
  },

  async uploadNewsImage(file) {
    if (TEMP_USE_MOCK_NEWS) throw MUTATION_UNAVAILABLE();
    const form = new FormData();
    form.append("upload", file, file.name);
    try {
      const client = createApiClient();
      const res = await client.post<unknown>("/news/upload_adapter", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      // TODO(debug sementara): hapus setelah penyebab `{ url: null }` ketemu.
      console.log("[news upload_adapter]", res.status, JSON.stringify(res.data));
      const url = extractUploadedUrl(res.data);
      if (!url) {
        throw new ApiError(
          "NEWS_UPLOAD_FAILED",
          "Server tidak mengembalikan URL gambar yang diunggah.",
        );
      }
      return url;
    } catch (err) {
      throw toApiError(err, "Gagal mengunggah gambar.");
    }
  },

  async getNewsById(id): Promise<ApiItemResponse<NewsDetail>> {
    if (TEMP_USE_MOCK_NEWS) {
      const item = MOCK_NEWS.find((n) => n.id === id);
      if (!item) throw new ApiError("NEWS_NOT_FOUND", "Berita tidak ditemukan.");
      return { data: { ...item, content: item.excerpt ? `<p>${item.excerpt}</p>` : "" } };
    }

    try {
      const client = createApiClient();
      const res = await client.get<Envelope<RawNewsItem | RawNewsItem[] | null>>(
        "/news",
        {
          params: { id },
        },
      );
      assertOk(res.data, "Gagal mengambil detail berita dari server.");
      const raw = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
      if (!raw) throw new ApiError("NEWS_NOT_FOUND", "Berita tidak ditemukan.");
      return { data: mapRawNewsDetail(raw) };
    } catch (err) {
      throw toApiError(err, "Gagal terhubung ke server berita.");
    }
  },

  /** Daftar berita — `createApiClient()` (TANPA companyId, lihat `NewsApi`),
   *  cek `res.data.status`, `ApiError` kalau gagal, TIDAK ada fallback
   *  diam-diam ke mock. Response asli tidak punya `meta` pagination —
   *  disintesis di sini supaya tetap ikut kontrak `ApiListResponse<T>`. */
  async getNews(): Promise<ApiListResponse<NewsItem>> {
    if (TEMP_USE_MOCK_NEWS) {
      return {
        data: MOCK_NEWS,
        meta: { page: 1, pageSize: MOCK_NEWS.length, total: MOCK_NEWS.length },
      };
    }

    try {
      const client = createApiClient();
      const res = await client.get<Envelope<RawNewsItem[]>>("/news");
      assertOk(res.data, "Gagal mengambil data berita dari server.");
      const data = res.data.data.map(mapRawNewsItem);
      return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
    } catch (err) {
      throw toApiError(err, "Gagal terhubung ke server berita.");
    }
  },
};
