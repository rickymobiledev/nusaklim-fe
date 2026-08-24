"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiItemResponse } from "@/types/api";
import type { WeatherMetric } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";
import { USE_MOCK } from "@/constants";

export function useWeatherMetrics(stationId?: string) {
  return useQuery({
    queryKey: ["weather-metrics", stationId],
    queryFn: () => {
      const qs = new URLSearchParams();
      if (stationId) qs.set("stationId", stationId);
      return fetchJson<ApiItemResponse<WeatherMetric>>(`/api/weather?${qs}`);
    },
    select: (res) => res.data,
    enabled: USE_MOCK || !!stationId,
  });
}
