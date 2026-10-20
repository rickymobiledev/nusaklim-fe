import { format } from "date-fns";
import { ApiError } from "@/types/api";
import { createApiClient } from "./fetcher";

/** Endpoint periode hari di backend: larut malam (00:00–05:59), pagi
 *  (06:00–11:59), siang (12:00–17:59), malam (18:00–23:59). */
export type WeatherPeriod =
  | "late_night"
  | "morning_v2"
  | "afternoon_v2"
  | "evening_v2";

/** Satu baris AGREGAT per hari per periode dari
 *  `GET /weathers/{late_night|morning_v2|afternoon_v2|evening_v2}` — BUKAN pembacaan mentah
 *  seperti `/weathers/filter` (`weather-filter-client.ts`). Dikonfirmasi lewat
 *  tes langsung ke backend asli: semua metrik NUMBER (bukan string),
 *  `datetime` cuma tanggal `"YYYY-MM-DD"` (tanpa jam), dan tidak ada
 *  `device_id`. Cara agregasi (jumlah/rata-rata) tiap metrik tidak
 *  dikonfirmasi — ditampilkan apa adanya. Hari tanpa data tidak muncul
 *  sebagai baris. */
export interface RawWeatherPeriod {
  datetime: string;
  temperature: number | string | null;
  humidity: number | string | null;
  solar_radiation: number | string | null;
  rainfall: number | string | null;
  air_pressure: number | string | null;
  wind_speed: number | string | null;
  wind_direction: number | string | null;
}

/** Request mentah ke `/weathers/{period}` untuk SATU device — dipakai
 *  `download-client.ts` untuk granularitas Pagi/Siang/Malam di halaman
 *  `/download-data`. Error SENGAJA tidak ditangkap/di-fallback di sini,
 *  konsisten `fetchRawDaily`/`fetchRawFilter`. */
export async function fetchRawPeriod(
  period: WeatherPeriod,
  deviceId: string,
  start: Date,
  end: Date,
  companyId?: string,
): Promise<RawWeatherPeriod[]> {
  const client = createApiClient(companyId);
  const res = await client.get<{
    status: boolean;
    message: string;
    data: RawWeatherPeriod[];
  }>(`/weathers/${period}`, {
    params: {
      device_id: deviceId,
      start_date: format(start, "yyyy-MM-dd"),
      end_date: format(end, "yyyy-MM-dd"),
    },
  });

  if (!res.data.status) {
    throw new ApiError(
      "WEATHER_PERIOD_FETCH_FAILED",
      res.data.message || "Gagal mengambil data cuaca per periode.",
    );
  }

  return res.data.data;
}
