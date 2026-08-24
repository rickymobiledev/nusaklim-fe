"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiItemResponse } from "@/types/api";
import type { WaterBalance } from "@/types/domain";
import type { MonitoringFilterParams } from "@/lib/api/monitoring-api";
import { fetchJson } from "@/lib/api/client-fetch";
import { USE_MOCK } from "@/constants";

/** `companyId` TIDAK dikirim dari sini — Route Handler yang menentukan
 *  dari sesi server-side (`resolveCompanyId()`), supaya tidak bisa
 *  dispoof lewat query string. Lihat CLAUDE.md "companyId (multi-tenant)". */
export function useWaterBalance(params: Omit<MonitoringFilterParams, "companyId"> = {}) {
  return useQuery({
    queryKey: ["monitoring", "water-balance", params],
    queryFn: () => {
      const qs = new URLSearchParams();
      if (params.stationId) qs.set("stationId", params.stationId);
      if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
      if (params.dateTo) qs.set("dateTo", params.dateTo);
      return fetchJson<ApiItemResponse<WaterBalance>>(
        `/api/monitoring/water-balance?${qs}`,
      );
    },
    select: (res) => res.data,
    enabled: USE_MOCK || !!params.stationId,
  });
}
