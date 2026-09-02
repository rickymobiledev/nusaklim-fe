"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { ApiListResponse } from "@/types/api";
import type { AirTemperatureStationSeries } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";

/** `companyId` TIDAK dikirim dari sini — Route Handler yang menentukan
 *  dari sesi server-side (`resolveCompanyId()`), sama seperti `use-stations.ts`. */
export function useAirTemperatureChart(
  stationIds: string[],
  dateRange: DateRange | undefined,
) {
  const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;

  return useQuery({
    queryKey: ["air-temperature-daily", stationIds, startDate, endDate],
    queryFn: () => {
      const qs = new URLSearchParams({
        stationIds: stationIds.join(","),
        startDate: startDate!,
        endDate: endDate!,
      });
      return fetchJson<ApiListResponse<AirTemperatureStationSeries>>(
        `/api/air-temperature/daily?${qs}`,
      );
    },
    select: (res) => res.data,
    enabled: stationIds.length > 0 && !!startDate && !!endDate,
  });
}
