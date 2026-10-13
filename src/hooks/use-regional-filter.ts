"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { Station } from "@/types/domain";
import type { Company } from "@/types/user-management";
import { fetchJson } from "@/lib/api/client-fetch";

/** Opsi dropdown "Regional" (Unduh Data). Route Handler membatasi hasilnya
 *  ke company user sendiri untuk role non-admin/peneliti. */
export function useRegionalCompanies() {
  return useQuery({
    queryKey: ["regional-companies"],
    queryFn: () => fetchJson<ApiListResponse<Company>>("/api/regional/companies"),
  });
}

/** Stasiun milik regional terpilih (`GET /devices?company_code=`). Tidak
 *  jalan sebelum regional dipilih. */
export function useRegionalStations(companyCode: string | undefined) {
  return useQuery({
    queryKey: ["regional-stations", companyCode],
    queryFn: () =>
      fetchJson<ApiListResponse<Station>>(
        `/api/regional/stations?companyCode=${encodeURIComponent(companyCode ?? "")}`,
      ),
    enabled: !!companyCode,
  });
}
