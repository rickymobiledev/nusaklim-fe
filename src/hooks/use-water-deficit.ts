"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { StationWaterDeficit } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";

/** `companyId` TIDAK dikirim dari sini — Route Handler yang menentukan
 *  dari sesi server-side (`resolveCompanyId()`). Snapshot company-wide
 *  "hari ini" untuk tab Peta > Keseimbangan Air — beda dari
 *  `useWaterBalance` (data setahun per SATU stasiun, halaman Monitoring). */
export function useWaterDeficit() {
  return useQuery({
    queryKey: ["map", "water-deficit"],
    queryFn: () =>
      fetchJson<ApiListResponse<StationWaterDeficit>>("/api/map/water-deficit"),
    select: (res) => res.data,
    // Sama seperti use-stations.ts — data "hari ini", polling ringan tiap
    // 5 menit sudah cukup, tidak perlu WebSocket.
    refetchInterval: 5 * 60 * 1000,
  });
}
