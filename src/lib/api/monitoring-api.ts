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

/** Params `getWaterBalance` SENGAJA punya tipe sendiri (bukan reuse
 *  `MonitoringFilterParams`) — endpoint asli `GET /water_deficit?device_id=&year=`
 *  cuma terima SATU `year` per call (bukan array/rentang tanggal), jadi
 *  banding multi-tahun di halaman Monitoring dilakukan lewat fan-out
 *  (beberapa call, satu per tahun) di Route Handler, bukan minta BE
 *  terima banyak tahun sekaligus. Terpisah dari `MonitoringFilterParams`
 *  supaya `getDrySpell`/`getSunshineDuration`/`getVPD` tidak ikut
 *  terdampak perubahan ini. */
export interface WaterBalanceFilterParams {
  stationId?: string;
  year: number;
  companyId?: string;
}

export interface MonitoringApi {
  /** Data SATU tahun penuh (`bulanan[]`) untuk satu stasiun — tetap 1
   *  objek, bukan list, lihat `WaterBalance` di types/domain.ts. Banding
   *  multi-tahun = panggil ini beberapa kali (fan-out), lihat
   *  `WaterBalanceFilterParams`. */
  getWaterBalance(
    params: WaterBalanceFilterParams,
  ): Promise<ApiItemResponse<WaterBalance>>;
  /** Bisa lebih dari satu periode dry-spell dalam rentang tanggal. */
  getDrySpell(params: MonitoringFilterParams): Promise<ApiListResponse<DrySpellReport>>;
  /** Satu baris per hari dalam rentang tanggal. */
  getSunshineDuration(
    params: MonitoringFilterParams,
  ): Promise<ApiListResponse<SunshineDuration>>;
  /** Satu baris per hari dalam rentang tanggal. */
  getVPD(params: MonitoringFilterParams): Promise<ApiListResponse<VPDReport>>;
}
