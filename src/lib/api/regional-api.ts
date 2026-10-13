import type { ApiListResponse } from "@/types/api";
import type { Station } from "@/types/domain";
import type { Company } from "@/types/user-management";

/** Dua sumber data filter "Regional" → "Stasiun" (halaman Unduh Data).
 *  `companyCode` HARUS datang dari `resolveCompanyId()`
 *  (`lib/api/route-guard.ts`) di Route Handler, bukan input client mentah. */
export interface RegionalApi {
  /** `GET /companies` murni dari BE (tanpa overlay mock Manajemen
   *  Perusahaan), opsional dibatasi ke satu `companyCode`. */
  getCompanies(companyCode?: string): Promise<ApiListResponse<Company>>;
  /** `GET /devices?company_code=` — stasiun milik satu regional. */
  getStationsByCompany(companyCode: string): Promise<ApiListResponse<Station>>;
}
