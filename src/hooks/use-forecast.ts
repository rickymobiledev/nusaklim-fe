"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { MOCK_FORECAST_ROWS, USE_MOCK } from "@/lib/mock-data";
import type { DataGranularity, ForecastRow, WeatherDataRow } from "@/types/domain";

/** Ramalan Cuaca — hasil model Deep Learning yang dihitung tim Data Analyst,
 *  diekspos backend lewat satu endpoint per stasiun. */
export function useForecast(stationId?: string) {
  const api = useApiClient();

  return useQuery<ForecastRow[]>({
    queryKey: ["forecast", stationId],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_FORECAST_ROWS;
      const { data } = await api.get<ForecastRow[]>("/forecast", {
        params: { stationId },
      });
      return data;
    },
    enabled: USE_MOCK || !!stationId,
  });
}

interface DownloadDataParams {
  stationId?: string;
  from?: string; // ISO date
  to?: string; // ISO date
  granularity: DataGranularity;
}

export function useWeatherDataTable(params: DownloadDataParams) {
  const api = useApiClient();

  return useQuery<WeatherDataRow[]>({
    queryKey: ["weather-data", params],
    queryFn: async () => {
      if (USE_MOCK) return [];
      const { data } = await api.get<WeatherDataRow[]>("/weather/data", { params });
      return data;
    },
    enabled: USE_MOCK || (!!params.stationId && !!params.from && !!params.to),
  });
}
