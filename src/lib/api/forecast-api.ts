import type { ApiItemResponse } from "@/types/api";
import type { ForecastResult } from "@/types/forecast";

/**
 * Kontrak BE asli, dikonfirmasi lewat curl langsung ke backend asli (bukan
 * cuma Postman): POST /api/v2/forecast, body form station_id, balikan
 * snake_case dibungkus { status, data }. Implementasi real ada di
 * `forecast-client.ts` (`forecastClient`), mapping snake_case →
 * camelCase di `adapters/forecast-adapter.ts` — response asli kadang
 * tidak menyertakan field "units" sama sekali, adapter fallback ke `{}`
 * (bukan asumsikan field itu selalu ada).
 */
export interface ForecastApi {
  /** `companyId` (dari `resolveCompanyId()`, `lib/api/route-guard.ts`) cuma
   *  diteruskan sbg `company_code` query param (`createApiClient()`) —
   *  BEDA dari kontrak `companyId` di domain real lain (mis.
   *  `StationApi.getStationDetail`), implementasi `forecast-client.ts`
   *  SENGAJA TIDAK guard company boundary utk `stationId` (keputusan
   *  eksplisit user, lihat komentar di file itu & CLAUDE.md bagian
   *  "companyId (multi-tenant)" — konsekuensinya berpotensi IDOR kalau BE
   *  sendiri tidak menolak `station_id` company lain). */
  getForecast(
    stationId: string,
    companyId?: string,
  ): Promise<ApiItemResponse<ForecastResult>>;
}
