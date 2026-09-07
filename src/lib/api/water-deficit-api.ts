import type { ApiListResponse } from "@/types/api";
import type { StationWaterDeficit } from "@/types/domain";

/** `companyId` di sini HARUS datang dari `resolveCompanyId()`
 * (`lib/api/route-guard.ts`) di Route Handler — jangan pernah diisi
 * langsung dari input client mentah (query string dsb), itu IDOR.
 * `year`/`month` WAJIB di endpoint asli (`GET
 * /devices/water_deficit?company_code=&year=&month=`, dikonfirmasi lewat
 * Postman collection BE) — Route Handler yang isi default (bulan LALU,
 * lihat `getDefaultWaterDeficitPeriod`) selama belum ada UI pemilih
 * periode di tab ini. */
export interface WaterDeficitParams {
  companyId?: string;
  year: number;
  month: number;
}

/** Default periode kalau client tidak kirim `year`/`month` eksplisit —
 *  bulan LALU (bulan penuh terakhir), BUKAN bulan berjalan. Agregat
 *  bulanan (`CURAH_HUJAN`/`DEFISIT_AIR`/dst) baru lengkap dihitung BE
 *  setelah bulan itu selesai — query ke bulan berjalan (apalagi di
 *  awal bulan) bisa balikin `water_deficit: []` untuk SEMUA device,
 *  bukan cuma yang benar-benar tidak ada datanya (dikonfirmasi lewat
 *  testing manual: bulan berjalan kosong semua, bulan lalu ada isinya).
 *  Dipakai bareng oleh `app/api/map/water-deficit/route.ts` DAN
 *  `app/api/map/water-deficit-comparison/route.ts` supaya keduanya
 *  konsisten bicara "periode" yang sama. */
export function getDefaultWaterDeficitPeriod(): { year: number; month: number } {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  if (currentMonth === 1) {
    return { year: now.getFullYear() - 1, month: 12 };
  }
  return { year: now.getFullYear(), month: currentMonth - 1 };
}

export interface WaterDeficitApi {
  /** Snapshot SATU BULAN (`year`+`month`) company-wide (semua stasiun
   *  sekaligus) — beda dari `MonitoringApi.getWaterBalance` yang
   *  per-SATU-stasiun-per-tahun-penuh, lihat catatan di `types/domain.ts`
   *  (`StationWaterDeficit`). */
  getStationWaterDeficit(
    params: WaterDeficitParams,
  ): Promise<ApiListResponse<StationWaterDeficit>>;
}
