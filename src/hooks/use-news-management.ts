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
    onSuccess: () => {
      invalidate();
      toast.success("Berita berhasil ditambahkan.");
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
    onSuccess: () => {
      invalidate();
      toast.success("Berita berhasil diperbarui.");
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
    onSuccess: () => {
      invalidate();
      toast.success("Berita berhasil dihapus.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
