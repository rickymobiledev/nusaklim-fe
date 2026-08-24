"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { DownloadDataRow } from "@/types/domain";
import type { GetDownloadDataParams } from "@/lib/api/download-api";
import { fetchJson } from "@/lib/api/client-fetch";
import { USE_MOCK } from "@/constants";

/** `companyId` TIDAK dikirim dari sini — Route Handler yang menentukan
 *  dari sesi server-side (`resolveCompanyId()`), supaya tidak bisa
 *  dispoof lewat query string. */
export function useDownloadData(params: Omit<GetDownloadDataParams, "companyId">) {
  return useQuery({
    queryKey: ["download-data", params],
    queryFn: () => {
      const qs = new URLSearchParams();
      if (params.stationId) qs.set("stationId", params.stationId);
      if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
      if (params.dateTo) qs.set("dateTo", params.dateTo);
      qs.set("granularity", params.granularity);
      if (params.page) qs.set("page", String(params.page));
      if (params.pageSize) qs.set("pageSize", String(params.pageSize));
      return fetchJson<ApiListResponse<DownloadDataRow>>(`/api/download-data?${qs}`);
    },
    enabled: USE_MOCK || (!!params.stationId && !!params.dateFrom && !!params.dateTo),
  });
}
