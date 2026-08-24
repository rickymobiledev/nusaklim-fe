import { ApiError, type ApiItemResponse, type ApiListResponse } from "@/types/api";
import type { Station, StationSummary } from "@/types/domain";
import type { GetStationsParams, StationApi } from "../station-api";
import { delay } from "./delay";

// companyCode diselaraskan dengan MOCK_USERS (lib/api/mock/auth.ts) supaya
// skenario multi-tenant (resolveCompanyId) kelihatan bedanya per role:
// RPN=Administrator, SUMSEL=Researcher, ANPER=Viewer Anper. Company
// HOLDING (Viewer Holding) sengaja tidak punya stasiun sama sekali.
const STATIONS: Station[] = [
  {
    id: "st-1",
    nama: "PPKS Bukit Sentang",
    brand: "Davis Instruments",
    companyCode: "RPN",
    companyName: "PT Riset Perkebunan Nusantara",
    lat: -3.05,
    long: 104.7,
    status: "on",
    sinkronisasiTerakhir: "2026-08-19T06:00:00Z",
  },
  {
    id: "st-2",
    nama: "PPKS Jawa Timur",
    brand: "Meteo Nusantara Instrumen",
    companyCode: "SUMSEL",
    companyName: "PPKS Sumatera Selatan",
    lat: -7.9,
    long: 112.6,
    status: "off",
    sinkronisasiTerakhir: null,
  },
  {
    id: "st-3",
    nama: "N1 Cot Girek",
    brand: "Merapi Tani Instrumen",
    companyCode: "ANPER",
    companyName: "PT Anak Perusahaan Perkebunan",
    lat: 4.92942,
    long: 97.3539,
    status: "on",
    sinkronisasiTerakhir: "2026-08-19T05:30:00Z",
  },
];

export const mockStationApi: StationApi = {
  async getStations(params: GetStationsParams = {}): Promise<ApiListResponse<Station>> {
    await delay();

    const filtered = STATIONS.filter(
      (s) =>
        (!params.status || s.status === params.status) &&
        (!params.companyId || s.companyCode === params.companyId),
    );

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, meta: { page, pageSize, total: filtered.length } };
  },

  async getStationDetail(
    id: string,
    companyId?: string,
  ): Promise<ApiItemResponse<Station>> {
    await delay();

    const station = STATIONS.find((s) => s.id === id);
    // 404-style buat dua kasus (tidak ada / ada tapi beda company) —
    // jangan bocorkan ke client bahwa stasiunnya sebenarnya ada.
    if (!station || (companyId && station.companyCode !== companyId)) {
      throw new ApiError(
        "STATION_NOT_FOUND",
        `Stasiun dengan id "${id}" tidak ditemukan.`,
      );
    }

    return { data: station };
  },

  async getStationSummary(): Promise<ApiItemResponse<StationSummary>> {
    await delay();

    // Ringkasan mewakili total armada stasiun sesungguhnya (lebih banyak
    // dari 3 stasiun contoh di atas yang punya detail lengkap).
    return {
      data: { totalStasiun: 5, stasiunAktif: 4, stasiunTidakAktif: 1 },
    };
  },
};
