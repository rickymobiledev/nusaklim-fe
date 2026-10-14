/** Windows arah angin disimpan sebagai derajat mentah — konversi ke teks
 *  arah mata angin (lib/utils degreesToCompass) dilakukan di layer
 *  tampilan, bukan disimpan sebagai teks di sini. */
export interface ForecastDay {
  date: string;
  temperature: number;
  humidity: number;
  radiation: number;
  rainfall: number;
  airPressure: number;
  windSpeed: number;
  windDirectionDeg: number;
}

export interface ForecastResult {
  stationId: string;
  stationName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  forecast: ForecastDay[];
  units: Record<string, string>;
}

/** Model ramalan: "primer" = model ML ukuran lebih kecil, "sekunder" = model
 *  lain (endpoint/param BE-nya belum ada, lihat `app/api/forecast/route.ts`). */
export type ForecastModel = "primer" | "sekunder";

export const FORECAST_MODELS: { id: ForecastModel; label: string; note: string }[] = [
  {
    id: "primer",
    label: "Primer",
    note: "*Model dibangun dengan algoritma machine learning",
  },
  { id: "sekunder", label: "Sekunder", note: "*Model diambil dari pihak ketiga" },
];
