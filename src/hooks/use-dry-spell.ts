"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { DrySpellReport } from "@/types/domain";
import type { MonitoringFilterParams } from "@/lib/api/monitoring-api";
import { fetchJson } from "@/lib/api/client-fetch";

/** `companyId` TIDAK dikirim dari sini — Route Handler yang menentukan
 *  dari sesi server-side (`resolveCompanyId()`), supaya tidak bisa
 *  dispoof lewat query string. Data sudah 100% real
 *  (`dry-spell-report-client.ts`, `device_id` wajib), jadi TIDAK ada
 *  lagi escape-hatch `USE_MOCK` — konsisten `use-vpd.ts`/
 *  `use-sunshine-duration.ts`/`use-water-balance.ts`. */
export function useDrySpell(params: Omit<MonitoringFilterParams, "companyId"> = {}) {
  return useQuery({
    queryKey: ["monitoring", "dry-spell", params],
    queryFn: () => {
      const qs = new URLSearchParams();
      if (params.stationId) qs.set("stationId", params.stationId);
      if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
      if (params.dateTo) qs.set("dateTo", params.dateTo);
      return fetchJson<ApiListResponse<DrySpellReport>>(
        `/api/monitoring/dry-spell?${qs}`,
      );
    },
    select: (res) => res.data,
    enabled: !!params.stationId && !!params.dateFrom && !!params.dateTo,
  });
}
