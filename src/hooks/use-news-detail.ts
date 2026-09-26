"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiItemResponse } from "@/types/api";
import type { NewsDetail } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";

/** Detail berita untuk halaman publik `/news/[id]` (semua user login).
 *  BEDA dari `useNewsDetail` di `use-news-management.ts` yang admin-only. */
export function usePublicNewsDetail(id: string) {
  return useQuery({
    queryKey: ["news", "detail", id],
    queryFn: () =>
      fetchJson<ApiItemResponse<NewsDetail>>(`/api/news/${encodeURIComponent(id)}`),
    select: (res) => res.data,
    enabled: !!id,
  });
}
