/** Icon kondisi cuaca per hari di kartu "Ramalan Cuaca" (Beranda) derived
 *  dari `rainfall` (mm) — `ForecastDay` (types/forecast.ts) tidak
 *  punya field kondisi cuaca sendiri. Threshold BELUM FINAL (butuh
 *  konfirmasi Data Analyst/BE, sama status-nya seperti
 *  `lib/dry-spell-level.ts`/`lib/water-deficit-level.ts`) — dipilih agar
 *  cocok dengan batas "Keterangan Curah Hujan (mm)" di legenda Heatmap
 *  Figma (<0.1, 0.1-20, 21-100, >100, 6 tier di-merge jadi 4 kategori
 *  icon). */
export type ForecastIconLevel = "cerah" | "gerimis" | "hujan" | "badai";

export function getForecastIconLevel(rainfallMm: number): ForecastIconLevel {
  if (rainfallMm < 0.1) return "cerah";
  if (rainfallMm < 21) return "gerimis";
  if (rainfallMm < 101) return "hujan";
  return "badai";
}

/** Belum ada file-nya — pola sama `dashboard-hero-bg.png`/`air-pressure.png`,
 *  user akan drop asset Figma-nya menyusul. */
export const FORECAST_ICON_SRC: Record<ForecastIconLevel, string> = {
  cerah: "/brand/weather-sunny.png",
  gerimis: "/brand/weather-drizzle.png",
  hujan: "/brand/weather-rainy.png",
  badai: "/brand/weather-stormy.png",
};
