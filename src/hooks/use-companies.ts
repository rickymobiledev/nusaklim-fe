"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { Company } from "@/types/user-management";
import { fetchJson } from "@/lib/api/client-fetch";

/** Dipakai dropdown "Perusahaan" di form Tambah/Edit Pengguna. */
export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => fetchJson<ApiListResponse<Company>>("/api/user-management/companies"),
  });
}
