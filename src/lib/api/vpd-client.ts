import { isAxiosError } from "axios";
import { ApiError, type ApiListResponse } from "@/types/api";
import type { VPDReport } from "@/types/domain";
import { createApiClient } from "./fetcher";
import { stationApi } from "./station-client";
import { mapRawVpd, type RawVpdResponse } from "./adapters/vpd-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { MonitoringFilterParams } from "./monitoring-api";

/** Satu-satunya implementasi asli VPD (halaman Monitoring). Endpoint
 *  `GET /vpd?device_id=&start_date=&end_date=` dikonfirmasi lewat tes
 *  langsung ke backend asli (curl) — bentuk mentahnya lihat
 *  `vpd-adapter.ts`.
 *
 *  `stationApi.getStationDetail()` dipanggil DULU sebagai guard company
 *  (pola sama `sunshine-duration-client.ts`/`water-balance-client.ts`)
 *  — endpoint ini sendiri pakai `device_id` mentah, BUKAN `company_code`,
 *  jadi tanpa guard ini role `VIEWER_*` bisa IDOR-request `stationId`
 *  company lain lewat query string. */
export const vpdClient = {
  async getVPD(params: MonitoringFilterParams): Promise<ApiListResponse<VPDReport>> {
    if (!params.stationId) {
      return { data: [], meta: { page: 1, pageSize: 0, total: 0 } };
    }

    try {
      const { data: station } = await stationApi.getStationDetail(
        params.stationId,
        params.companyId,
      );

      const client = createApiClient(params.companyId);
      const res = await client.get<RawVpdResponse>("/vpd", {
        params: {
          device_id: station.id,
          start_date: params.dateFrom,
          end_date: params.dateTo,
        },
      });

      if (!res.data.status) {
        throw new ApiError(
          "VPD_FETCH_FAILED",
          res.data.message || "Gagal mengambil data VPD dari server.",
        );
      }

      const data = res.data.data.map((raw) => mapRawVpd(raw, station.id));
      return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
    } catch (err) {
      if (err instanceof ApiError) throw err;

      // Rentang tanpa baris (mis. hari ini belum ada data) dibalas BE
      // dengan HTTP 404 `{status:false, message:"No such vpd found."}`,
      // BUKAN 200 dengan `data: []` (dikonfirmasi curl ke backend asli) —
      // jadi axios melempar di sini, bukan di cabang `!res.data.status` di
      // atas. Itu "kosong", bukan error. Aman dibedakan dari device_id
      // salah/bukan milik company (BE juga membalas 404 "No such vpd
      // found." untuk itu) karena `getStationDetail()` di atas sudah
      // melempar sendiri untuk kasus itu. Pola sama
      // `sunshine-duration-client.ts`.
      if (
        isAxiosError(err) &&
        err.response?.status === 404 &&
        /^No such vpd found/i.test(extractBackendErrorMessage(err) ?? "")
      ) {
        return { data: [], meta: { page: 1, pageSize: 0, total: 0 } };
      }

      throw new ApiError(
        "VPD_FETCH_FAILED",
        extractBackendErrorMessage(err) ?? "Gagal terhubung ke server VPD.",
      );
    }
  },
};
