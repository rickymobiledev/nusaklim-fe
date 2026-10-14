"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiItemResponse } from "@/types/api";
import type { ForecastModel, ForecastResult } from "@/types/forecast";
import { fetchJson } from "@/lib/api/client-fetch";

/** Ramalan Cuaca — hasil model Deep Learning yang dihitung tim Data Analyst,
 *  diekspos backend lewat satu endpoint per stasiun (POST, lihat
 *  app/api/forecast/route.ts). Sudah 100% real (`forecast-client.ts`)
 *  — `USE_MOCK` sudah tidak dibaca lagi di sini, sama seperti
 *  `use-stations.ts`/`use-weather-metrics.ts`. */
export function useForecast(stationId?: string, model: ForecastModel = "sekunder") {
  return useQuery({
    queryKey: ["forecast", stationId, model],
    queryFn: () =>
      fetchJson<ApiItemResponse<ForecastResult>>("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stationId: stationId ?? "", model }),
      }),
    select: (res) => res.data,
    enabled: !!stationId,
    // Pindah tab model harus selalu hit API ulang, bukan pakai cache lama.
    staleTime: 0,
  });
}
