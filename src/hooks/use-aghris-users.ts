"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type {
  AghrisUser,
  CreateAghrisUserInput,
  UpdateAghrisUserInput,
} from "@/types/user-management";
import { fetchJson } from "@/lib/api/client-fetch";
import { getErrorMessage } from "@/lib/api/error-messages";

const AGHRIS_USERS_QUERY_KEY = ["aghris-users"];

/** Balikin SEMUA pengguna Aghris — search & pagination di client, pola
 *  sama `useUsers()`. */
export function useAghrisUsers() {
  return useQuery({
    queryKey: AGHRIS_USERS_QUERY_KEY,
    queryFn: () =>
      fetchJson<ApiListResponse<AghrisUser>>("/api/user-management/aghris-users"),
  });
}

export function useCreateAghrisUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAghrisUserInput) =>
      fetchJson<ApiItemResponse<AghrisUser>>("/api/user-management/aghris-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGHRIS_USERS_QUERY_KEY });
      toast.success("Pengguna Aghris berhasil ditambahkan.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateAghrisUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAghrisUserInput) =>
      fetchJson<ApiItemResponse<AghrisUser>>(
        `/api/user-management/aghris-users/${input.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGHRIS_USERS_QUERY_KEY });
      toast.success("Data pengguna Aghris berhasil diperbarui.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteAghrisUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ data: null }>(`/api/user-management/aghris-users/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGHRIS_USERS_QUERY_KEY });
      toast.success("Pengguna Aghris berhasil dihapus.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
