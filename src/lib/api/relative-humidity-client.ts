import { ApiError } from "@/types/api";
import type { ApiListResponse } from "@/types/api";
import type { RelativeHumidityStationSeries } from "@/types/domain";
import { stationApi } from "./station-client";
import { fetchHumidityRange } from "./weather-daily-client";

/** Server-only, dipanggil HANYA dari `app/api/relative-humidity/daily/route.ts`
 *  — bukan domain mock/real toggle spt `lib/api/index.ts` (halaman
 *  `/relative-humidity` belum tercantum di daftar domain CLAUDE.md, jadi
 *  ini helper internal seperti `weather-daily-client.ts`, bukan `XxxApi`
 *  interface baru). Pola identik `air-pressure-client.ts`.
 *
 *  Guard company: ambil daftar stasiun milik company SEKALI lewat
 *  `stationApi.getStations({ companyId })`, filter `stationIds` yang
 *  diminta client ke stasiun yang benar-benar ketemu di situ — id yang
 *  bukan milik company (atau tidak ada) DIAM-DIAM di-drop, bukan
 *  dibocorkan "ada tapi bukan company kamu" (konsisten kebijakan
 *  `getStationDetail` di `station-client.ts`). */
export async function getHumiditySeries(
  stationIds: string[],
  startDate: Date,
  endDate: Date,
  companyId?: string,
): Promise<ApiListResponse<RelativeHumidityStationSeries>> {
  if (stationIds.length === 0) {
    return { data: [], meta: { page: 1, pageSize: 0, total: 0 } };
  }

  const { data: allStations } = await stationApi.getStations({ companyId });
  const requested = new Set(stationIds);
  const stations = allStations.filter((s) => requested.has(s.id));

  try {
    const series = await Promise.all(
      stations.map(async (station) => ({
        stationId: station.id,
        stationName: station.nama,
        points: await fetchHumidityRange(station.id, startDate, endDate, companyId),
      })),
    );

    return {
      data: series,
      meta: { page: 1, pageSize: series.length, total: series.length },
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("NETWORK_ERROR", "Gagal terhubung ke server cuaca.");
  }
}
