"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { StationWaterDeficit } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";

/** TODO: data panel "Perbandingan Defisit Air" (`WaterDeficitPanel.tsx`)
 *  masih mock (`/api/map/water-deficit-comparison` -> `waterDeficitComparisonApi`)
 *  — beda dari `useWaterDeficit()` (peta, sudah real via
 *  `/devices/water_deficit`). `companyId` TIDAK dikirim dari sini — Route
 *  Handler yang menentukan dari sesi server-side (`resolveCompanyId()`). */
export function useWaterDeficitComparison() {
  return useQuery({
    queryKey: ["map", "water-deficit-comparison"],
    queryFn: () =>
      fetchJson<ApiListResponse<StationWaterDeficit>>(
        "/api/map/water-deficit-comparison",
      ),
    select: (res) => res.data,
    refetchInterval: 5 * 60 * 1000,
  });
}
