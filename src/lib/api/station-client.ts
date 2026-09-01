import { ApiError } from "@/types/api";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { Station } from "@/types/domain";
import { createApiClient } from "./fetcher";
import { mapDeviceToStation, type RawDevice } from "./adapters/station-adapter";
import type { GetStationsParams, StationApi } from "./station-api";

/** `/devices/status` tidak punya endpoint summary terpisah — total/aktif/
 *  tidak aktif dihitung dari list device yang sama. Tidak ada pagination
 *  di sisi BE juga (satu response berisi semua device), jadi
 *  page/pageSize/status difilter di memori di sini. Selalu fetch fresh —
 *  tidak ada cache/dedup di sini sama sekali (data IoT harus selalu
 *  up-to-date). */
async function fetchDevices(companyCode?: string): Promise<Station[]> {
  try {
    const client = createApiClient(companyCode);
    const res = await client.get<{
      status: boolean;
      message: string;
      data: RawDevice[];
    }>("/devices/status");

    if (!res.data.status) {
      throw new ApiError(
        "STATION_FETCH_FAILED",
        res.data.message || "Gagal mengambil data stasiun dari server.",
      );
    }

    const stations = res.data.data.map(mapDeviceToStation);
    // Defense-in-depth: filter ulang berdasarkan companyCode di sisi kita
    // juga, jangan cuma percaya `company_code` query param sudah pasti
    // difilter backend.
    return companyCode ? stations.filter((s) => s.companyCode === companyCode) : stations;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "NETWORK_ERROR",
      "Gagal terhubung ke server. Periksa koneksi internet.",
    );
  }
}

/** Satu-satunya implementasi Stasiun — dipakai `lib/api/index.ts` (sebagai
 *  `stationApi`) DAN sebagai sumber lookup stasiun untuk domain lain
 *  (`weather-client.ts` yang sudah real, `mock/ramalan-cuaca-api.ts` yang
 *  masih data contoh — lihat pemakaian `getStationDetail` di sana),
 *  supaya tidak ada 2 sumber data stasiun yang beda. */
export const stationApi: StationApi = {
  async getStations(params: GetStationsParams = {}): Promise<ApiListResponse<Station>> {
    const all = await fetchDevices(params.companyId);
    const filtered = all.filter((s) => !params.status || s.status === params.status);

    if (params.page === undefined && params.pageSize === undefined) {
      // Backend tidak paginate sama sekali (selalu balikin semua device)
      // — kalau caller tidak eksplisit minta page/pageSize, jangan
      // diam-diam potong ke default 10.
      return {
        data: filtered,
        meta: { page: 1, pageSize: filtered.length, total: filtered.length },
      };
    }

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const start = (page - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      meta: { page, pageSize, total: filtered.length },
    };
  },

  async getStationDetail(
    id: string,
    companyId?: string,
  ): Promise<ApiItemResponse<Station>> {
    const all = await fetchDevices(companyId);
    console.log({all})
    const station = all.find((s) => s.id === id);

    if (!station) {
      throw new ApiError(
        "STATION_NOT_FOUND",
        `Stasiun dengan id "${id}" tidak ditemukan.`,
      );
    }

    return { data: station };
  },
};
