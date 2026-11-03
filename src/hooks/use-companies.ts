"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "@/types/user-management";
import { fetchJson } from "@/lib/api/client-fetch";
import { getErrorMessage } from "@/lib/api/error-messages";

const COMPANIES_QUERY_KEY = ["companies"];

/** Dipakai dropdown "Perusahaan" di form Tambah/Edit Pengguna DAN halaman
 *  Manajemen > Perusahaan (search & pagination di client). */
export function useCompanies() {
  return useQuery({
    queryKey: COMPANIES_QUERY_KEY,
    queryFn: () => fetchJson<ApiListResponse<Company>>("/api/user-management/companies"),
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCompanyInput) => {
      const form = new FormData();
      form.append("name", input.name);
      form.append("code", input.code);
      form.append("image", input.image, input.image.name);
      return fetchJson<ApiItemResponse<Company>>("/api/user-management/companies", {
        method: "POST",
        body: form,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
      toast.success("Perusahaan berhasil ditambahkan.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCompanyInput) => {
      const form = new FormData();
      form.append("name", input.name);
      if (input.image) form.append("image", input.image, input.image.name);
      return fetchJson<ApiItemResponse<Company>>(
        `/api/user-management/companies/${input.id}`,
        { method: "PUT", body: form },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
      toast.success("Data perusahaan berhasil diperbarui.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetchJson<{ data: null }>(`/api/user-management/companies/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
      toast.success("Perusahaan berhasil dihapus.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
