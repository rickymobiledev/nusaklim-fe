import type { WeatherStatus } from "@/types/domain";

const HIGH_RADIATION_THRESHOLD_WM2 = 800;

/** Threshold & kalimat sementara (belum ada dari BE), sama status "belum
 *  final" seperti deriveRainfallStatus/deriveTemperatureStatus — butuh
 *  konfirmasi Data Analyst/BE. Kalimat sukses utama dari Figma. Hanya sisi
 *  "tinggi" yang warning: radiasi rendah/nol (malam) itu normal. */
export function deriveSolarRadiationStatus(value: number | null): WeatherStatus {
  if (value === null) {
    return { tone: "warning", message: "Data radiasi matahari tidak tersedia" };
  }
  if (value >= HIGH_RADIATION_THRESHOLD_WM2) {
    return {
      tone: "warning",
      message: "Radiasi matahari tinggi, waspada cekaman panas pada tanaman",
    };
  }
  if (value === 0) {
    return { tone: "success", message: "Tidak ada radiasi matahari saat ini" };
  }
  return { tone: "success", message: "Cukup untuk fotosintesis, belum termasuk tinggi" };
}
