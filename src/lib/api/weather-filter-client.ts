import { format } from "date-fns";
import { ApiError } from "@/types/api";
import { createApiClient } from "./fetcher";

/** Satu pembacaan mentah (~tiap 10 menit, tidak selalu genap — bisa ada
 *  gap) dari `GET /weathers/filter` — BEDA TOTAL dari `/weathers/daily`
 *  (`weather-daily-client.ts`, agregat 1 baris per HARI): endpoint ini
 *  balikin data MENTAH per pembacaan, dikonfirmasi lewat tes langsung ke
 *  backend asli. Semua field metrik STRING (bukan number) dan pakai
 *  sentinel literal `"---"` untuk "tidak ada data" (device brand "Meteo
 *  Nusantara Instrumen"/ARR pernah balikin ini, pola sentinel yang sama
 *  seperti `StationRainfallToday.rainfall` mentah — lihat
 *  `rainfall-today-adapter.ts`). `air_pressure` SATU-SATUNYA field yang
 *  pakai pemisah ribuan koma di response asli (mis. `"1,006.07"`), field
 *  lain tidak. `datetime` formatnya `"DD-MM-YYYY HH:mm"` (BUKAN ISO),
 *  descending (terbaru dulu) di response asli. */
export interface RawWeatherFilter {
  device_id: string;
  datetime: string;
  temperature: string;
  humidity: string;
  rainfall: string;
  radiation: string;
  air_pressure: string;
  wind_speed: string;
  wind_direction: string;
}

/** Sentinel `"---"` atau string non-numerik apa pun → `null`. Strip koma
 *  ribuan dulu sebelum `Number()` (satu-satunya field yang butuh ini di
 *  endpoint ini adalah `air_pressure`, tapi aman dipanggil untuk semua
 *  field string di `RawWeatherFilter` — field lain memang tidak pernah
 *  mengandung koma). */
export function parseFilterNumeric(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const n = Number(raw.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Request mentah ke `/weathers/filter` untuk SATU device — dipakai
 *  `download-client.ts` untuk granularitas selain "Per Hari" (10
 *  Menit/Pagi/Siang/Malam) di halaman `/download-data`. Error SENGAJA tidak
 *  ditangkap/di-fallback di sini — biar gagal (`ApiError`), konsisten
 *  kebijakan Stasiun/Weather "tidak ada jalur mock sama sekali", caller
 *  (`download-client.ts`) yang membungkus jadi `ApiError` domain-nya
 *  sendiri. */
export async function fetchRawFilter(
  deviceId: string,
  start: Date,
  end: Date,
  companyId?: string,
): Promise<RawWeatherFilter[]> {
  const client = createApiClient(companyId);
  const res = await client.get<{
    status: boolean;
    message: string;
    data: RawWeatherFilter[];
  }>("/weathers/filter", {
    params: {
      device_id: deviceId,
      start_date: format(start, "yyyy-MM-dd"),
      end_date: format(end, "yyyy-MM-dd"),
    },
  });

  if (!res.data.status) {
    throw new ApiError(
      "WEATHER_FILTER_FETCH_FAILED",
      res.data.message || "Gagal mengambil data cuaca mentah.",
    );
  }

  return res.data.data;
}
