import type { ApiItemResponse } from "@/types/api";
import type { ForecastResult } from "@/types/ramalan-cuaca";

/**
 * Kontrak BE asli (referensi, lihat Postman "Nusaklim" > Forecast > Get
 * Weather Forecast): POST /api/v2/forecast, body form station_id, balikan
 * snake_case dibungkus { status, data }. Implementasi REAL (belum dibuat)
 * yang transform bentuk itu ke ForecastResult camelCase harus taruh
 * mapping-nya di sini, bukan di hook/komponen. Catatan tambahan: response
 * asli kadang tidak menyertakan field "units" — implementasi real harus
 * fallback ke `{}` (bukan asumsikan field itu selalu ada) sebelum
 * dibungkus jadi ForecastResult.
 */
export interface RamalanCuacaApi {
  /** `companyId` (dari `resolveCompanyId()`, `lib/api/route-guard.ts`) —
   *  kalau diisi, implementasi HARUS tolak akses ke stasiun company lain
   *  (throw `STATION_NOT_FOUND`), sama seperti `StationApi.getStationDetail`. */
  getForecast(
    stationId: string,
    companyId?: string,
  ): Promise<ApiItemResponse<ForecastResult>>;
}
