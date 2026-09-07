import type { ApiListResponse } from "@/types/api";
import type { StationDrySpell } from "@/types/domain";

/** `companyId` di sini HARUS datang dari `resolveCompanyId()`
 * (`lib/api/route-guard.ts`) di Route Handler — jangan pernah diisi
 * langsung dari input client mentah (query string dsb), itu IDOR.
 * `year` WAJIB di endpoint asli (`GET
 * /devices/dry_spell?company_code=&year=`, dikonfirmasi user lewat contoh
 * response langsung) — Route Handler yang isi default (tahun berjalan,
 * lihat `getDefaultDrySpellYear`) selama belum ada UI pemilih tahun di
 * tab ini. BEDA dari `WaterDeficitParams`: tidak ada `month` — endpoint
 * ini agregat SETAHUN penuh, bukan snapshot 1 bulan. */
export interface DrySpellParams {
  companyId?: string;
  year: number;
}

/** Default tahun kalau client tidak kirim `year` eksplisit — tahun
 *  BERJALAN (`new Date().getFullYear()`), BEDA dari
 *  `getDefaultWaterDeficitPeriod` yang sengaja mundur ke bulan lalu
 *  (agregat bulanan Water Deficit baru lengkap setelah bulan itu
 *  selesai). Dry Spell agregat SETAHUN, tidak ada indikasi masalah
 *  "belum lengkap" serupa untuk tahun berjalan. */
export function getDefaultDrySpellYear(): number {
  return new Date().getFullYear();
}

export interface DrySpellApi {
  /** Agregat SATU TAHUN (`year`) company-wide (semua stasiun sekaligus) —
   *  tiap stasiun dipetakan ke periode kekeringan TERPANJANG tahun itu,
   *  lihat catatan di `types/domain.ts` (`StationDrySpell`). */
  getStationDrySpell(params: DrySpellParams): Promise<ApiListResponse<StationDrySpell>>;
}
