import type { AirTemperatureStationSeries } from "@/types/domain";

export interface MergedChartRow {
  date: string;
  [stationId: string]: string | number | null;
}

/** Gabung beberapa deret per-stasiun (satu titik per tanggal masing-
 *  masing) jadi satu baris per tanggal dengan satu kolom per stasiun —
 *  bentuk yang Recharts `<LineChart data={...}>` butuhkan supaya semua
 *  `<Line dataKey={stationId}>` berbagi sumbu-X yang sama. */
export function mergeSeriesByDate(
  series: AirTemperatureStationSeries[],
): MergedChartRow[] {
  const rowsByDate = new Map<string, MergedChartRow>();

  for (const s of series) {
    for (const point of s.points) {
      const row = rowsByDate.get(point.date) ?? { date: point.date };
      row[s.stationId] = point.value;
      rowsByDate.set(point.date, row);
    }
  }

  return Array.from(rowsByDate.values());
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** CSV dari data chart yang SUDAH ke-fetch (bukan request baru ke server)
 *  — dipakai tombol "Unduh Data" di `AirTemperatureFilters.tsx`. Kolom
 *  ikut urutan `series` (= urutan stasiun terpilih), baris ikut tanggal
 *  gabungan dari `mergeSeriesByDate()` biar konsisten sama data yang
 *  dipakai chart. Titik tanpa data (gap) jadi sel kosong, bukan literal
 *  "null". */
export function buildTemperatureCsv(series: AirTemperatureStationSeries[]): string {
  const rows = mergeSeriesByDate(series);
  const header = ["Tanggal", ...series.map((s) => csvEscape(s.stationName))];

  const lines = rows.map((row) => {
    const cells = [
      csvEscape(row.date),
      ...series.map((s) => {
        const value = row[s.stationId];
        return value === null || value === undefined ? "" : String(value);
      }),
    ];
    return cells.join(",");
  });

  return [header.join(","), ...lines].join("\n");
}

/** Trigger save-as browser standar dari teks yang sudah digenerate di
 *  client (BUKAN fetch dari luar) — klik tombol oleh user sendiri men-
 *  download data yang sedang mereka lihat sendiri. */
export function downloadCsvFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export interface StationStats {
  avg: number | null;
  max: number | null;
  min: number | null;
}

/** Rata-rata/max/min null-safe — titik tanpa data (gap) diabaikan, bukan
 *  dihitung sebagai 0. */
export function computeStationStats(points: { value: number | null }[]): StationStats {
  const values = points.map((p) => p.value).filter((v): v is number => v !== null);

  if (values.length === 0) {
    return { avg: null, max: null, min: null };
  }

  const sum = values.reduce((acc, v) => acc + v, 0);

  return {
    avg: Math.round((sum / values.length) * 10) / 10,
    max: Math.max(...values),
    min: Math.min(...values),
  };
}
