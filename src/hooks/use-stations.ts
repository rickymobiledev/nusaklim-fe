"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import { MOCK_STATIONS, MOCK_STATION_SUMMARY, USE_MOCK } from "@/lib/mock-data";
import type { Station, StationSummary } from "@/types/domain";

export function useStations() {
  const api = useApiClient();

  return useQuery<Station[]>({
    queryKey: ["stations"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_STATIONS;
      const { data } = await api.get<Station[]>("/stations");
      return data;
    },
    // Status stasiun (aktif/tidak aktif) berubah dari sinkronisasi IoT —
    // polling ringan tiap 5 menit sudah cukup, tidak perlu WebSocket.
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useStationSummary() {
  const api = useApiClient();

  return useQuery<StationSummary>({
    queryKey: ["stations", "summary"],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_STATION_SUMMARY;
      const { data } = await api.get<StationSummary>("/stations/summary");
      return data;
    },
    refetchInterval: 5 * 60 * 1000,
  });
}
