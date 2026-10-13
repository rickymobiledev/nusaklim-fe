import { isAxiosError } from "axios";
import { ApiError, type ApiItemResponse, type ApiListResponse } from "@/types/api";
import type { MissingDataImportResult, MissingDataRow } from "@/types/domain";
import { validateImportFile } from "@/lib/missing-data-import";
import { createApiClient } from "./fetcher";
import { stationApi } from "./station-client";
import {
  mapRawMissingData,
  type RawMissingDataResponse,
} from "./adapters/missing-data-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { MissingDataApi, MissingDataParams } from "./missing-data-api";

// TODO(sementara — belum ada contoh response BE): true = import Excel pakai
// hasil mock di bawah, BUKAN hit backend asli. `POST /import/aws` (formdata
// Excel, maks 5 MB) sudah diketahui, tapi bentuk response-nya BELUM
// dikonfirmasi lewat tes langsung — begitu ada contoh JSON-nya, isi cabang
// real di `importData` lalu set `false`. `GET /weathers/missing` SUDAH real.
const TEMP_USE_MOCK_MISSING_IMPORT = true;

/** Jumlah baris "berhasil diimpor" pada mock — angka tetap, cuma untuk toast. */
const MOCK_IMPORTED_COUNT = 15;

function emptyPage(params: MissingDataParams): ApiListResponse<MissingDataRow> {
  return { data: [], meta: { page: params.page, pageSize: params.pageSize, total: 0 } };
}

export const missingDataClient: MissingDataApi = {
  /** `GET /weathers/missing?station_id=&start_date=&end_date=&page=&per_page=`
   *  (pagination Laravel, dikonfirmasi lewat contoh response asli).
   *  `stationApi.getStationDetail()` dipanggil DULU sebagai guard company
   *  (pola `sunshine-duration-client.ts`) — endpoint ini pakai `station_id`
   *  mentah, bukan `company_code`. */
  async getMissingData(
    params: MissingDataParams,
  ): Promise<ApiListResponse<MissingDataRow>> {
    try {
      const { data: station } = await stationApi.getStationDetail(
        params.stationId,
        params.companyId,
      );

      const client = createApiClient(params.companyId);
      const res = await client.get<RawMissingDataResponse>("/weathers/missing", {
        params: {
          station_id: station.id,
          start_date: params.dateFrom,
          end_date: params.dateTo,
          page: params.page,
          per_page: params.pageSize,
        },
      });

      if (!res.data.status) {
        throw new ApiError(
          "MISSING_DATA_FETCH_FAILED",
          res.data.message || "Gagal mengambil data missing dari server.",
        );
      }

      const data = (res.data.data ?? []).map(mapRawMissingData);
      const meta = res.data.meta;
      return {
        data,
        meta: {
          page: meta?.current_page ?? params.page,
          pageSize: Number(meta?.per_page) || params.pageSize,
          total: meta?.total ?? data.length,
        },
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;

      // ASUMSI belum dites ke endpoint ini: rentang tanpa baris dibalas HTTP
      // 404 "No such ... found" seperti endpoint BE lain (solar_sunshine/vpd),
      // bukan 200 `data: []`. Itu "kosong", bukan error — aman dibedakan dari
      // station_id salah karena `getStationDetail()` di atas sudah melempar
      // sendiri untuk kasus itu. Kalau BE memang balas 200 kosong, cabang ini
      // tidak pernah terpakai.
      if (
        isAxiosError(err) &&
        err.response?.status === 404 &&
        /^No such .* found/i.test(extractBackendErrorMessage(err) ?? "")
      ) {
        return emptyPage(params);
      }

      throw new ApiError(
        "MISSING_DATA_FETCH_FAILED",
        extractBackendErrorMessage(err) ?? "Gagal terhubung ke server missing data.",
      );
    }
  },

  async importData(file: File): Promise<ApiItemResponse<MissingDataImportResult>> {
    const invalid = validateImportFile(file);
    if (invalid) throw new ApiError("MISSING_DATA_IMPORT_INVALID", invalid);

    if (TEMP_USE_MOCK_MISSING_IMPORT) {
      return { data: { imported: MOCK_IMPORTED_COUNT } };
    }

    // TODO: `POST /import/aws` (formdata `file`) lewat `createApiClient()`.
    throw new ApiError(
      "MISSING_DATA_IMPORT_FAILED",
      "Endpoint import data belum tersambung ke server.",
    );
  },
};
