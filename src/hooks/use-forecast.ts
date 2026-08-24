"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiItemResponse } from "@/types/api";
import type { ForecastResult } from "@/types/ramalan-cuaca";
import { fetchJson } from "@/lib/api/client-fetch";
import { USE_MOCK } from "@/constants";

/** Ramalan Cuaca — hasil model Deep Learning yang dihitung tim Data Analyst,
 *  diekspos backend lewat satu endpoint per stasiun (POST, lihat
 *  app/api/forecast/route.ts). */
export function useForecast(stationId?: string) {
  return useQuery({
    queryKey: ["forecast", stationId],
    queryFn: () =>
      fetchJson<ApiItemResponse<ForecastResult>>("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stationId: stationId ?? "" }),
      }),
    select: (res) => res.data,
    enabled: USE_MOCK || !!stationId,
  });
}
