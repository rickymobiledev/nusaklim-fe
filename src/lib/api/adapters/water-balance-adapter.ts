import { MONTH_ORDER, type WaterBalance, type WaterBalanceMonth } from "@/types/domain";

/** Bentuk mentah `GET /water_deficit?device_id=&year=` (dikonfirmasi
 *  lewat tes langsung ke backend asli, curl pakai `API_KEY`/`API_BASE_URL`
 *  dari `.env.local`) — wide-pivot: satu baris per `parameter`, kolom
 *  `jan`..`dec` (STRING angka atau `null`, termasuk bentuk `".00"` tanpa
 *  leading zero) + `total`. BEDA dari `/devices/water_deficit`
 *  (`RawWaterDeficitDevice` di `water-deficit-adapter.ts`) yang narrow
 *  (`water_deficit: [{component, value}]` per device, snapshot 1 bulan
 *  company-wide) — endpoint ini per-STASIUN (`device_id`) per-TAHUN, 12
 *  bulan sekaligus, dibungkus `{status, message, data}` sama seperti
 *  `/devices/water_deficit`/`/devices/dry_spell`. */
export interface RawWaterBalanceRow {
  station: string;
  year: number;
  parameter: "CURAH_HUJAN" | "DEFISIT_AIR" | "HARI_HUJAN" | "KELEBIHAN_AIR";
  jan: string | null;
  feb: string | null;
  mar: string | null;
  apr: string | null;
  may: string | null;
  jun: string | null;
  jul: string | null;
  aug: string | null;
  sep: string | null;
  oct: string | null;
  nov: string | null;
  dec: string | null;
  total: string | null;
}

export interface RawWaterBalanceResponse {
  status: boolean;
  message: string;
  data: RawWaterBalanceRow[];
}

/** String angka BE -> number, `null` kalau bulan itu tidak ada data
 *  (`Number(".00")` = 0, tetap tervalidasi lewat `Number.isFinite`). */
function parseMonthValue(raw: string | null): number | null {
  if (raw === null) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function mapRawWaterBalance(
  rows: RawWaterBalanceRow[],
  stationId: string,
  year: number,
): WaterBalance {
  const rowByParameter = new Map(rows.map((row) => [row.parameter, row]));

  const months: WaterBalanceMonth[] = MONTH_ORDER.map((month) => ({
    month,
    rainfall: parseMonthValue(rowByParameter.get("CURAH_HUJAN")?.[month] ?? null),
    waterDeficit: parseMonthValue(rowByParameter.get("DEFISIT_AIR")?.[month] ?? null),
    rainyDays: parseMonthValue(rowByParameter.get("HARI_HUJAN")?.[month] ?? null),
    waterSurplus: parseMonthValue(rowByParameter.get("KELEBIHAN_AIR")?.[month] ?? null),
  }));

  return { stationId, year, months };
}
