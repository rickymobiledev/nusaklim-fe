"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { MissingDataImportResult, MissingDataRow } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";
import { getErrorMessage } from "@/lib/api/error-messages";

const MISSING_DATA_QUERY_KEY = ["missing-data"];

export interface MissingDataQuery {
  stationId?: string;
  /** `yyyy-MM-dd` */
  dateFrom: string;
  /** `yyyy-MM-dd` */
  dateTo: string;
  page: number;
  pageSize: number;
}

/** Filter stasiun/tanggal & pagination SERVER-SIDE (`GET /weathers/missing`) —
 *  `/api/missing-data` balikin SATU halaman + `meta` dari BE. Query baru
 *  menunggu `stationId` terisi. SENGAJA tanpa `keepPreviousData`: tiap
 *  stasiun/tanggal/halaman baru `isLoading = true` sampai data tiba, supaya
 *  skeleton tabel muncul dan user tahu data sedang diganti (dengan
 *  placeholder, tabel lama tampil terus tanpa penanda loading). */
export function useMissingData({
  stationId,
  dateFrom,
  dateTo,
  page,
  pageSize,
}: MissingDataQuery) {
  return useQuery({
    queryKey: [
      ...MISSING_DATA_QUERY_KEY,
      { stationId, dateFrom, dateTo, page, pageSize },
    ],
    queryFn: () => {
      const query = new URLSearchParams({
        stationId: stationId ?? "",
        dateFrom,
        dateTo,
        page: String(page),
        pageSize: String(pageSize),
      });
      return fetchJson<ApiListResponse<MissingDataRow>>(
        `/api/missing-data?${query.toString()}`,
      );
    },
    enabled: Boolean(stationId),
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
