"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { VPDReport } from "@/types/domain";
import type { MonitoringFilterParams } from "@/lib/api/monitoring-api";
import { fetchJson } from "@/lib/api/client-fetch";
import { USE_MOCK } from "@/constants";

/** `companyId` TIDAK dikirim dari sini — Route Handler yang menentukan
 *  dari sesi server-side (`resolveCompanyId()`), supaya tidak bisa
 *  dispoof lewat query string. Lihat CLAUDE.md "companyId (multi-tenant)". */
export function useVPD(params: Omit<MonitoringFilterParams, "companyId"> = {}) {
  return useQuery({
    queryKey: ["monitoring", "vpd", params],
    queryFn: () => {
      const qs = new URLSearchParams();
      if (params.stationId) qs.set("stationId", params.stationId);
      if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
      if (params.dateTo) qs.set("dateTo", params.dateTo);
      return fetchJson<ApiListResponse<VPDReport>>(`/api/monitoring/vpd?${qs}`);
    },
    select: (res) => res.data,
    enabled: USE_MOCK || !!params.stationId,
  });
}
