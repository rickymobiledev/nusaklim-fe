import type { WeatherStatus } from "@/types/domain";

const LOW_HUMIDITY_THRESHOLD_PERCENT = 40;
const HIGH_HUMIDITY_THRESHOLD_PERCENT = 70;

/** Threshold sementara (belum ada dari BE), sama status "belum final"
 *  seperti deriveRainfallStatus/VPDReport.kategori — butuh konfirmasi
 *  Data Analyst/BE sebelum dianggap final. */
export function deriveHumidityStatus(value: number | null): WeatherStatus {
  if (value === null) {
    return { tone: "warning", message: "Data kelembapan tidak tersedia" };
  }
  if (value < LOW_HUMIDITY_THRESHOLD_PERCENT) {
    return {
      tone: "warning",
      message: "Udara terlalu kering untuk kondisi tanaman optimal",
    };
  }
  if (value > HIGH_HUMIDITY_THRESHOLD_PERCENT) {
    return {
      tone: "warning",
      message: "Udara terlalu lembap, waspada risiko penyakit tanaman",
    };
  }
  return {
    tone: "success",
    message: "Udara cukup lembab dan masih dalam kondisi normal untuk tanaman",
  };
}
