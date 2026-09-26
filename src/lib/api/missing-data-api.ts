import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { MissingDataImportResult, MissingDataRow } from "@/types/domain";

/** Domain "Missing Data" (admin-only). `getMissingData` balikin SEMUA baris
 *  sekaligus (tanpa pagination server-side, pola `DownloadApi`) — filter
 *  stasiun/tanggal & pagination dilakukan di client. `importData` =
 *  `POST /import/aws` (formdata Excel, maks 5 MB). */
export interface MissingDataApi {
  getMissingData(params: {
    companyId?: string;
  }): Promise<ApiListResponse<MissingDataRow>>;
  importData(file: File): Promise<ApiItemResponse<MissingDataImportResult>>;
}
