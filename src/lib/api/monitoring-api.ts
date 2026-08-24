import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type {
  DrySpellReport,
  SunshineDuration,
  VPDReport,
  WaterBalance,
} from "@/types/domain";

/** `companyId` HARUS datang dari `resolveCompanyId()`
 * (`lib/api/route-guard.ts`) di Route Handler — jangan pernah diisi
 * langsung dari input client mentah, itu IDOR. Mock saat ini BELUM
 * validasi companyId vs stasiun (lihat komentar di mock/monitoring-api.ts). */
export interface MonitoringFilterParams {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
  companyId?: string;
}

export interface MonitoringApi {
  /** Data setahun penuh (`bulanan[]`) untuk satu stasiun — tetap 1 objek,
   *  bukan list, lihat `WaterBalance` di types/domain.ts. */
  getWaterBalance(params: MonitoringFilterParams): Promise<ApiItemResponse<WaterBalance>>;
  /** Bisa lebih dari satu periode dry-spell dalam rentang tanggal. */
  getDrySpell(params: MonitoringFilterParams): Promise<ApiListResponse<DrySpellReport>>;
  /** Satu baris per hari dalam rentang tanggal. */
  getSunshineDuration(
    params: MonitoringFilterParams,
  ): Promise<ApiListResponse<SunshineDuration>>;
  /** Satu baris per hari dalam rentang tanggal. */
  getVPD(params: MonitoringFilterParams): Promise<ApiListResponse<VPDReport>>;
}
