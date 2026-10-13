import { ApiError } from "@/types/api";
import type { ApiListResponse } from "@/types/api";
import type { Station } from "@/types/domain";
import type { Company } from "@/types/user-management";
import { createApiClient } from "./fetcher";
import { fetchRealCompanies } from "./companies-client";
import { mapAdminDeviceToStation, type RawAdminDevice } from "./adapters/station-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { RegionalApi } from "./regional-api";

function toList<T>(data: T[]): ApiListResponse<T> {
  return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
}

/** Filter "Regional" + "Stasiun" halaman Unduh Data. Stasiun diambil dari
 *  `GET /devices?company_code=` (bukan `/devices/status` seperti
 *  `stationApi`) — `createApiClient(companyCode)` yang meng-inject
 *  `company_code`. Tidak ada fallback mock: gagal → `ApiError`. */
export const regionalClient: RegionalApi = {
  async getCompanies(companyCode?: string): Promise<ApiListResponse<Company>> {
    const companies = await fetchRealCompanies();
    return toList(
      companyCode ? companies.filter((c) => c.code === companyCode) : companies,
    );
  },

  async getStationsByCompany(companyCode: string): Promise<ApiListResponse<Station>> {
    try {
      const res = await createApiClient(companyCode).get<{
        status: boolean;
        message: string;
        data: RawAdminDevice[];
      }>("/devices");

      if (!res.data.status) {
        throw new ApiError(
          "STATION_FETCH_FAILED",
          res.data.message || "Gagal mengambil data stasiun dari server.",
        );
      }

      // Defense-in-depth: jangan cuma percaya BE sudah memfilter company_code.
      return toList(
        res.data.data
          .filter((d) => d.company_code === companyCode)
          .map(mapAdminDeviceToStation),
      );
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "STATION_FETCH_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    }
  },
};
