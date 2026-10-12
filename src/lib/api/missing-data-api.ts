import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { MissingDataImportResult, MissingDataRow } from "@/types/domain";

/** Filter + pagination SERVER-SIDE `GET /weathers/missing`. `stationId` wajib
 *  (keputusan: endpoint dipakai per stasiun); `dateFrom`/`dateTo` berformat
 *  `yyyy-MM-dd`. `companyId` HARUS dari `resolveCompanyId()`, bukan input
 *  client mentah. */
export interface MissingDataParams {
  companyId?: string;
  stationId: string;
  dateFrom: string;
  dateTo: string;
  page: number;
  pageSize: number;
}

/** Domain "Missing Data" (admin-only). `getMissingData` = SATU halaman hasil
 *  server (meta dari BE) — beda dari `DownloadApi` yang balikin semua baris.
 *  `importData` = `POST /import/aws` (formdata Excel, maks 5 MB). */
export interface MissingDataApi {
  getMissingData(params: MissingDataParams): Promise<ApiListResponse<MissingDataRow>>;
  importData(file: File): Promise<ApiItemResponse<MissingDataImportResult>>;
}
