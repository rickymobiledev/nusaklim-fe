"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { NewsItem } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";

/** "Berita Pilihan" di Beranda — sudah 100% real (`news-client.ts`), tidak
 *  ada `companyId`/parameter apa pun (lihat `lib/api/news-api.ts`). Tidak
 *  pakai `refetchInterval` seperti `use-rainfall-today.ts` — berita tidak
 *  sesensitif snapshot cuaca real-time, default cache TanStack Query
 *  sudah cukup. */
export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => fetchJson<ApiListResponse<NewsItem>>("/api/news"),
    select: (res) => res.data,
  });
}
