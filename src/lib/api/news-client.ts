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

/** Tambah & ubah SAMA-SAMA `POST /news` multipart (tambah: title, content,
 *  cover_image; ubah: sama + `id`). */
async function saveNews(
  input: CreateNewsInput & { id?: string },
): Promise<ApiItemResponse<NewsItem>> {
  const form = new FormData();
  if (input.id) form.append("id", input.id);
  form.append("title", input.title);
  form.append("content", input.content);
  if (input.cover) form.append("cover_image", input.cover, input.cover.name);

  try {
    const client = createApiClient();
    const res = await client.post<Envelope<RawNewsItem | null>>("/news", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    assertOk(res.data, "Gagal menyimpan berita.");
    const raw = res.data.data;
    return {
      message: res.data.message,
      data: raw
        ? mapRawNewsItem(raw, input.id)
        : {
            id: input.id ?? "",
            title: input.title,
            excerpt: "",
            coverImage: null,
            createdAt: new Date().toISOString(),
            status: "draft",
            isFeatured: false,
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
  /** Berita publik dari `GET /news/published` — tidak filter status karena
   *  backend sudah hanya kembalikan yang published. `is_featured = 1` di
   *  paling depan, sisanya terbaru dulu. */
  async getPublishedNews(): Promise<ApiListResponse<NewsItem>> {
    try {
      const client = createApiClient();
      const res = await client.get<{
        status: boolean;
        message?: string;
        data: RawNewsItem[];
      }>("/news/published");

      if (!res.data.status) {
        throw new ApiError(
          "NEWS_FETCH_FAILED",
          res.data.message || "Gagal mengambil data berita dari server.",
        );
      }

      const data = res.data.data
        .map((item) => mapRawNewsItem(item))
        .sort(compareNews);
      return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
    } catch (err) {
      throw toApiError(err, "Gagal terhubung ke server berita.");
    }
  },

  async createNews(input) {
    return saveNews(input);
  },

  async updateNews(input) {
    return saveNews(input);
  },

  async deleteNews(id) {
    try {
      const client = createApiClient();
      const body = new URLSearchParams({ id });
      const res = await client.delete<Envelope<unknown>>("/news", {
        data: body.toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      assertOk(res.data, "Gagal menghapus berita.");
      return { message: res.data.message };
    } catch (err) {
      throw toApiError(err, "Gagal menghapus berita.");
    }
  },

  async uploadNewsImage(file) {
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

  /** Detail satu berita: `GET /news?id=<id>`.
   *  Response `data` bisa objek tunggal ATAU array (bergantung versi BE) —
   *  keduanya ditangani. Field cover adalah `cover_image_url` di response
   *  terbaru; `mapRawNewsDetail` sudah fallback ke `cover_image` lama. */
  async getNewsById(id): Promise<ApiItemResponse<NewsDetail>> {
    try {
      const client = createApiClient();
      const res = await client.get<Envelope<RawNewsItem | RawNewsItem[] | null>>(
        "/news",
        { params: { id } },
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
        .map((item) => mapRawNewsItem(item))
        .sort(compareNews);

      return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
    } catch (err) {
      throw toApiError(err, "Gagal terhubung ke server berita.");
    }
  },

  /** `POST /news/update_featured` — body `application/x-www-form-urlencoded`. */
  async updateFeatured(id, isFeatured) {
    try {
      const client = createApiClient();
      const body = new URLSearchParams({ id, is_featured: isFeatured ? "1" : "0" });
      const res = await client.post<Envelope<unknown>>(
        "/news/update_featured",
        body.toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );
      assertOk(res.data, "Gagal mengubah status featured berita.");
      return { message: res.data.message };
    } catch (err) {
      throw toApiError(err, "Gagal mengubah status featured berita.");
    }
  },

  /** `POST /news/update_status` — body `application/x-www-form-urlencoded`.
   *  `status` hanya boleh: `draft`, `published`, `archived`. */
  async updateStatus(id, status) {
    try {
      const client = createApiClient();
      const body = new URLSearchParams({ id, status });
      const res = await client.post<Envelope<unknown>>(
        "/news/update_status",
        body.toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );
      assertOk(res.data, "Gagal mengubah status berita.");
      return { message: res.data.message };
    } catch (err) {
      throw toApiError(err, "Gagal mengubah status berita.");
    }
  },
};
