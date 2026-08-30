import type { ApiItemResponse, ApiListResponse, PaginationParams } from "@/types/api";
import type { Station, StationStatus } from "@/types/domain";

/** `companyId` di sini HARUS datang dari `resolveCompanyId()`
 * (`lib/api/route-guard.ts`) di Route Handler — jangan pernah diisi
 * langsung dari input client mentah (query string dsb), itu IDOR.
 * `undefined` = tanpa filter company (cuma valid utk role
 * ADMINISTRATOR/RESEARCHER, lihat `resolveCompanyId`). */
export interface GetStationsParams extends PaginationParams {
  companyId?: string;
  status?: StationStatus;
}

export interface StationApi {
  getStations(params?: GetStationsParams): Promise<ApiListResponse<Station>>;
  /** `companyId` (dari `resolveCompanyId()`) dipakai buat menolak akses ke
   *  stasiun company lain — kalau diisi & stasiun ketemu tapi beda
   *  company, implementasi HARUS throw `STATION_NOT_FOUND` (bukan
   *  bocorkan bahwa stasiunnya ada tapi bukan milik company kamu). */
  getStationDetail(id: string, companyId?: string): Promise<ApiItemResponse<Station>>;
}
