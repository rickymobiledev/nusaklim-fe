"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/client-fetch";
import type {
  LatestWeatherData,
  LatestWeatherItem,
} from "@/lib/api/latest-weather-client";

/** Hook untuk mengambil data cuaca terkini 7 parameter pada halaman dashboard:
 *  `/api/v2/dashboards/latest_weather?weather_station_id={stationId}`.
 *  Data otomatis di-refresh ketika stasiun berubah atau saat pertama kali masuk dashboard. */
export function useLatestWeather(stationId?: string) {
  const query = useQuery({
    queryKey: ["latest-weather", stationId],
    queryFn: () =>
      fetchJson<{ status: boolean; data: LatestWeatherData }>(
        `/api/dashboards/latest_weather?weather_station_id=${encodeURIComponent(
          stationId ?? "",
        )}`,
      ),
    select: (res) => res.data,
    enabled: !!stationId,
    refetchInterval: 5 * 60 * 1000,
  });

  const weatherMap = useMemo(() => {
    const map: Record<string, LatestWeatherItem> = {};
    query.data?.weathers?.forEach((item) => {
      map[item.weather_parameter] = item;
    });
    return map;
  }, [query.data]);

  return {
    ...query,
    weatherMap,
    lastSync: query.data?.last_sync,
    stationName: query.data?.weather_station_name,
  };
}
