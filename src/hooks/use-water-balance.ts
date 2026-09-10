"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { WaterBalance } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";

/** `companyId` TIDAK dikirim dari sini — Route Handler yang menentukan
 *  dari sesi server-side (`resolveCompanyId()`), supaya tidak bisa
 *  dispoof lewat query string. `years` di-fan-out di Route Handler (satu
 *  call BE per tahun) — hook ini cuma manggil SATU internal endpoint,
 *  lihat `app/api/monitoring/water-balance/route.ts`. Data sudah 100%
 *  real (`water-balance-client.ts`, `device_id` wajib), jadi TIDAK ada
 *  lagi escape-hatch `USE_MOCK` seperti Fase 1 — konsisten
 *  `use-stations.ts`/`use-weather-metrics.ts`. */
export function useWaterBalance(params: { stationId?: string; years: number[] }) {
  return useQuery({
    queryKey: ["monitoring", "water-balance", params],
    queryFn: () => {
      const qs = new URLSearchParams();
      if (params.stationId) qs.set("stationId", params.stationId);
      qs.set("years", params.years.join(","));
      return fetchJson<ApiListResponse<WaterBalance>>(
        `/api/monitoring/water-balance?${qs}`,
      );
    },
    select: (res) => res.data,
    enabled: !!params.stationId && params.years.length > 0,
  });
}
