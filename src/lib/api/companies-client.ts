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

/** SEMENTARA: kontrak BE untuk tambah/ubah/hapus perusahaan belum ada, jadi
 *  mutasi dimock in-memory sebagai OVERLAY di atas hasil `GET /companies`
 *  yang tetap real (pola sama `TEMP_USE_MOCK_AGHRIS`). Set `false` HANYA
 *  setelah cabang real di bawah diimplementasi. Overlay hilang saat server
 *  restart. */
const TEMP_USE_MOCK_COMPANIES = true;

const NOT_IMPLEMENTED = new ApiError(
  "COMPANY_NOT_IMPLEMENTED",
  "Endpoint tambah/ubah/hapus perusahaan belum tersedia.",
);

let mockCreated: Company[] = [];
const mockUpdated = new Map<number, Company>();
const mockDeleted = new Set<number>();
// Jauh di atas ID asli supaya tidak bentrok.
let nextMockId = 900001;

async function fetchRealCompanies(): Promise<Company[]> {
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
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "COMPANY_FETCH_FAILED",
      extractBackendErrorMessage(err) ??
        "Gagal terhubung ke server. Periksa koneksi internet.",
    );
  }
}

export const companiesClient: CompaniesApi = {
  async getCompanies(): Promise<ApiListResponse<Company>> {
    const real = await fetchRealCompanies();
    const companies = TEMP_USE_MOCK_COMPANIES
      ? [
          ...mockCreated,
          ...real
            .filter((c) => !mockDeleted.has(c.id))
            .map((c) => mockUpdated.get(c.id) ?? c),
        ]
      : real;
    return {
      data: companies,
      meta: { page: 1, pageSize: companies.length, total: companies.length },
    };
  },

  async createCompany(input: CreateCompanyInput): Promise<ApiItemResponse<Company>> {
    if (!TEMP_USE_MOCK_COMPANIES) throw NOT_IMPLEMENTED;
    const created: Company = {
      id: nextMockId++,
      name: input.name,
      code: input.code,
      imageUrl: null,
    };
    mockCreated = [created, ...mockCreated];
    return { data: created };
  },

  async updateCompany(input: UpdateCompanyInput): Promise<ApiItemResponse<Company>> {
    if (!TEMP_USE_MOCK_COMPANIES) throw NOT_IMPLEMENTED;
    const created = mockCreated.find((c) => c.id === input.id);
    const existing =
      created ?? (await fetchRealCompanies()).find((c) => c.id === input.id);
    if (!existing) {
      throw new ApiError("COMPANY_NOT_FOUND", "Perusahaan tidak ditemukan.");
    }
    const updated: Company = { ...existing, name: input.name, code: input.code };
    if (created) {
      mockCreated = mockCreated.map((c) => (c.id === input.id ? updated : c));
    } else {
      mockUpdated.set(input.id, updated);
    }
    return { data: updated };
  },

  async deleteCompany(id: number): Promise<void> {
    if (!TEMP_USE_MOCK_COMPANIES) throw NOT_IMPLEMENTED;
    if (mockCreated.some((c) => c.id === id)) {
      mockCreated = mockCreated.filter((c) => c.id !== id);
      return;
    }
    mockDeleted.add(id);
  },
};
