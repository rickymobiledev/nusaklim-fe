import { ApiError } from "@/types/api";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "@/types/user-management";
import { createApiClient } from "./fetcher";
import { mapRawCompany, type RawCompany } from "./adapters/user-management-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { CompaniesApi } from "./companies-api";

/** `GET /companies` — daftar SEMUA company (dipakai dropdown "Perusahaan"
 *  di form Tambah/Edit Pengguna DAN halaman Manajemen > Perusahaan), tidak
 *  company-scoped. */
const client = createApiClient();

interface Envelope {
  status: boolean;
  message: string;
}

function toApiError(err: unknown, code: string): ApiError {
  if (err instanceof ApiError) return err;
  return new ApiError(
    code,
    extractBackendErrorMessage(err) ??
      "Gagal terhubung ke server. Periksa koneksi internet.",
  );
}

function assertOk(body: Envelope, code: string, fallback: string) {
  if (!body.status) throw new ApiError(code, body.message || fallback);
}

export async function fetchRealCompanies(): Promise<Company[]> {
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

    return res.data.data.map(mapRawCompany);
  } catch (err) {
    throw toApiError(err, "COMPANY_FETCH_FAILED");
  }
}

export const companiesClient: CompaniesApi = {
  async getCompanies(): Promise<ApiListResponse<Company>> {
    const companies = await fetchRealCompanies();
    return {
      data: companies,
      meta: { page: 1, pageSize: companies.length, total: companies.length },
    };
  },

  /** `POST /companies` — multipart: code, name, image (file). */
  async createCompany(input: CreateCompanyInput): Promise<ApiItemResponse<Company>> {
    const form = new FormData();
    form.append("code", input.code);
    form.append("name", input.name);
    form.append("image", input.image, input.image.name);

    try {
      const res = await client.post<Envelope>("/companies", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      assertOk(res.data, "COMPANY_CREATE_FAILED", "Gagal menambah perusahaan.");
    } catch (err) {
      throw toApiError(err, "COMPANY_CREATE_FAILED");
    }

    // Bentuk respons mutasi BE tidak diandalkan — ambil ulang dari GET.
    const saved = (await fetchRealCompanies()).find((c) => c.code === input.code);
    if (!saved) {
      throw new ApiError("COMPANY_CREATE_FAILED", "Gagal menambah perusahaan.");
    }
    return { data: saved };
  },

  /** `PUT /companies` — multipart: id (integer), name, image (file, opsional). */
  async updateCompany(input: UpdateCompanyInput): Promise<ApiItemResponse<Company>> {
    const form = new FormData();
    form.append("id", String(input.id));
    form.append("name", input.name);
    if (input.image) form.append("image", input.image, input.image.name);

    try {
      const res = await client.put<Envelope>("/companies", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      assertOk(res.data, "COMPANY_UPDATE_FAILED", "Gagal mengubah perusahaan.");
    } catch (err) {
      throw toApiError(err, "COMPANY_UPDATE_FAILED");
    }

    const saved = (await fetchRealCompanies()).find((c) => c.id === input.id);
    if (!saved) {
      throw new ApiError("COMPANY_UPDATE_FAILED", "Gagal mengubah perusahaan.");
    }
    return { data: saved };
  },

  /** `DELETE /companies` — x-www-form-urlencoded: id. */
  async deleteCompany(id: number): Promise<void> {
    try {
      const res = await client.delete<Envelope>("/companies", {
        data: new URLSearchParams({ id: String(id) }).toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      assertOk(res.data, "COMPANY_DELETE_FAILED", "Gagal menghapus perusahaan.");
    } catch (err) {
      throw toApiError(err, "COMPANY_DELETE_FAILED");
    }
  },
};
