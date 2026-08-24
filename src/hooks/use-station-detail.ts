"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiItemResponse } from "@/types/api";
import type { Station } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";

export function useStationDetail(id?: string) {
  return useQuery({
    queryKey: ["stations", "detail", id],
    queryFn: () => fetchJson<ApiItemResponse<Station>>(`/api/stations/${id}`),
    select: (res) => res.data,
    enabled: !!id,
  });
}
