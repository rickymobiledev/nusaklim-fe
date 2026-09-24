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

/** Baris tabel Keseimbangan Air — urutan & label ikut Figma. */
export const WATER_BALANCE_ROWS: { metric: WaterBalanceMetric; label: string }[] = [
  { metric: "rainfall", label: "Curah Hujan" },
  { metric: "waterDeficit", label: "Defisit Air" },
  { metric: "rainyDays", label: "Hari Hujan" },
  { metric: "waterSurplus", label: "Kelebihan Air" },
];

/** Total setahun untuk satu metrik (kolom "Total"). Bulan tanpa data
 *  (null/gap) diabaikan, bukan dihitung 0; semua bulan kosong → `null`. */
export function sumMetric(
  series: WaterBalance,
  metric: WaterBalanceMetric,
): number | null {
  const values = series.months
    .map((month) => month[metric])
    .filter((value): value is number => value !== null);
  if (values.length === 0) return null;
  const sum = values.reduce((total, value) => total + value, 0);
  return Math.round(sum * 100) / 100;
}

/** Format sel tabel: 2 desimal ("88.50"), `null` → "-". */
export function formatWaterBalanceValue(value: number | null | undefined): string {
  return value === null || value === undefined ? "-" : value.toFixed(2);
}

/** CSV isi tabel (Parameter, Stasiun, Jan–Des, Total). Sel kosong untuk `null`. */
export function buildWaterBalanceCsv(series: WaterBalance, stationCode: string): string {
  const header = [
    "Parameter",
    "Stasiun",
    ...MONTH_ORDER.map((month) => MONTH_LABEL_SHORT[month]),
    "Total",
  ];
  const lines = WATER_BALANCE_ROWS.map(({ metric, label }) =>
    [
      label,
      `"${stationCode.replace(/"/g, '""')}"`,
      ...series.months.map((month) => month[metric] ?? ""),
      sumMetric(series, metric) ?? "",
    ].join(","),
  );
  return [header.join(","), ...lines].join("\n");
}
