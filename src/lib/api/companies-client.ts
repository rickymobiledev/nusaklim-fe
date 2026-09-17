import { ApiError } from "@/types/api";
import type { ApiListResponse } from "@/types/api";
import type { Company } from "@/types/user-management";
import { createApiClient } from "./fetcher";
import { mapRawCompany, type RawCompany } from "./adapters/user-management-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { CompaniesApi } from "./companies-api";

/** `GET /companies` — daftar SEMUA company (dipakai dropdown "Perusahaan"
 *  di form Tambah/Edit Pengguna), tidak company-scoped. */
const client = createApiClient();

export const companiesClient: CompaniesApi = {
  async getCompanies(): Promise<ApiListResponse<Company>> {
    try {
      const res = await client.get<{
        status: boolean;
        message: string;
        data: RawCompany[];
      }>("/companies");

      if (!res.data.status) {
        throw new ApiError(
          "COMPANY_FETCH_FAILED",
          res.data.message || "Gagal mengambil data perusahaan dari server.",
        );
      }

      const companies = res.data.data.map(mapRawCompany);
      return {
        data: companies,
        meta: { page: 1, pageSize: companies.length, total: companies.length },
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "COMPANY_FETCH_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    }
  },
};
