"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/client-fetch";
import type {
  LatestWeatherData,
  LatestWeatherItem,
} from "@/lib/api/latest-weather-client";

export function computeDayTrend(
  last3Days?: { average?: string; sum?: string }[],
): number | null {
  if (!last3Days || last3Days.length < 2) return null;
  const last = last3Days[last3Days.length - 1];
  const prev = last3Days[last3Days.length - 2];
  const valLast = parseFloat(
    (last.average ?? last.sum ?? "").replace(/[^0-9.-]/g, ""),
  );
  const valPrev = parseFloat(
    (prev.average ?? prev.sum ?? "").replace(/[^0-9.-]/g, ""),
  );
  if (isNaN(valLast) || isNaN(valPrev) || valPrev === 0) return null;
  const percent = Math.round(((valLast - valPrev) / valPrev) * 100);
  return percent === 0 ? null : percent;
}

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
