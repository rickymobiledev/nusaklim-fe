import type { WeatherStatus } from "@/types/domain";

const STRONG_WIND_THRESHOLD_MS = 8;

/** Threshold & kalimat sementara (belum ada dari BE), sama status "belum
 *  final" seperti deriveRainfallStatus/deriveTemperatureStatus — butuh
 *  konfirmasi Data Analyst/BE. 8 m/s ≈ Beaufort 5 (angin kencang). Kalimat
 *  sukses dari Figma. */
export function deriveWindSpeedStatus(value: number | null): WeatherStatus {
  if (value === null) {
    return { tone: "warning", message: "Data kecepatan angin tidak tersedia" };
  }
  if (value >= STRONG_WIND_THRESHOLD_MS) {
    return {
      tone: "warning",
      message: "Angin kencang, waspada kerusakan pada tanaman",
    };
  }
  return { tone: "success", message: "Angin bertiup ringan dan stabil." };
}
