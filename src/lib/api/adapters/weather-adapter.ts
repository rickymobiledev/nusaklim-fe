import type { WeatherMetric, WeatherMetricRange } from "@/types/domain";

/**
 * `GET /weathers/latest?device_id=` (data REAL, dikonfirmasi uji langsung
 * ke backend) balikin bentuk BEDA-BEDA tergantung device — nama field
 * yang dipakai bisa beda (`temperature` vs `air_temperature`), dan tidak
 * semua device kirim semua field (device rain-gauge-only cuma kirim
 * `rainfall`, misalnya). BUKAN karena "brand tertentu selalu begini" —
 * kita tidak lagi dispatch berdasarkan `Station.brand` sama sekali di
 * sini (lihat Update 5 di plan file untuk histori keputusannya). Field
 * di bawah cuma daftar ALIAS nama yang sudah dikonfirmasi dari 3 sample
 * device real (brand Davis Instruments/Meteo Nusantara Instrumen/Merapi
 * Tani Instrumen), digabung pakai `??` tanpa peduli device-nya "brand"
 * apa — kalau field-nya tidak ada di raw payload, otomatis `undefined` →
 * `parseNum()` → `null` (UI render "--"), tidak pernah error.
 *
 * KETERBATASAN yang perlu diketahui: kalau suatu saat ada device dengan
 * nama field YANG SAMA tapi ARTI BEDA (misal device lain juga kirim
 * `humidity` tapi satuannya beda skala), gabungan `??` ini bisa salah
 * campur secara diam-diam — belum ada mekanisme deteksi untuk kasus itu.
 * Trade-off yang disengaja demi menghindari daftar dispatch per-brand
 * yang gampang basi (brand rename/brand baru bikin data hilang diam-diam
 * kalau tidak di-update manual).
 *
 * Field yang tidak tersedia jadi `null` (bukan dihilangkan dari tipe —
 * ini BENAR/jujur, bukan bug, kalau device-nya memang tidak punya sensor
 * itu). Komponen UI (MetricCard dkk) HANYA boleh menerima hasil yang
 * sudah dinormalisasi ini, tidak pernah bentuk mentah. Dipakai oleh
 * `weather-client.ts` (real, satu-satunya implementasi — lihat
 * `lib/api/index.ts`).
 */

/** Nama key min/max di objek `statistics` — dikonfirmasi PASTI ada
 *  untuk device brand Davis Instruments (device live), belum
 *  dikonfirmasi ada/tidaknya di device lain. `toRange()` aman dipanggil
 *  terlepas `statistics`-nya ada atau tidak. */
interface RawStatistics {
  min_temperature?: number | string;
  max_temperature?: number | string;
  min_humidity?: number | string;
  max_humidity?: number | string;
  min_solar_radiation?: number | string;
  max_solar_radiation?: number | string;
  min_rainfall?: number | string;
  max_rainfall?: number | string;
  min_air_pressure?: number | string;
  max_air_pressure?: number | string;
  min_wind_speed?: number | string;
  max_wind_speed?: number | string;
}

function parseNum(rawValue: unknown): number | null {
  if (rawValue === null || rawValue === undefined) return null;
  const n = typeof rawValue === "number" ? rawValue : parseFloat(String(rawValue));
  return Number.isFinite(n) ? n : null;
}

/** Min/max cuma diisi kalau `stats`+key-nya dikasih DAN nilainya
 *  numerik valid (bukan `undefined`/`"---"`/dsb, lihat `parseNum()`) —
 *  aman dipanggil terlepas device-nya benar-benar punya `statistics`
 *  atau tidak, selalu jatuh ke `null` (UI render "--") kalau tidak ada,
 *  tidak pernah error. */
function toRange(
  rawValue: unknown,
  unit: string,
  stats?: RawStatistics,
  minKey?: keyof RawStatistics,
  maxKey?: keyof RawStatistics,
): WeatherMetricRange {
  const value = parseNum(rawValue);
  if (!stats || !minKey || !maxKey) {
    return { value, min: null, max: null, unit };
  }
  return { value, min: parseNum(stats[minKey]), max: parseNum(stats[maxKey]), unit };
}

/** Satu-satunya normalizer Weather — tidak lagi dispatch per brand
 *  (lihat docblock atas file). */
export function normalizeWeather(
  raw: Record<string, unknown>,
  stationId: string,
): WeatherMetric {
  const stats = raw.statistics as RawStatistics | undefined;
  return {
    stationId,
    updatedAt: typeof raw.datetime === "string" ? raw.datetime : null,
    airTemperature: toRange(
      raw.temperature ?? raw.air_temperature,
      "°C",
      stats,
      "min_temperature",
      "max_temperature",
    ),
    solarRadiation: toRange(
      raw.radiation,
      "MJ/m²",
      stats,
      "min_solar_radiation",
      "max_solar_radiation",
    ),
    airHumidity: toRange(
      raw.humidity ?? raw.air_humidity,
      "%",
      stats,
      "min_humidity",
      "max_humidity",
    ),
    rainfall: toRange(raw.rainfall, "mm", stats, "min_rainfall", "max_rainfall"),
    airPressure: toRange(
      raw.air_pressure,
      "hPa",
      stats,
      "min_air_pressure",
      "max_air_pressure",
    ),
    windSpeed: toRange(raw.wind_speed, "m/s", stats, "min_wind_speed", "max_wind_speed"),
  };
}
