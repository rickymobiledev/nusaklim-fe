import { ApiError, type ApiListResponse } from "@/types/api";
import type { StationWaterDeficit } from "@/types/domain";
import { createApiClient } from "./fetcher";
import { stationApi } from "./station-client";
import {
  mapRawDeviceToWaterDeficit,
  type RawWaterDeficitDevice,
} from "./adapters/water-deficit-adapter";
import type { WaterDeficitApi, WaterDeficitParams } from "./water-deficit-api";

/** Satu-satunya implementasi Water Deficit (Peta > Keseimbangan Air) —
 *  pola identik `station-client.ts`: `createApiClient(companyId)` inject
 *  `company_code` otomatis, cek `res.data.status`, `ApiError` kalau
 *  gagal, TIDAK ada fallback diam-diam ke mock. `sinkronisasiTerakhir`
 *  tidak ada di payload `/devices/water_deficit` asli, jadi di-join dari
 *  `stationApi.getStations()` (real, sudah ada) lewat `Map` per id. */
export const waterDeficitClient: WaterDeficitApi = {
  async getStationWaterDeficit(
    params: WaterDeficitParams,
  ): Promise<ApiListResponse<StationWaterDeficit>> {
    try {
      const client = createApiClient(params.companyId);
      const [res, stationsResponse] = await Promise.all([
        client.get<{
          status: boolean;
          message: string;
          data: RawWaterDeficitDevice[];
        }>("/devices/water_deficit", {
          params: { year: params.year, month: params.month },
        }),
        stationApi.getStations({ companyId: params.companyId }),
      ]);


      if (!res.data.status) {
        throw new ApiError(
          "WATER_DEFICIT_FETCH_FAILED",
          res.data.message || "Gagal mengambil data defisit air dari server.",
        );
      }

      const sinkronisasiByStationId = new Map(
        stationsResponse.data.map((s) => [s.id, s.sinkronisasiTerakhir]),
      );

      const data = res.data.data.map((raw) =>
        mapRawDeviceToWaterDeficit(raw, sinkronisasiByStationId.get(raw.id) ?? null),
      );

      return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError("NETWORK_ERROR", "Gagal terhubung ke server defisit air.");
    }
  },
};
