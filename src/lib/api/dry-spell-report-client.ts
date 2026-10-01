import { isAxiosError } from "axios";
import { ApiError, type ApiListResponse } from "@/types/api";
import type { DrySpellReport } from "@/types/domain";
import { createApiClient } from "./fetcher";
import { stationApi } from "./station-client";
import {
  mapRawDrySpellReport,
  type RawDrySpellReportResponse,
} from "./adapters/dry-spell-report-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { MonitoringFilterParams } from "./monitoring-api";

/** Satu-satunya implementasi asli Deret Hari Tanpa Hujan halaman
 *  Monitoring. Endpoint `GET /dry_spell?device_id=&start_date=&end_date=`
 *  dikonfirmasi lewat tes langsung ke backend asli (curl) — bentuk
 *  mentahnya lihat `adapters/dry-spell-report-adapter.ts`.
 *
 *  **JANGAN disamakan** dengan `lib/api/dry-spell-client.ts`
 *  (`drySpellClient`, `WaterDeficitApi`-style `getStationDrySpell`) —
 *  itu punya endpoint company-wide `GET /devices/dry_spell?company_code=&year=`
 *  untuk tab Peta, konsumer beda (`useDrySpellMap`), TIDAK dipakai
 *  halaman Monitoring. File ini implement `MonitoringApi.getDrySpell`.
 *
 *  `stationApi.getStationDetail()` dipanggil DULU sebagai guard company
 *  (pola sama `vpd-client.ts`/`sunshine-duration-client.ts`) — endpoint
 *  ini pakai `device_id` mentah, BUKAN `company_code`. */
export const drySpellReportClient = {
  async getDrySpell(
    params: MonitoringFilterParams,
  ): Promise<ApiListResponse<DrySpellReport>> {
    if (!params.stationId) {
      return { data: [], meta: { page: 1, pageSize: 0, total: 0 } };
    }

    try {
      const { data: station } = await stationApi.getStationDetail(
        params.stationId,
        params.companyId,
      );

      const client = createApiClient(params.companyId);
      const res = await client.get<RawDrySpellReportResponse>("/dry_spell", {
        params: {
          device_id: station.id,
          start_date: params.dateFrom,
          end_date: params.dateTo,
        },
      });

      if (!res.data.status) {
        throw new ApiError(
          "DRY_SPELL_REPORT_FETCH_FAILED",
          res.data.message || "Gagal mengambil data deret hari tidak hujan dari server.",
        );
      }

      const data = res.data.data.map((raw) => mapRawDrySpellReport(raw, station.id));
      return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
    } catch (err) {
      if (err instanceof ApiError) throw err;

      // Rentang tanpa periode dibalas BE dengan HTTP 404 "No such … found."
      // (pola sama `sunshine-duration-client.ts`/`vpd-client.ts`), bukan 200
      // `data: []` — itu "kosong", bukan error. Teks pesannya untuk endpoint
      // ini BELUM terkonfirmasi persis, jadi cukup cek status 404. Aman
      // dibedakan dari device_id salah/bukan milik company karena
      // `getStationDetail()` di atas sudah melempar sendiri untuk kasus itu.
      if (isAxiosError(err) && err.response?.status === 404) {
        return { data: [], meta: { page: 1, pageSize: 0, total: 0 } };
      }

      throw new ApiError(
        "DRY_SPELL_REPORT_FETCH_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server deret hari tidak hujan.",
      );
    }
  },
};
