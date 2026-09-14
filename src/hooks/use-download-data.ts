"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { DownloadDataRow } from "@/types/domain";
import type { GetDownloadDataParams } from "@/lib/api/download-api";
import { fetchJson } from "@/lib/api/client-fetch";

/** `companyId` TIDAK dikirim dari sini — Route Handler yang menentukan
 *  dari sesi server-side (`resolveCompanyId()`), supaya tidak bisa
 *  dispoof lewat query string. Domain ini sudah 100% real (bukan mock
 *  lagi) — `enabled` tidak baca `USE_MOCK` sama sekali, pola sama
 *  `use-stations.ts`/hook Weather lain yang sudah real duluan.
 *
 *  `page`/`pageSize` SENGAJA tidak diterima/dikirim sama sekali (beda dari
 *  `GetDownloadDataParams` yang masih punya field itu untuk fleksibilitas
 *  API) — `download-client.ts` balikin SEMUA baris kalau keduanya tidak
 *  dikirim (pola sama `useStations()`), jadi `queryKey` di sini stabil
 *  selama stasiun/tanggal/granularitas tidak berubah. Pagination halaman
 *  Unduh Data dilakukan MURNI di client (`DownloadDataSection.tsx` slice
 *  array yang sudah ke-fetch) — permintaan eksplisit user supaya pindah
 *  halaman/ganti "Jumlah data perbaris" tidak memicu fetch/loading lagi. */
export function useDownloadData(
  params: Omit<GetDownloadDataParams, "companyId" | "page" | "pageSize">,
) {
  return useQuery({
    queryKey: ["download-data", params],
    queryFn: () => {
      const qs = new URLSearchParams();
      if (params.stationId) qs.set("stationId", params.stationId);
      if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
      if (params.dateTo) qs.set("dateTo", params.dateTo);
      qs.set("granularity", params.granularity);
      return fetchJson<ApiListResponse<DownloadDataRow>>(`/api/download-data?${qs}`);
    },
    enabled: !!params.stationId && !!params.dateFrom && !!params.dateTo,
  });
}
