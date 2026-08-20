"use client";

import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";
import {
  MOCK_DERET_HARI_TIDAK_HUJAN,
  MOCK_KESEIMBANGAN_AIR,
  MOCK_LAMA_PENYINARAN,
  MOCK_VPD,
  MOCK_WEATHER_SNAPSHOT,
  USE_MOCK,
} from "@/lib/mock-data";
import type {
  DeretHariTidakHujan,
  KeseimbanganAir,
  LamaPenyinaran,
  VpdIndex,
  WeatherSnapshot,
} from "@/types/domain";

export function useWeatherSnapshot(stationId?: string) {
  const api = useApiClient();

  return useQuery<WeatherSnapshot>({
    queryKey: ["weather-snapshot", stationId],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_WEATHER_SNAPSHOT;
      const { data } = await api.get<WeatherSnapshot>("/weather/snapshot", {
        params: { stationId },
      });
      return data;
    },
    enabled: USE_MOCK || !!stationId,
  });
}

export function useKeseimbanganAir(stationId?: string) {
  const api = useApiClient();
  return useQuery<KeseimbanganAir>({
    queryKey: ["monitoring", "keseimbangan-air", stationId],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_KESEIMBANGAN_AIR;
      const { data } = await api.get<KeseimbanganAir>("/monitoring/keseimbangan-air", {
        params: { stationId },
      });
      return data;
    },
    enabled: USE_MOCK || !!stationId,
  });
}

export function useDeretHariTidakHujan(stationId?: string) {
  const api = useApiClient();
  return useQuery<DeretHariTidakHujan>({
    queryKey: ["monitoring", "deret-hari-tidak-hujan", stationId],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_DERET_HARI_TIDAK_HUJAN;
      const { data } = await api.get<DeretHariTidakHujan>(
        "/monitoring/deret-hari-tidak-hujan",
        { params: { stationId } },
      );
      return data;
    },
    enabled: USE_MOCK || !!stationId,
  });
}

export function useLamaPenyinaran(stationId?: string) {
  const api = useApiClient();
  return useQuery<LamaPenyinaran>({
    queryKey: ["monitoring", "lama-penyinaran", stationId],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_LAMA_PENYINARAN;
      const { data } = await api.get<LamaPenyinaran>("/monitoring/lama-penyinaran", {
        params: { stationId },
      });
      return data;
    },
    enabled: USE_MOCK || !!stationId,
  });
}

export function useVpd(stationId?: string) {
  const api = useApiClient();
  return useQuery<VpdIndex>({
    queryKey: ["monitoring", "vpd", stationId],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_VPD;
      const { data } = await api.get<VpdIndex>("/monitoring/vpd", {
        params: { stationId },
      });
      return data;
    },
    enabled: USE_MOCK || !!stationId,
  });
}
