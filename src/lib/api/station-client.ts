import { ApiError } from "@/types/api";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { Station } from "@/types/domain";
import { createApiClient } from "./fetcher";
import { mapDeviceToStation, type RawDevice } from "./adapters/station-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { GetStationsParams, StationApi } from "./station-api";

/** In-flight request coalescing, keyed per `companyCode` — BUKAN cache
 *  dengan TTL (data IoT tetap "selalu fetch fresh" per komentar di bawah,
 *  tidak melanggar itu). Cuma numpang 1 network call yang SUDAH BERJALAN
 *  kalau ada caller lain minta data yang identik DI SAAT YANG SAMA,
 *  bukan menyimpan hasil lama.
 *
 *  Alasan: `GET /devices/status` di backend TERBUKTI tidak menangani
 *  request BERSAMAAN dengan baik — 1 request sendirian ~4-4.5s, tapi 4
 *  request BERSAMAAN ke endpoint identik jadi ~10-11s MASING-MASING
 *  (dikonfirmasi lewat testing curl manual, reproducible total di luar
 *  app ini — bukan bug di kode kita, karakteristik backend). Tab `/map`
 *  MEMANG manggil `stationApi.getStations()` 4x nyaris bersamaan (1x
 *  langsung dari `useStations()`, 3x lagi sebagai join
 *  `sinkronisasiTerakhir` di `water-deficit-client.ts`,
 *  `dry-spell-client.ts`, `mock/water-deficit-comparison-api.ts`) —
 *  dedup ini menyusutkannya jadi 1 network call asli. Lihat
 *  `docs/ARCHITECTURE.md`/`CLAUDE.md` untuk detail diagnosisnya. */
const inFlightFetchDevices = new Map<string, Promise<Station[]>>();

/** `/devices/status` tidak punya endpoint summary terpisah — total/aktif/
 *  tidak aktif dihitung dari list device yang sama. Tidak ada pagination
 *  di sisi BE juga (satu response berisi semua device), jadi
 *  page/pageSize/status difilter di memori di sini. Selalu fetch fresh —
 *  tidak ada cache DENGAN TTL di sini (data IoT harus selalu up-to-date)
 *  — tapi request yang BERTEPATAN persis di saat yang sama di-dedup,
 *  lihat `inFlightFetchDevices` di atas. */
async function fetchDevices(companyCode?: string): Promise<Station[]> {
  const cacheKey = companyCode ?? "__all__";
  const existing = inFlightFetchDevices.get(cacheKey);
  if (existing) return existing;

  const promise = (async () => {
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
      return companyCode
        ? stations.filter((s) => s.companyCode === companyCode)
        : stations;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "STATION_FETCH_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    } finally {
      inFlightFetchDevices.delete(cacheKey);
    }
  })();

  inFlightFetchDevices.set(cacheKey, promise);
  return promise;
}

/** Satu-satunya implementasi Stasiun — dipakai `lib/api/index.ts` (sebagai
 *  `stationApi`) DAN sebagai sumber lookup stasiun untuk domain lain
 *  (`weather-client.ts`, lihat pemakaian `getStationDetail` di sana) —
 *  supaya tidak ada 2 sumber data stasiun yang beda. `forecast-client.ts`
 *  SENGAJA TIDAK ikut memanggil `getStationDetail` (lihat catatan di
 *  file itu & CLAUDE.md bagian "companyId (multi-tenant)"). */
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
