"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { StationRainfallToday } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";

/** `companyId` TIDAK dikirim dari sini — Route Handler yang menentukan
 *  dari sesi server-side (`resolveCompanyId()`). Snapshot company-wide
 *  HARI INI untuk tab Peta > Curah Hujan Hari Ini — tidak ada konflik
 *  nama dengan domain lain (beda dari `use-dry-spell-map.ts` yang
 *  sengaja pakai suffix `-map` karena `use-dry-spell.ts` sudah dipakai
 *  Monitoring), jadi nama file ikut pola `use-water-deficit.ts`. */
export function useRainfallToday() {
  return useQuery({
    queryKey: ["map", "rainfall-today"],
    queryFn: () =>
      fetchJson<ApiListResponse<StationRainfallToday>>("/api/map/rainfall-today"),
    select: (res) => res.data,
    // Data "hari ini", polling ringan tiap 5 menit sudah cukup, sama
    // seperti use-water-deficit.ts/use-dry-spell-map.ts.
    refetchInterval: 5 * 60 * 1000,
  });
}
