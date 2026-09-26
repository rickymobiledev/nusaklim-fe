"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/api/client-fetch";
import type {
  DashboardWaterBalanceData,
  DashboardDrySpellData,
  DashboardSunshineDurationData,
  DashboardVpdData,
} from "@/lib/api/dashboard-sidebar-client";

interface ApiResponse<T> {
  status: boolean;
  data: T;
}

/** Hook untuk mengambil data Keseimbangan Air pada sidebar dashboard:
 *  `/api/v2/dashboards/water_balance?weather_station_id={stationId}`. */
export function useDashboardWaterBalance(stationId?: string) {
  return useQuery({
    queryKey: ["dashboard-water-balance", stationId],
    queryFn: () =>
      fetchJson<ApiResponse<DashboardWaterBalanceData>>(
        `/api/dashboards/water_balance?weather_station_id=${encodeURIComponent(
          stationId ?? "",
        )}`,
      ),
    select: (res) => res.data,
    enabled: !!stationId,
    refetchInterval: 5 * 60 * 1000,
  });
}

/** Hook untuk mengambil data Deret Hari Terpanjang Tidak Hujan pada sidebar dashboard:
 *  `/api/v2/dashboards/dry_spell?weather_station_id={stationId}`. */
export function useDashboardDrySpell(stationId?: string) {
  return useQuery({
    queryKey: ["dashboard-dry-spell", stationId],
    queryFn: () =>
      fetchJson<ApiResponse<DashboardDrySpellData>>(
        `/api/dashboards/dry_spell?weather_station_id=${encodeURIComponent(
          stationId ?? "",
        )}`,
      ),
    select: (res) => res.data,
    enabled: !!stationId,
    refetchInterval: 5 * 60 * 1000,
  });
}

/** Hook untuk mengambil data Lama Penyinaran pada sidebar dashboard:
 *  `/api/v2/dashboards/solar_sunshine_duration?weather_station_id={stationId}`. */
export function useDashboardSunshineDuration(stationId?: string) {
  return useQuery({
    queryKey: ["dashboard-sunshine-duration", stationId],
    queryFn: () =>
      fetchJson<ApiResponse<DashboardSunshineDurationData>>(
        `/api/dashboards/solar_sunshine_duration?weather_station_id=${encodeURIComponent(
          stationId ?? "",
        )}`,
      ),
    select: (res) => res.data,
    enabled: !!stationId,
    refetchInterval: 5 * 60 * 1000,
  });
}

/** Hook untuk mengambil data VPD pada sidebar dashboard:
 *  `/api/v2/dashboards/vpd?weather_station_id={stationId}`. */
export function useDashboardVpd(stationId?: string) {
  return useQuery({
    queryKey: ["dashboard-vpd", stationId],
    queryFn: () =>
      fetchJson<ApiResponse<DashboardVpdData>>(
        `/api/dashboards/vpd?weather_station_id=${encodeURIComponent(
          stationId ?? "",
        )}`,
      ),
    select: (res) => res.data,
    enabled: !!stationId,
    refetchInterval: 5 * 60 * 1000,
  });
}
