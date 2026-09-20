import type { WeatherStatus } from "@/types/domain";

const LOW_PRESSURE_THRESHOLD_MBAR = 1000;
const HIGH_PRESSURE_THRESHOLD_MBAR = 1020;

/** Threshold & kalimat sementara (belum ada dari BE), sama status "belum
 *  final" seperti deriveRainfallStatus/deriveTemperatureStatus — butuh
 *  konfirmasi Data Analyst/BE. Kalimat sukses dari Figma ("aktifitas" di
 *  Figma, di sini ejaan baku "aktivitas"). */
export function deriveAirPressureStatus(value: number | null): WeatherStatus {
  if (value === null) {
    return { tone: "warning", message: "Data tekanan udara tidak tersedia" };
  }
  if (value < LOW_PRESSURE_THRESHOLD_MBAR) {
    return {
      tone: "warning",
      message: "Tekanan udara rendah, waspada potensi cuaca buruk",
    };
  }
  if (value > HIGH_PRESSURE_THRESHOLD_MBAR) {
    return {
      tone: "warning",
      message: "Tekanan udara tinggi, perhatikan potensi kondisi kering",
    };
  }
  return {
    tone: "success",
    message: "Kondisinya stabil dan aman untuk aktivitas tanaman",
  };
}
