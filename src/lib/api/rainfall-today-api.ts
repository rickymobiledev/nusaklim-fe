import type { ApiListResponse } from "@/types/api";
import type { StationRainfallToday } from "@/types/domain";

/** `companyId` di sini HARUS datang dari `resolveCompanyId()`
 * (`lib/api/route-guard.ts`) di Route Handler — jangan pernah diisi
 * langsung dari input client mentah (query string dsb), itu IDOR.
 * BEDA dari `WaterDeficitParams`/`DrySpellParams`: TIDAK ada param
 * tanggal/year/month sama sekali — endpoint asli
 * `GET /devices/rainfall_today?company_code=` cuma terima `company_code`
 * (dikonfirmasi lewat tes langsung), otomatis "hari ini" di sisi BE. */
export interface RainfallTodayParams {
  companyId?: string;
}

export interface RainfallTodayApi {
  /** Snapshot HARI INI company-wide (semua stasiun sekaligus). */
  getStationRainfallToday(
    params: RainfallTodayParams,
  ): Promise<ApiListResponse<StationRainfallToday>>;
}
