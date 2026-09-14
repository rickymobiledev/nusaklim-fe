import type { ApiListResponse, PaginationParams } from "@/types/api";
import type { DataGranularity, DownloadDataRow } from "@/types/domain";

/** `companyId` HARUS datang dari `resolveCompanyId()`
 * (`lib/api/route-guard.ts`) di Route Handler — jangan pernah diisi
 * langsung dari input client mentah, itu IDOR. Divalidasi via
 * `stationApi.getStationDetail()` di `download-client.ts` (real). */
export interface GetDownloadDataParams extends PaginationParams {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
  granularity: DataGranularity;
  companyId?: string;
}

export interface DownloadApi {
  getDownloadData(
    params: GetDownloadDataParams,
  ): Promise<ApiListResponse<DownloadDataRow>>;
}
