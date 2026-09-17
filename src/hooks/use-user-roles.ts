"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { UserRoleOption } from "@/types/user-management";
import { fetchJson } from "@/lib/api/client-fetch";

/** Dipakai dropdown "Peran" di form Tambah/Edit Pengguna. */
export function useUserRoles() {
  return useQuery({
    queryKey: ["user-roles"],
    queryFn: () =>
      fetchJson<ApiListResponse<UserRoleOption>>("/api/user-management/user-roles"),
  });
}
