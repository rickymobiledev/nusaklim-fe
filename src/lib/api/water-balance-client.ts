import { ApiError, type ApiItemResponse } from "@/types/api";
import { MONTH_ORDER, type WaterBalance, type WaterBalanceMonth } from "@/types/domain";
import { createApiClient } from "./fetcher";
import { stationApi } from "./station-client";
import {
  mapRawWaterBalance,
  type RawWaterBalanceResponse,
} from "./adapters/water-balance-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { WaterBalanceFilterParams } from "./monitoring-api";

function emptyMonths(): WaterBalanceMonth[] {
  return MONTH_ORDER.map((month) => ({
    month,
    rainfall: null,
    waterDeficit: null,
    rainyDays: null,
    waterSurplus: null,
  }));
}

/** Satu-satunya implementasi asli Keseimbangan Air halaman Monitoring
 *  (BUKAN tab Peta > Keseimbangan Air yang endpointnya beda, lihat
 *  komentar `WaterBalance` vs `StationWaterDeficit` di types/domain.ts).
 *  Endpoint `GET /water_deficit?device_id=&year=` dikonfirmasi lewat tes
 *  langsung ke backend asli (curl) — bentuk mentahnya lihat
 *  `water-balance-adapter.ts`.
 *
 *  `stationApi.getStationDetail()` dipanggil DULU sebagai guard company
 *  (pola sama `weather-client.ts`) — endpoint ini sendiri pakai
 *  `device_id` mentah, BUKAN `company_code`, jadi tanpa guard ini role
 *  `VIEWER_*` bisa IDOR-request `stationId` company lain lewat query
 *  string. */
export const waterBalanceClient = {
  async getWaterBalance(
    params: WaterBalanceFilterParams,
  ): Promise<ApiItemResponse<WaterBalance>> {
    if (!params.stationId) {
      return { data: { stationId: "", year: params.year, months: emptyMonths() } };
    }

    try {
      const { data: station } = await stationApi.getStationDetail(
        params.stationId,
        params.companyId,
      );

      const client = createApiClient(params.companyId);
      const res = await client.get<RawWaterBalanceResponse>("/water_deficit", {
        params: { device_id: station.id, year: params.year },
      });

      if (!res.data.status) {
        throw new ApiError(
          "WATER_BALANCE_FETCH_FAILED",
          res.data.message || "Gagal mengambil data keseimbangan air dari server.",
        );
      }

      return { data: mapRawWaterBalance(res.data.data, station.id, params.year) };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "WATER_BALANCE_FETCH_FAILED",
        extractBackendErrorMessage(err) ?? "Gagal terhubung ke server keseimbangan air.",
      );
    }
  },
};
