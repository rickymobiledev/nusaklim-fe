"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { MissingDataImportResult, MissingDataRow } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";
import { getErrorMessage } from "@/lib/api/error-messages";

const MISSING_DATA_QUERY_KEY = ["missing-data"];

/** `/api/missing-data` balikin SEMUA baris sekaligus — filter stasiun/tanggal
 *  & pagination dilakukan di client (pola `useDownloadData()`). */
export function useMissingData() {
  return useQuery({
    queryKey: MISSING_DATA_QUERY_KEY,
    queryFn: () => fetchJson<ApiListResponse<MissingDataRow>>("/api/missing-data"),
  });
}

export function useImportMissingData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const body = new FormData();
      body.append("file", file);
      // Tanpa header Content-Type — browser yang mengisi boundary multipart.
      return fetchJson<ApiItemResponse<MissingDataImportResult>>(
        "/api/missing-data/import",
        { method: "POST", body },
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: MISSING_DATA_QUERY_KEY });
      toast.success(`${res.data.imported} data berhasil diimpor.`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
