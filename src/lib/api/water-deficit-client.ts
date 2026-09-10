import { ApiError, type ApiListResponse } from "@/types/api";
import type { StationWaterDeficit } from "@/types/domain";
import { createApiClient } from "./fetcher";
import {
  mapRawDeviceToWaterDeficit,
  type RawWaterDeficitDevice,
} from "./adapters/water-deficit-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { WaterDeficitApi, WaterDeficitParams } from "./water-deficit-api";

/** Satu-satunya implementasi Water Deficit (Peta > Keseimbangan Air) —
 *  pola identik `station-client.ts`: `createApiClient(companyId)` inject
 *  `company_code` otomatis, cek `res.data.status`, `ApiError` kalau
 *  gagal, TIDAK ada fallback diam-diam ke mock. TIDAK join ke
 *  `stationApi.getStations()` (dulu iya, demi `sinkronisasiTerakhir`) —
 *  sudah dilepas, sama alasan & pola persis `dry-spell-client.ts`:
 *  `nama`/`brand`/`lat`/`long`/dst sudah ikut di payload asli, dan
 *  `sinkronisasiTerakhir` sekarang diisi waktu-request-sekarang di
 *  adapter, bukan hasil join — mengurangi request bersamaan ke
 *  `/devices/status` (lihat `CLAUDE.md`). */
export const waterDeficitClient: WaterDeficitApi = {
  async getStationWaterDeficit(
    params: WaterDeficitParams,
  ): Promise<ApiListResponse<StationWaterDeficit>> {
    try {
      const client = createApiClient(params.companyId);
      const res = await client.get<{
        status: boolean;
        message: string;
        data: RawWaterDeficitDevice[];
      }>("/devices/water_deficit", {
        params: { year: params.year, month: params.month },
      });

      if (!res.data.status) {
        throw new ApiError(
          "WATER_DEFICIT_FETCH_FAILED",
          res.data.message || "Gagal mengambil data defisit air dari server.",
        );
      }

      const data = res.data.data.map((raw) => mapRawDeviceToWaterDeficit(raw));

      return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "WATER_DEFICIT_FETCH_FAILED",
        extractBackendErrorMessage(err) ?? "Gagal terhubung ke server defisit air.",
      );
    }
  },
};
