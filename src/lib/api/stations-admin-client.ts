import { ApiError } from "@/types/api";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { Station } from "@/types/domain";
import type { CreateStationInput, UpdateStationInput } from "@/types/user-management";
import { companiesClient } from "./companies-client";
import { stationApi } from "./station-client";
import type { StationsAdminApi } from "./stations-admin-api";

/** SEMENTARA: kontrak BE untuk tambah/ubah/hapus stasiun belum ada, jadi
 *  mutasi dimock in-memory sebagai OVERLAY di atas hasil
 *  `GET /devices/status` yang tetap real (pola sama `TEMP_USE_MOCK_COMPANIES`).
 *  Set `false` HANYA setelah cabang real diimplementasi. Overlay hilang saat
 *  server restart. */
const TEMP_USE_MOCK_STATIONS = true;

const NOT_IMPLEMENTED = new ApiError(
  "STATION_NOT_IMPLEMENTED",
  "Endpoint tambah/ubah/hapus stasiun belum tersedia.",
);

let mockCreated: Station[] = [];
const mockUpdated = new Map<string, Station>();
const mockDeleted = new Set<string>();

async function fetchRealStations(): Promise<Station[]> {
  // Tanpa page/pageSize → balikin SEMUA stasiun (lihat station-client.ts).
  const res = await stationApi.getStations();
  return res.data;
}

async function resolveCompanyName(code: string): Promise<string> {
  const companies = await companiesClient.getCompanies();
  return companies.data.find((c) => c.code === code)?.name ?? code;
}

export const stationsAdminClient: StationsAdminApi = {
  async getStations(): Promise<ApiListResponse<Station>> {
    const real = await fetchRealStations();
    const stations = TEMP_USE_MOCK_STATIONS
      ? [
          ...mockCreated,
          ...real
            .filter((s) => !mockDeleted.has(s.id))
            .map((s) => mockUpdated.get(s.id) ?? s),
        ]
      : real;
    return {
      data: stations,
      meta: { page: 1, pageSize: stations.length, total: stations.length },
    };
  },

  async createStation(input: CreateStationInput): Promise<ApiItemResponse<Station>> {
    if (!TEMP_USE_MOCK_STATIONS) throw NOT_IMPLEMENTED;
    const existing = await stationsAdminClient.getStations();
    if (existing.data.some((s) => s.id === input.id)) {
      throw new ApiError("STATION_ID_EXISTS", "ID stasiun sudah digunakan.");
    }
    const created: Station = {
      id: input.id,
      nama: input.name,
      brand: input.brand,
      companyCode: input.companyCode,
      companyName: await resolveCompanyName(input.companyCode),
      lat: input.latitude,
      long: input.longitude,
      status: "off",
      sinkronisasiTerakhir: null,
    };
    mockCreated = [created, ...mockCreated];
    return { data: created };
  },

  async updateStation(input: UpdateStationInput): Promise<ApiItemResponse<Station>> {
    if (!TEMP_USE_MOCK_STATIONS) throw NOT_IMPLEMENTED;
    const created = mockCreated.find((s) => s.id === input.id);
    const existing =
      created ?? (await fetchRealStations()).find((s) => s.id === input.id);
    if (!existing) {
      throw new ApiError("STATION_NOT_FOUND", "Stasiun tidak ditemukan.");
    }
    const updated: Station = {
      ...existing,
      nama: input.name,
      brand: input.brand,
      companyCode: input.companyCode,
      companyName: await resolveCompanyName(input.companyCode),
      lat: input.latitude,
      long: input.longitude,
    };
    if (created) {
      mockCreated = mockCreated.map((s) => (s.id === input.id ? updated : s));
    } else {
      mockUpdated.set(input.id, updated);
    }
    return { data: updated };
  },

  async deleteStation(id: string): Promise<void> {
    if (!TEMP_USE_MOCK_STATIONS) throw NOT_IMPLEMENTED;
    if (mockCreated.some((s) => s.id === id)) {
      mockCreated = mockCreated.filter((s) => s.id !== id);
      return;
    }
    mockDeleted.add(id);
  },
};
