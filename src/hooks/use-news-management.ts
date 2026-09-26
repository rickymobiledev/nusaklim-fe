"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import { ApiError } from "@/types/api";
import type { NewsDetail, NewsItem } from "@/types/domain";
import type { CreateNewsInput, UpdateNewsInput } from "@/types/user-management";
import { fetchJson } from "@/lib/api/client-fetch";
import { getErrorMessage } from "@/lib/api/error-messages";

const ADMIN_NEWS_QUERY_KEY = ["admin-news"];
const BASE_URL = "/api/user-management/news";

/** Halaman Manajemen > Berita (admin-only; search & pagination di client). */
export function useAdminNews() {
  return useQuery({
    queryKey: ADMIN_NEWS_QUERY_KEY,
    queryFn: () => fetchJson<ApiListResponse<NewsItem>>(BASE_URL),
  });
}

/** Detail berita (form Ubah & dialog Lihat) — `content` HTML lengkap. */
export function useNewsDetail(id: string | null) {
  return useQuery({
    queryKey: [...ADMIN_NEWS_QUERY_KEY, id],
    queryFn: () =>
      fetchJson<ApiItemResponse<NewsDetail>>(
        `${BASE_URL}/${encodeURIComponent(id ?? "")}`,
      ),
    enabled: !!id,
    select: (res) => res.data,
  });
}

/** Upload gambar untuk isi editor → URL publik (BUKAN base64). */
export async function uploadNewsImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("upload", file);
  const res = await fetchJson<{ url?: string }>(`${BASE_URL}/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.url) throw new ApiError("NEWS_UPLOAD_FAILED", "URL gambar tidak diterima.");
  return res.url;
}

function useInvalidateNews() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_NEWS_QUERY_KEY });
    // Kartu "Berita Pilihan" di Beranda (`use-news.ts`) ikut disegarkan.
    queryClient.invalidateQueries({ queryKey: ["news"] });
  };
}

/** Body FormData — JANGAN set Content-Type manual (boundary diisi browser). */
function toFormData({ title, content, cover }: CreateNewsInput): FormData {
  const form = new FormData();
  form.append("title", title);
  form.append("content", content);
  if (cover) form.append("cover", cover);
  return form;
}

export function useCreateNews() {
  const invalidate = useInvalidateNews();
  return useMutation({
    mutationFn: (input: CreateNewsInput) =>
      fetchJson<ApiItemResponse<NewsItem>>(BASE_URL, {
        method: "POST",
        body: toFormData(input),
      }),
    onSuccess: (res) => {
      invalidate();
      toast.success(res?.message || "Berita berhasil ditambahkan.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateNews() {
  const invalidate = useInvalidateNews();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateNewsInput) =>
      fetchJson<ApiItemResponse<NewsItem>>(`${BASE_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: toFormData(input),
      }),
    onSuccess: (res) => {
      invalidate();
      toast.success(res?.message || "Berita berhasil diperbarui.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteNews() {
  const invalidate = useInvalidateNews();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<ApiItemResponse<null>>(`${BASE_URL}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
    onSuccess: (res) => {
      invalidate();
      toast.success(res?.message || "Berita berhasil dihapus.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

/** Set / unset `is_featured` berita — `POST /api/user-management/news/update-featured`. */
export function useUpdateFeatured() {
  const invalidate = useInvalidateNews();
  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      fetchJson<{ data: null; message?: string }>(`${BASE_URL}/update-featured`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_featured: isFeatured }),
      }),
    onSuccess: (res, { isFeatured }) => {
      invalidate();
      toast.success(
        res?.message ||
          (isFeatured ? "Berita diset sebagai featured." : "Featured dihapus."),
      );
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

/** Ubah status berita — `POST /api/user-management/news/update-status`.
 *  `status` hanya boleh: `draft`, `published`, `archived`. */
export function useUpdateStatus() {
  const invalidate = useInvalidateNews();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "draft" | "published" | "archived";
    }) =>
      fetchJson<{ data: null; message?: string }>(`${BASE_URL}/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      }),
    onSuccess: (res, { status }) => {
      invalidate();
      const defaultLabel =
        status === "published"
          ? "Berita berhasil dipublish."
          : status === "draft"
            ? "Berita diset ke draft."
            : "Berita diarsipkan.";
      toast.success(res?.message || defaultLabel);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
