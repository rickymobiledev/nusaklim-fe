import { ApiError, type ApiItemResponse, type ApiListResponse } from "@/types/api";
import {
  BULAN_ORDER,
  type DrySpellReport,
  type SunshineDuration,
  type VPDReport,
  type WaterBalance,
  type WaterBalanceMonth,
} from "@/types/domain";
import type { MonitoringApi, MonitoringFilterParams } from "../monitoring-api";
import { delay } from "./delay";

/** ID contoh buat simulasi skenario error yang realistis: query data
 *  monitoring untuk stasiun yang sedang tidak aktif. Ini ID contoh
 *  generik (bukan ID stasiun asli manapun), cuma dipakai internal di
 *  sini untuk trigger `assertStationActive` di bawah. */
const INACTIVE_STATION_ID = "st-2";

// TODO: belum validasi companyId (params.companyId) vs company stasiun
// (params.stationId) di sini — mock ini tidak melakukan lookup stasiun
// sama sekali hari ini, beda dari mock/weather-api.ts &
// mock/ramalan-cuaca-api.ts yang sudah reuse stationApi.getStationDetail
// (lib/api/station-client.ts) untuk guard cross-company. Konsisten dengan
// pola "signature siap belum diisi" di download-api.ts — isi begitu ada
// kebutuhan nyata.

function assertStationActive(params: MonitoringFilterParams) {
  if (params.stationId === INACTIVE_STATION_ID) {
    throw new ApiError(
      "STATION_INACTIVE",
      "Stasiun sedang tidak aktif, data monitoring tidak tersedia.",
    );
  }
}

/** Nilai contoh mengikuti pola tabel wide `GET /water_deficit` asli (4
 *  baris per-parameter x kolom jan..dec), sudah di-pivot ke bentuk
 *  per-bulan di sini — REFERENSI kontrak, bukan wire format final. */
const MOCK_WATER_BALANCE_MONTHS: WaterBalanceMonth[] = BULAN_ORDER.map((bulan) => {
  const isiBulan = ["jun", "aug", "sep", "oct"].includes(bulan);
  if (!isiBulan) {
    return {
      bulan,
      curahHujan: null,
      defisitAir: null,
      hariHujan: null,
      kelebihanAir: null,
    };
  }
  const nilai: Record<string, [number, number, number, number]> = {
    jun: [133, 0, 6, 0],
    aug: [481.79, 0, 16, 0],
    sep: [127.9, 0, 17, 12.4],
    oct: [139.9, 0, 16, 0],
  };
  const [curahHujan, defisitAir, hariHujan, kelebihanAir] = nilai[bulan];
  return { bulan, curahHujan, defisitAir, hariHujan, kelebihanAir };
});

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

function deriveVpdKategori(vpd: number, batasAman: number): VPDReport["kategori"] {
  const rasio = vpd / batasAman;
  if (rasio <= 0.7) return "rendah";
  if (rasio <= 1) return "sedang";
  return "tinggi";
}

/** Nilai contoh mengikuti pola `GET /solar_sunshine` asli. */
const MOCK_SUNSHINE_ROWS: Omit<SunshineDuration, "stasiun">[] = [
  { tanggal: "2026-08-17", lamaPenyinaranJam: 8, batasBawahJam: 3 },
  { tanggal: "2026-08-18", lamaPenyinaranJam: 7, batasBawahJam: 3 },
  { tanggal: "2026-08-19", lamaPenyinaranJam: 5.5, batasBawahJam: 3 },
];

export const mockMonitoringApi: MonitoringApi = {
  async getWaterBalance(
    params: MonitoringFilterParams,
  ): Promise<ApiItemResponse<WaterBalance>> {
    await delay();
    assertStationActive(params);

    return {
      data: {
        stationId: params.stationId ?? "",
        tahun: new Date().getFullYear(),
        bulanan: MOCK_WATER_BALANCE_MONTHS,
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
