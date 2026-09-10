import {
  MONTH_ORDER,
  type MonthKey,
  type WaterBalance,
  type WaterBalanceMetric,
} from "@/types/domain";

export const MONTH_LABEL_SHORT: Record<MonthKey, string> = {
  jan: "Jan",
  feb: "Feb",
  mar: "Mar",
  apr: "Apr",
  may: "Mei",
  jun: "Jun",
  jul: "Jul",
  aug: "Agu",
  sep: "Sep",
  oct: "Okt",
  nov: "Nov",
  dec: "Des",
};

export interface MergedWaterBalanceRow {
  month: string;
  [year: number]: string | number | null;
}

/** Gabung `WaterBalance[]` (satu objek per tahun terpilih) jadi satu
 *  baris per bulan dengan satu kolom per tahun — bentuk yang Recharts
 *  `<LineChart data={...}>` butuhkan supaya semua `<Line dataKey={tahun}>`
 *  berbagi sumbu-X yang sama. Mirror `mergeSeriesByDate` di
 *  `air-temperature-chart-utils.ts`, cuma sumbunya bulan (selalu 12,
 *  ikut `MONTH_ORDER`) bukan tanggal. */
export function mergeSeriesByMonth(
  seriesByYear: WaterBalance[],
  metric: WaterBalanceMetric,
): MergedWaterBalanceRow[] {
  return MONTH_ORDER.map((month, index) => {
    const row: MergedWaterBalanceRow = { month: MONTH_LABEL_SHORT[month] };
    for (const series of seriesByYear) {
      row[series.year] = series.months[index]?.[metric] ?? null;
    }
    return row;
  });
}

/** Total setahun untuk satu metrik — dipakai baris legend ("2025 Total:
 *  1316.27"). Bulan tanpa data (null/gap) diabaikan, bukan dihitung 0. */
export function sumMetric(series: WaterBalance, metric: WaterBalanceMetric): number {
  const sum = series.months.reduce((total, month) => total + (month[metric] ?? 0), 0);
  return Math.round(sum * 100) / 100;
}
