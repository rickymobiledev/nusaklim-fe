"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type {
  CreateUserInput,
  ManagedUser,
  UpdateUserInput,
} from "@/types/user-management";
import { fetchJson } from "@/lib/api/client-fetch";
import { getErrorMessage } from "@/lib/api/error-messages";

const USERS_QUERY_KEY = ["users"];

/** `/api/user-management/users` selalu balikin SEMUA pengguna (BE tidak
 *  punya pagination) — search & pagination dilakukan di client, pola
 *  sama `useDownloadData()`. */
export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => fetchJson<ApiListResponse<ManagedUser>>("/api/user-management/users"),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) =>
      fetchJson<ApiItemResponse<ManagedUser>>("/api/user-management/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("Pengguna baru berhasil ditambahkan.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserInput) =>
      fetchJson<ApiItemResponse<ManagedUser>>(`/api/user-management/users/${input.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("Data pengguna berhasil diperbarui.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ data: null }>(`/api/user-management/users/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("Pengguna berhasil dihapus.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
