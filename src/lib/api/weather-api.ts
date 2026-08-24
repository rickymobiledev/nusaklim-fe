import type { ApiItemResponse } from "@/types/api";
import type { WeatherMetric } from "@/types/domain";

export interface WeatherApi {
  /** `companyId` (dari `resolveCompanyId()`, `lib/api/route-guard.ts`) —
   *  kalau diisi, implementasi HARUS tolak akses ke stasiun company lain
   *  (throw `STATION_NOT_FOUND`), sama seperti `StationApi.getStationDetail`. */
  getWeatherMetrics(
    stationId: string,
    companyId?: string,
  ): Promise<ApiItemResponse<WeatherMetric>>;
}
