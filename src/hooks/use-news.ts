"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { NewsItem } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";

/** Cache selama 15 menit — sinkron dengan `revalidate = 900` di Route Handler
 *  `/api/news`. Saat user pindah dari Beranda ke halaman \"Lihat Semua Berita\"
 *  (atau sebaliknya) dalam rentang waktu itu, TanStack Query TIDAK perlu hit
 *  API lagi karena data sudah tersimpan di memori (in-memory query cache).
 *  Jika lebih dari 15 menit, query otomatis di-refetch di background. */
const NEWS_STALE_MS = 15 * 60 * 1000; // 15 menit

/** \"Berita Pilihan\" di Beranda dan halaman daftar berita — sudah 100% real
 *  (`news-client.ts` via `/api/news`), tidak ada `companyId`/parameter apa
 *  pun (lihat `lib/api/news-api.ts`). */
export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => fetchJson<ApiListResponse<NewsItem>>("/api/news"),
    // Featured selalu di depan (kartu besar Beranda), sisanya terbaru dulu —
    // jangan bergantung pada urutan dari API/cache.
    select: (res) =>
      [...res.data].sort((a, b) =>
        a.isFeatured !== b.isFeatured
          ? a.isFeatured
            ? -1
            : 1
          : b.createdAt.localeCompare(a.createdAt),
      ),
    staleTime: NEWS_STALE_MS,
  });
}
