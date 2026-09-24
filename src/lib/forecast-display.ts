import type { ForecastDay } from "@/types/forecast";
import { getForecastIconLevel, type ForecastIconLevel } from "@/lib/forecast-icon-level";

/** Label kategori hujan per hari di halaman /forecast. Threshold SENGAJA
 *  ikut `getForecastIconLevel` supaya icon & label selalu konsisten —
 *  BELUM FINAL (butuh konfirmasi Data Analyst), sama status-nya dengan
 *  `forecast-icon-level.ts`. Cocok dengan contoh Figma: 9 mm = Hujan
 *  Ringan, 21 mm = Hujan Sedang, 105 mm = Sangat Lebat. */
export const FORECAST_CATEGORY_LABEL: Record<ForecastIconLevel, string> = {
  cerah: "Tidak Hujan",
  gerimis: "Hujan Ringan",
  hujan: "Hujan Sedang",
  badai: "Sangat Lebat",
};

export function getForecastCategory(rainfallMm: number): string {
  return FORECAST_CATEGORY_LABEL[getForecastIconLevel(rainfallMm)];
}

/** Gambar latar panel "Hari Ini" per level cuaca. Pemetaan gambar→level
 *  berdasarkan urutan aset Figma (cerah, hujan ringan, sedang, lebat) —
 *  tukar nama file di `public/brand/` bila ternyata terbalik. */
export const FORECAST_BACKGROUND_SRC: Record<ForecastIconLevel, string> = {
  cerah: "/brand/forecast-bg-cerah.webp",
  gerimis: "/brand/forecast-bg-gerimis.webp",
  hujan: "/brand/forecast-bg-hujan.webp",
  badai: "/brand/forecast-bg-badai.webp",
};

/** Ambang alert "Potensi Hujan Lebat" (mm/hari) — dari teks Figma
 *  "> 30mm/hari", BELUM FINAL. */
export const HEAVY_RAIN_ALERT_MM = 30;

export function findHeavyRainDay(days: ForecastDay[]): ForecastDay | undefined {
  return days.find((day) => day.rainfall > HEAVY_RAIN_ALERT_MM);
}

/** Min/maks satu metrik dari SELURUH array forecast — API tidak memberi
 *  min/maks per hari, jadi ini rentang horizon prakiraan (asumsi, sesuai
 *  label Figma "Min … — Maks …"). */
export function getRange(
  days: ForecastDay[],
  pick: (day: ForecastDay) => number,
): { min: number; max: number } | null {
  if (days.length === 0) return null;
  const values = days.map(pick);
  return { min: Math.min(...values), max: Math.max(...values) };
}

export type ForecastParameter =
  | "rainfall"
  | "temperature"
  | "humidity"
  | "radiation"
  | "airPressure"
  | "windSpeed"
  | "windDirectionDeg";

export const FORECAST_PARAMETERS: {
  value: ForecastParameter;
  label: string;
  axisLabel: string;
}[] = [
  { value: "rainfall", label: "Curah Hujan", axisLabel: "Curah Hujan" },
  { value: "temperature", label: "Temperatur Udara", axisLabel: "Temperatur" },
  { value: "humidity", label: "Kelembapan Udara", axisLabel: "Kelembapan" },
  { value: "radiation", label: "Radiasi Matahari", axisLabel: "Radiasi" },
  { value: "airPressure", label: "Tekanan Udara", axisLabel: "Tekanan" },
  { value: "windSpeed", label: "Kecepatan Angin", axisLabel: "Kecepatan Angin" },
  { value: "windDirectionDeg", label: "Arah Mata Angin", axisLabel: "Arah Angin" },
];

/** Fallback bila `units` dari API kosong (field itu kadang tidak ada sama
 *  sekali, lihat `forecast-adapter.ts`) — mengikuti satuan di Figma. */
const DEFAULT_UNITS: Record<ForecastParameter, string> = {
  rainfall: "mm",
  temperature: "°C",
  humidity: "%",
  radiation: "W/m²",
  airPressure: "mbar",
  windSpeed: "m/s",
  windDirectionDeg: "°",
};

/** Kunci `units` dari adapter sama dengan nama field `ForecastDay`; arah
 *  angin tidak punya unit di `units` (derajat ditampilkan "°"). */
export function getParameterUnit(
  parameter: ForecastParameter,
  units: Record<string, string>,
): string {
  if (parameter === "windDirectionDeg") return DEFAULT_UNITS.windDirectionDeg;
  return units[parameter] ?? DEFAULT_UNITS[parameter];
}
