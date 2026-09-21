import { isAxiosError } from "axios";
import { ApiError, type ApiListResponse } from "@/types/api";
import type { SunshineDuration } from "@/types/domain";
import { createApiClient } from "./fetcher";
import { stationApi } from "./station-client";
import {
  mapRawSunshineDuration,
  type RawSunshineDurationResponse,
} from "./adapters/sunshine-duration-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { MonitoringFilterParams } from "./monitoring-api";

/** Satu-satunya implementasi asli Lama Penyinaran (halaman Monitoring).
 *  Endpoint `GET /solar_sunshine?device_id=&start_date=&end_date=`
 *  dikonfirmasi lewat tes langsung ke backend asli (curl) — bentuk
 *  mentahnya lihat `sunshine-duration-adapter.ts`.
 *
 *  `stationApi.getStationDetail()` dipanggil DULU sebagai guard company
 *  (pola sama `water-balance-client.ts`/`weather-client.ts`) — endpoint
 *  ini sendiri pakai `device_id` mentah, BUKAN `company_code`, jadi
 *  tanpa guard ini role `VIEWER_*` bisa IDOR-request `stationId`
 *  company lain lewat query string. */
export const sunshineDurationClient = {
  async getSunshineDuration(
    params: MonitoringFilterParams,
  ): Promise<ApiListResponse<SunshineDuration>> {
    if (!params.stationId) {
      return { data: [], meta: { page: 1, pageSize: 0, total: 0 } };
    }

    try {
      const { data: station } = await stationApi.getStationDetail(
        params.stationId,
        params.companyId,
      );

      const client = createApiClient(params.companyId);
      const res = await client.get<RawSunshineDurationResponse>("/solar_sunshine", {
        params: {
          device_id: station.id,
          start_date: params.dateFrom,
          end_date: params.dateTo,
        },
      });

      if (!res.data.status) {
        throw new ApiError(
          "SUNSHINE_DURATION_FETCH_FAILED",
          res.data.message || "Gagal mengambil data lama penyinaran dari server.",
        );
      }

      const data = res.data.data.map((raw) => mapRawSunshineDuration(raw, station.id));
      return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
    } catch (err) {
      if (err instanceof ApiError) throw err;

      // Rentang tanpa baris (mis. hari ini belum punya data) dibalas BE
      // dengan HTTP 404 `{status:false, message:"No such solar sunshine
      // found."}`, BUKAN 200 dengan `data: []` (dikonfirmasi curl ke
      // backend asli) — jadi axios melempar di sini, bukan di cabang
      // `!res.data.status` di atas. Itu "kosong", bukan error. Aman
      // dibedakan dari device_id salah/bukan milik company karena
      // `getStationDetail()` di atas sudah melempar sendiri untuk kasus itu.
      if (
        isAxiosError(err) &&
        err.response?.status === 404 &&
        /^No such solar sunshine found/i.test(extractBackendErrorMessage(err) ?? "")
      ) {
        return { data: [], meta: { page: 1, pageSize: 0, total: 0 } };
      }

      throw new ApiError(
        "SUNSHINE_DURATION_FETCH_FAILED",
        extractBackendErrorMessage(err) ?? "Gagal terhubung ke server lama penyinaran.",
      );
    }
  },
};
