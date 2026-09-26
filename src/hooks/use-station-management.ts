"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { Station } from "@/types/domain";
import type { CreateStationInput, UpdateStationInput } from "@/types/user-management";
import { fetchJson } from "@/lib/api/client-fetch";
import { getErrorMessage } from "@/lib/api/error-messages";

const ADMIN_STATIONS_QUERY_KEY = ["admin-stations"];
const BASE_URL = "/api/user-management/stations";

/** Halaman Manajemen > Stasiun (admin-only; search & pagination di client). */
export function useAdminStations() {
  return useQuery({
    queryKey: ADMIN_STATIONS_QUERY_KEY,
    queryFn: () => fetchJson<ApiListResponse<Station>>(BASE_URL),
  });
}

function useInvalidateStations() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_STATIONS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["stations"] });
  };
}

export function useCreateStation() {
  const invalidate = useInvalidateStations();
  return useMutation({
    mutationFn: (input: CreateStationInput) =>
      fetchJson<ApiItemResponse<Station>>(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      invalidate();
      toast.success("Stasiun berhasil ditambahkan.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateStation() {
  const invalidate = useInvalidateStations();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateStationInput) =>
      fetchJson<ApiItemResponse<Station>>(`${BASE_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      invalidate();
      toast.success("Data stasiun berhasil diperbarui.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteStation() {
  const invalidate = useInvalidateStations();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ data: null }>(`${BASE_URL}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      invalidate();
      toast.success("Stasiun berhasil dihapus.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
