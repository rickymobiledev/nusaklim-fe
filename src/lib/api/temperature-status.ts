import type { WeatherStatus } from "@/types/domain";

const LOW_TEMPERATURE_THRESHOLD_C = 24;
const HIGH_TEMPERATURE_THRESHOLD_C = 32;

/** Threshold & kalimat sementara (belum ada dari BE), sama status "belum
 *  final" seperti deriveRainfallStatus/deriveHumidityStatus — butuh
 *  konfirmasi Data Analyst/BE. Kalimat sukses di Figma terpotong ("...dan
 *  kondisi t"), kelanjutannya tebakan. */
export function deriveTemperatureStatus(value: number | null): WeatherStatus {
  if (value === null) {
    return { tone: "warning", message: "Data temperatur tidak tersedia" };
  }

  const shown = Math.round(value * 10) / 10;
  if (value < LOW_TEMPERATURE_THRESHOLD_C) {
    return {
      tone: "warning",
      message: `Suhu ${shown} °C terlalu dingin untuk pemupukan yang optimal`,
    };
  }
  if (value > HIGH_TEMPERATURE_THRESHOLD_C) {
    return {
      tone: "warning",
      message: `Suhu ${shown} °C terlalu panas, waspada stres pada tanaman`,
    };
  }
  return {
    tone: "success",
    message: `Suhu ${shown} °C bagus untuk pemupukan. Nutrisi terserap optimal dan kondisi tanaman terjaga.`,
  };
}
