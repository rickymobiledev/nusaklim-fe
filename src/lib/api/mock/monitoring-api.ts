import { ApiError, type ApiItemResponse, type ApiListResponse } from "@/types/api";
import {
  MONTH_ORDER,
  type DrySpellReport,
  type SunshineDuration,
  type VPDReport,
  type WaterBalance,
  type WaterBalanceMonth,
} from "@/types/domain";
import type {
  MonitoringApi,
  MonitoringFilterParams,
  WaterBalanceFilterParams,
} from "../monitoring-api";
import { deriveVpdKategori } from "@/lib/vpd-level";
import { delay } from "./delay";

/** ID contoh buat simulasi skenario error yang realistis: query data
 *  monitoring untuk stasiun yang sedang tidak aktif. Ini ID contoh
 *  generik (bukan ID stasiun asli manapun), cuma dipakai internal di
 *  sini untuk trigger `assertStationActive` di bawah. */
const INACTIVE_STATION_ID = "st-2";

// TODO: belum validasi companyId (params.companyId) vs company stasiun
// (params.stationId) di sini — mock ini tidak melakukan lookup stasiun
// sama sekali hari ini, beda dari weather-client.ts yang sudah reuse
// stationApi.getStationDetail (lib/api/station-client.ts) untuk guard
// cross-company (forecast-client.ts SENGAJA TIDAK ikut, lihat catatan
// di file itu). Konsisten dengan pola "signature siap belum diisi" di
// download-api.ts — isi begitu ada kebutuhan nyata.

function assertStationActive(params: MonitoringFilterParams) {
  if (params.stationId === INACTIVE_STATION_ID) {
    throw new ApiError(
      "STATION_INACTIVE",
      "Stasiun sedang tidak aktif, data monitoring tidak tersedia.",
    );
  }
}

/** Hash string -> pecahan stabil [0,1) — supaya nilai mock per
 *  stasiun+tahun konsisten antar-request/reload (bukan `Math.random()`
 *  polos), pola sama seperti `seededFraction` di
 *  `water-deficit-comparison-api.ts`. */
function seededFraction(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return (hash % 1000) / 1000;
}

/** Generate 12 baris bulanan dengan kurva musiman kasar (basah di
 *  pertengahan tahun, kering di awal/akhir) + variasi per stasiun+tahun
 *  dari `seededFraction`, supaya chart banding multi-tahun kelihatan
 *  beda antar garis — REFERENSI kontrak (bentuk pivot
 *  `GET /water_deficit`), bukan data asli. */
function generateWaterBalanceMonths(
  stationId: string,
  year: number,
): WaterBalanceMonth[] {
  return MONTH_ORDER.map((month, monthIndex) => {
    const fraction = seededFraction(`${stationId}-${year}-${month}`);
    // 0 di awal/akhir tahun (kering), 1 di pertengahan (basah).
    const musim = (1 - Math.cos((monthIndex / 11) * Math.PI * 2)) / 2;

    const rainfall = Math.round((40 + musim * 260 + fraction * 60) * 10) / 10;
    const waterDeficit = Math.round(Math.max(0, (1 - musim) * 200 + fraction * 40 - 40));
    const rainyDays = Math.round(2 + musim * 14 + fraction * 3);
    const waterSurplus = waterDeficit === 0 ? Math.round(fraction * 15) : 0;

    return { month, rainfall, waterDeficit, rainyDays, waterSurplus };
  });
}

/** Nilai contoh mengikuti pola `GET /dry_spell` asli — beberapa periode
 *  dry-spell dalam satu rentang tanggal. */
const MOCK_DRY_SPELL_ROWS: Omit<DrySpellReport, "stasiun">[] = [
  {
    tanggal: "2026-07-21",
    totalHariKering: 18,
    tanggalMulai: "2026-07-11",
    tanggalSelesai: "2026-07-28",
  },
  {
    tanggal: "2026-08-09",
    totalHariKering: 15,
    tanggalMulai: "2026-07-30",
    tanggalSelesai: "2026-08-13",
  },
];

/** Nilai contoh mengikuti pola `GET /vpd` asli — SVP/VPD/SAFE_LIMIT per
 *  hari. `kategori` derived, lihat catatan di types/domain.ts. */
const MOCK_VPD_ROWS: Omit<VPDReport, "stasiun" | "kategori">[] = [
  {
    tanggal: "2026-08-17",
    temperaturUdara: 34.38,
    kelembabanUdara: 69,
    svp: 3921.7,
    vpd: 1.22,
    batasAman: 1.7,
  },
  {
    tanggal: "2026-08-18",
    temperaturUdara: 33.1,
    kelembabanUdara: 70,
    svp: 2987.7,
    vpd: 0.9,
    batasAman: 1.7,
  },
  {
    tanggal: "2026-08-19",
    temperaturUdara: 36.2,
    kelembabanUdara: 55,
    svp: 4520.1,
    vpd: 2.03,
    batasAman: 1.7,
  },
];

/** Nilai contoh mengikuti pola `GET /solar_sunshine` asli. */
const MOCK_SUNSHINE_ROWS: Omit<SunshineDuration, "stasiun">[] = [
  { tanggal: "2026-08-17", lamaPenyinaranJam: 8, batasBawahJam: 3 },
  { tanggal: "2026-08-18", lamaPenyinaranJam: 7, batasBawahJam: 3 },
  { tanggal: "2026-08-19", lamaPenyinaranJam: 5.5, batasBawahJam: 3 },
];

export const mockMonitoringApi: MonitoringApi = {
  async getWaterBalance(
    params: WaterBalanceFilterParams,
  ): Promise<ApiItemResponse<WaterBalance>> {
    await delay();
    assertStationActive(params);

    return {
      data: {
        stationId: params.stationId ?? "",
        year: params.year,
        months: generateWaterBalanceMonths(params.stationId ?? "", params.year),
      },
    };
  },

  async getDrySpell(
    params: MonitoringFilterParams,
  ): Promise<ApiListResponse<DrySpellReport>> {
    await delay();
    assertStationActive(params);

    const data: DrySpellReport[] = MOCK_DRY_SPELL_ROWS.map((row) => ({
      stasiun: params.stationId ?? "",
      ...row,
    }));
    return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
  },

  async getSunshineDuration(
    params: MonitoringFilterParams,
  ): Promise<ApiListResponse<SunshineDuration>> {
    await delay();
    assertStationActive(params);

    const data: SunshineDuration[] = MOCK_SUNSHINE_ROWS.map((row) => ({
      stasiun: params.stationId ?? "",
      ...row,
    }));
    return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
  },

  async getVPD(params: MonitoringFilterParams): Promise<ApiListResponse<VPDReport>> {
    await delay();
    assertStationActive(params);

    const data: VPDReport[] = MOCK_VPD_ROWS.map((row) => ({
      stasiun: params.stationId ?? "",
      ...row,
      kategori: deriveVpdKategori(row.vpd, row.batasAman),
    }));
    return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
  },
};
