import { ApiError, type ApiListResponse } from "@/types/api";
import type { StationRainfallToday } from "@/types/domain";
import { createApiClient } from "./fetcher";
import {
  mapRawDeviceToRainfallToday,
  type RawRainfallTodayDevice,
} from "./adapters/rainfall-today-adapter";
import type { RainfallTodayApi, RainfallTodayParams } from "./rainfall-today-api";

/** Satu-satunya implementasi Curah Hujan Hari Ini (Peta > Curah Hujan
 *  Hari Ini) — pola identik `dry-spell-client.ts`: `createApiClient(companyId)`
 *  inject `company_code` otomatis, cek `res.data.status`, `ApiError`
 *  kalau gagal, TIDAK ada fallback diam-diam ke mock. BEDA dari
 *  `dry-spell-client.ts`/`water-deficit-client.ts`: TIDAK ada param
 *  tanggal/year/month dikirim (lihat `RainfallTodayParams`). TIDAK join
 *  ke `stationApi.getStations()` — `nama`/`brand`/dst sudah tersedia
 *  langsung di payload `rainfall_today`, dan `sinkronisasiTerakhir`
 *  diisi waktu-request-sekarang di adapter, sama pola & alasan persis
 *  `dry-spell-client.ts`/`water-deficit-client.ts` (mengurangi request
 *  bersamaan ke `/devices/status` — lihat `CLAUDE.md`). */
export const rainfallTodayClient: RainfallTodayApi = {
  async getStationRainfallToday(
    params: RainfallTodayParams,
  ): Promise<ApiListResponse<StationRainfallToday>> {
    try {
      const client = createApiClient(params.companyId);
      const res = await client.get<{
        status: boolean;
        message: string;
        data: RawRainfallTodayDevice[];
      }>("/devices/rainfall_today");

      if (!res.data.status) {
        throw new ApiError(
          "RAINFALL_TODAY_FETCH_FAILED",
          res.data.message || "Gagal mengambil data curah hujan hari ini dari server.",
        );
      }

      const data = res.data.data.map((raw) => mapRawDeviceToRainfallToday(raw));

      return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "NETWORK_ERROR",
        "Gagal terhubung ke server curah hujan hari ini.",
      );
    }
  },
};
