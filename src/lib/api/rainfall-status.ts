import type { WeatherStatus } from "@/types/domain";

const SUFFICIENT_RAINFALL_THRESHOLD_MM = 2;

/** Threshold sementara, sama status "belum final" seperti
 *  VPDReport.kategori — butuh konfirmasi Data Analyst/BE. Tidak ada field
 *  ini dari backend manapun (semua brand), jadi tetap derived di sini
 *  meski Curah Hujan sendiri sudah 100% real. */
export function deriveRainfallStatus(value: number | null): WeatherStatus {
  if (value !== null && value < SUFFICIENT_RAINFALL_THRESHOLD_MM) {
    return { tone: "warning", message: "Curah hujan tidak cukup untuk pemupukan" };
  }
  return { tone: "success", message: "Curah hujan cukup untuk pemupukan" };
}
