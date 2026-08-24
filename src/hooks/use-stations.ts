"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { Station, StationSummary } from "@/types/domain";
import type { GetStationsParams } from "@/lib/api/station-api";
import { fetchJson } from "@/lib/api/client-fetch";

/** `companyId` TIDAK dikirim dari sini — Route Handler yang menentukan
 *  dari sesi server-side (`resolveCompanyId()`), supaya tidak bisa
 *  dispoof lewat query string. */
export function useStations(params: Omit<GetStationsParams, "companyId"> = {}) {
  return useQuery({
    queryKey: ["stations", params],
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (params.status) qs.set("status", params.status);
      return fetchJson<ApiListResponse<Station>>(`/api/stations?${qs}`);
    },
    // Status stasiun (aktif/tidak aktif) berubah dari sinkronisasi IoT —
    // polling ringan tiap 5 menit sudah cukup, tidak perlu WebSocket.
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useStationSummary() {
  return useQuery({
    queryKey: ["stations", "summary"],
    queryFn: async () =>
      fetchJson<ApiItemResponse<StationSummary>>("/api/stations/summary"),
    select: (res) => res.data,
    refetchInterval: 5 * 60 * 1000,
  });
}
