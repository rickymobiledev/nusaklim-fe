import { format, subDays, addDays, differenceInCalendarDays } from "date-fns";
import { ApiError } from "@/types/api";
import type { WeatherChartPoint } from "@/types/domain";
import { createApiClient } from "./fetcher";

const CHART_DAYS = 7;

/** Satu baris per hari dari `GET /weathers/daily`. Field utama
 *  (`sum_rainfall`, `average_temperature`, `average_humidity`,
 *  `sum_solar_radiation`, `average_air_pressure`, `average_wind_speed`,
 *  `average_wind_direction`) SEKARANG CONFIRMED — dikonfirmasi lewat tes
 *  langsung ke backend asli (contoh response real dipakai membangun
 *  `lib/api/download-client.ts`, halaman `/download-data`), bukan lagi
 *  alias-guess. Alias tambahan (`avg_temperature`/`mean_temperature`/dst)
 *  dibiarkan sebagai fallback kalau-kalau ada device/brand lain yang
 *  pernah balikin nama beda — TIDAK dihapus, tapi urutan pencarian di
 *  `parseXxx()` di bawah tetap prioritaskan nama yang sudah confirmed. */
export interface RawWeatherDaily {
  date: string; // "YYYY-MM-DD"
  sum_rainfall: number | string | null;
  average_humidity?: number | string | null;
  average_temperature?: number | string | null;
  avg_temperature?: number | string | null;
  mean_temperature?: number | string | null;
  sum_solar_radiation?: number | string | null;
  average_air_pressure?: number | string | null;
  average_wind_speed?: number | string | null;
  avg_wind_speed?: number | string | null;
  mean_wind_speed?: number | string | null;
  average_wind_direction?: number | string | null;
  avg_wind_direction?: number | string | null;
  mean_wind_direction?: number | string | null;
}

export function parseNumeric(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const n = typeof raw === "number" ? raw : parseFloat(String(raw));
  return Number.isFinite(n) ? n : null;
}

/** Exported juga untuk `download-client.ts` (granularitas "Per Hari") —
 *  reuse langsung, jangan duplikasi cara parsing tiap metrik dari
 *  `RawWeatherDaily`. */
export function parseHumidity(row: RawWeatherDaily): number | null {
  return parseNumeric(row.average_humidity);
}

export function parseTemperature(row: RawWeatherDaily): number | null {
  return parseNumeric(
    row.average_temperature ?? row.avg_temperature ?? row.mean_temperature,
  );
}

export function parseRadiation(row: RawWeatherDaily): number | null {
  return parseNumeric(row.sum_solar_radiation);
}

export function parsePressure(row: RawWeatherDaily): number | null {
  return parseNumeric(row.average_air_pressure);
}

export function parseWindSpeed(row: RawWeatherDaily): number | null {
  return parseNumeric(
    row.average_wind_speed ?? row.avg_wind_speed ?? row.mean_wind_speed,
  );
}

export function parseWindDirection(row: RawWeatherDaily): number | null {
  return parseNumeric(
    row.average_wind_direction ?? row.avg_wind_direction ?? row.mean_wind_direction,
  );
}

/** Request mentah ke `/weathers/daily` untuk SATU device — dipakai baik
 *  oleh `fetchWeatherDailyChart()` (window 7 hari tetap, kartu Beranda)
 *  maupun `fetchTemperatureRange()` dkk (window custom dari user, halaman
 *  `/air-temperature` dst) DAN `download-client.ts` (granularitas "Per
 *  Hari" halaman `/download-data`, exported khusus untuk itu — satu-satunya
 *  consumer di luar file ini). Error SENGAJA tidak ditangkap/di-fallback —
 *  biar gagal (`ApiError`), konsisten kebijakan Stasiun/Weather "tidak ada
 *  jalur mock sama sekali". */
export async function fetchRawDaily(
  deviceId: string,
  start: Date,
  end: Date,
  companyId?: string,
): Promise<RawWeatherDaily[]> {
  const client = createApiClient(companyId);
  const res = await client.get<{
    status: boolean;
    message: string;
    data: RawWeatherDaily[];
  }>("/weathers/daily", {
    params: {
      device_id: deviceId,
      start_date: format(start, "yyyy-MM-dd"),
      end_date: format(end, "yyyy-MM-dd"),
    },
  });

  if (!res.data.status) {
    throw new ApiError(
      "WEATHER_DAILY_CHART_FETCH_FAILED",
      res.data.message || "Gagal mengambil tren cuaca harian.",
    );
  }

  return res.data.data;
}

/** Sumber chart 7 hari kartu Curah Hujan & Kelembapan Relatif — SATU-
 *  SATUNYA hal yang `weather-client.ts` tidak dapat dari `/weathers/latest`
 *  (yang cuma snapshot 1 hari). Rainfall & humidity digabung dalam SATU
 *  call karena sama-sama dari `/weathers/daily` dengan device_id+date
 *  range identik — hindari 2 request terpisah ke endpoint yang sama. */
export async function fetchWeatherDailyChart(
  deviceId: string,
  companyId?: string,
): Promise<{ rainfall: WeatherChartPoint[]; humidity: WeatherChartPoint[] }> {
  const end = new Date();
  const start = subDays(end, CHART_DAYS - 1);

  const data = await fetchRawDaily(deviceId, start, end, companyId);

  // Backend bisa skip hari tanpa data sama sekali (bukan balikin null) —
  // dikonfirmasi uji langsung. Isi manual tiap tanggal dalam rentang biar
  // chart selalu 7 titik berurutan, tidak ada yang "hilang".
  const byDate = new Map(
    data.map((row) => [
      row.date,
      { rainfall: parseNumeric(row.sum_rainfall), humidity: parseHumidity(row) },
    ]),
  );

  const rainfall: WeatherChartPoint[] = [];
  const humidity: WeatherChartPoint[] = [];

  for (let i = 0; i < CHART_DAYS; i++) {
    const day = subDays(end, CHART_DAYS - 1 - i);
    const key = format(day, "yyyy-MM-dd");
    const label = format(day, "dd MMM");
    const row = byDate.get(key);
    // Hari tanpa hujan = 0mm valid secara semantik, default 0. Hari tanpa
    // data kelembapan BUKAN 0% (0% RH nyaris mustahil terjadi) — pakai
    // null/gap, Recharts otomatis putus garis (connectNulls default false).
    rainfall.push({ date: label, value: row?.rainfall ?? 0 });
    humidity.push({ date: label, value: row?.humidity ?? null });
  }

  return { rainfall, humidity };
}

/** Sumber chart temperatur harian halaman `/air-temperature` — beda dari
 *  `fetchWeatherDailyChart()`: rentang tanggalnya DIPILIH USER (bukan 7
 *  hari tetap), dipanggil per stasiun oleh `air-temperature-client.ts`
 *  (fan-out `Promise.all` multi-stasiun ada di sana, bukan di sini). Hari
 *  tanpa data = null/gap (bukan 0) — temperatur tidak punya makna "0 =
 *  wajar/valid" seperti curah hujan. */
export async function fetchTemperatureRange(
  deviceId: string,
  startDate: Date,
  endDate: Date,
  companyId?: string,
): Promise<WeatherChartPoint[]> {
  const data = await fetchRawDaily(deviceId, startDate, endDate, companyId);
  const byDate = new Map(data.map((row) => [row.date, parseTemperature(row)]));

  const dayCount = differenceInCalendarDays(endDate, startDate) + 1;
  const points: WeatherChartPoint[] = [];

  for (let i = 0; i < dayCount; i++) {
    const day = addDays(startDate, i);
    const key = format(day, "yyyy-MM-dd");
    const label = format(day, "dd MMM");
    points.push({ date: label, value: byDate.get(key) ?? null });
  }

  return points;
}

/** Sumber chart radiasi matahari harian halaman `/solar-radiation` — pola
 *  identik `fetchTemperatureRange()` (rentang tanggal dipilih user, fan-out
 *  multi-stasiun di `solar-radiation-client.ts`). Hari tanpa data =
 *  null/gap (bukan 0) — sama alasannya seperti temperatur. */
export async function fetchRadiationRange(
  deviceId: string,
  startDate: Date,
  endDate: Date,
  companyId?: string,
): Promise<WeatherChartPoint[]> {
  const data = await fetchRawDaily(deviceId, startDate, endDate, companyId);
  const byDate = new Map(data.map((row) => [row.date, parseRadiation(row)]));

  const dayCount = differenceInCalendarDays(endDate, startDate) + 1;
  const points: WeatherChartPoint[] = [];

  for (let i = 0; i < dayCount; i++) {
    const day = addDays(startDate, i);
    const key = format(day, "yyyy-MM-dd");
    const label = format(day, "dd MMM");
    points.push({ date: label, value: byDate.get(key) ?? null });
  }

  return points;
}

/** Sumber chart kelembapan relatif harian halaman `/relative-humidity` —
 *  pola identik `fetchTemperatureRange()`/`fetchRadiationRange()`/
 *  `fetchPressureRange()` (rentang tanggal dipilih user, fan-out multi-
 *  stasiun di `relative-humidity-client.ts`), reuse `parseHumidity()` yang
 *  sudah ada untuk kartu Beranda. Hari tanpa data = null/gap (bukan 0) —
 *  sama alasannya seperti temperatur. */
export async function fetchHumidityRange(
  deviceId: string,
  startDate: Date,
  endDate: Date,
  companyId?: string,
): Promise<WeatherChartPoint[]> {
  const data = await fetchRawDaily(deviceId, startDate, endDate, companyId);
  const byDate = new Map(data.map((row) => [row.date, parseHumidity(row)]));

  const dayCount = differenceInCalendarDays(endDate, startDate) + 1;
  const points: WeatherChartPoint[] = [];

  for (let i = 0; i < dayCount; i++) {
    const day = addDays(startDate, i);
    const key = format(day, "yyyy-MM-dd");
    const label = format(day, "dd MMM");
    points.push({ date: label, value: byDate.get(key) ?? null });
  }

  return points;
}

/** Sumber chart tekanan udara harian halaman `/air-pressure` — pola
 *  identik `fetchTemperatureRange()`/`fetchRadiationRange()` (rentang
 *  tanggal dipilih user, fan-out multi-stasiun di `air-pressure-client.ts`).
 *  Hari tanpa data = null/gap (bukan 0) — sama alasannya seperti temperatur. */
export async function fetchPressureRange(
  deviceId: string,
  startDate: Date,
  endDate: Date,
  companyId?: string,
): Promise<WeatherChartPoint[]> {
  const data = await fetchRawDaily(deviceId, startDate, endDate, companyId);
  const byDate = new Map(data.map((row) => [row.date, parsePressure(row)]));

  const dayCount = differenceInCalendarDays(endDate, startDate) + 1;
  const points: WeatherChartPoint[] = [];

  for (let i = 0; i < dayCount; i++) {
    const day = addDays(startDate, i);
    const key = format(day, "yyyy-MM-dd");
    const label = format(day, "dd MMM");
    points.push({ date: label, value: byDate.get(key) ?? null });
  }

  return points;
}

/** Sumber chart curah hujan harian halaman `/rainfall` — rentang tanggal
 *  dipilih user (beda dari `fetchWeatherDailyChart()` yang fixed 7 hari),
 *  fan-out multi-stasiun di `rainfall-daily-client.ts`. BEDA dari
 *  `fetchTemperatureRange()`/dst: hari tanpa data di-default **0**, bukan
 *  null/gap — konsisten `fetchWeatherDailyChart()` (baris ~136-139): curah
 *  hujan 0mm valid secara semantik, tidak seperti temperatur/radiasi/
 *  tekanan/kelembapan yang "0" tidak wajar dianggap default. */
export async function fetchRainfallRange(
  deviceId: string,
  startDate: Date,
  endDate: Date,
  companyId?: string,
): Promise<WeatherChartPoint[]> {
  const data = await fetchRawDaily(deviceId, startDate, endDate, companyId);
  const byDate = new Map(data.map((row) => [row.date, parseNumeric(row.sum_rainfall)]));

  const dayCount = differenceInCalendarDays(endDate, startDate) + 1;
  const points: WeatherChartPoint[] = [];

  for (let i = 0; i < dayCount; i++) {
    const day = addDays(startDate, i);
    const key = format(day, "yyyy-MM-dd");
    const label = format(day, "dd MMM");
    points.push({ date: label, value: byDate.get(key) ?? 0 });
  }

  return points;
}

/** Sumber chart kecepatan angin harian halaman `/wind-speed` — pola
 *  identik `fetchTemperatureRange()`/`fetchRadiationRange()`/
 *  `fetchPressureRange()` (rentang tanggal dipilih user, fan-out multi-
 *  stasiun di `wind-speed-daily-client.ts`). BEDA dari
 *  `fetchRainfallRange()`: hari tanpa data = null/gap (bukan 0) — field
 *  agregat harian kecepatan angin masih UNCONFIRMED (lihat
 *  `parseWindSpeed()`), tidak seperti `sum_rainfall` yang sudah
 *  dikonfirmasi reliable, jadi ikut konvensi null/gap seperti
 *  temperatur/radiasi/tekanan, bukan konvensi 0 seperti curah hujan. */
export async function fetchWindSpeedRange(
  deviceId: string,
  startDate: Date,
  endDate: Date,
  companyId?: string,
): Promise<WeatherChartPoint[]> {
  const data = await fetchRawDaily(deviceId, startDate, endDate, companyId);
  const byDate = new Map(data.map((row) => [row.date, parseWindSpeed(row)]));

  const dayCount = differenceInCalendarDays(endDate, startDate) + 1;
  const points: WeatherChartPoint[] = [];

  for (let i = 0; i < dayCount; i++) {
    const day = addDays(startDate, i);
    const key = format(day, "yyyy-MM-dd");
    const label = format(day, "dd MMM");
    points.push({ date: label, value: byDate.get(key) ?? null });
  }

  return points;
}

/** Sumber chart arah mata angin harian halaman `/wind-direction` — pola
 *  identik `fetchWindSpeedRange()` (rentang tanggal dipilih user, fan-out
 *  multi-stasiun di `wind-direction-daily-client.ts`, hari tanpa data =
 *  null/gap, field agregat harian UNCONFIRMED — lihat
 *  `parseWindDirection()`). Nilai tetap derajat mentah (0-360), BUKAN
 *  dikonversi ke teks 8-arah-mata-angin (`degreesToCompass()` di
 *  `lib/utils/index.ts`) — halaman detail ini menampilkan angka polos,
 *  konsisten sama gaya tampilan halaman detail cuaca lain. */
export async function fetchWindDirectionRange(
  deviceId: string,
  startDate: Date,
  endDate: Date,
  companyId?: string,
): Promise<WeatherChartPoint[]> {
  const data = await fetchRawDaily(deviceId, startDate, endDate, companyId);
  const byDate = new Map(data.map((row) => [row.date, parseWindDirection(row)]));

  const dayCount = differenceInCalendarDays(endDate, startDate) + 1;
  const points: WeatherChartPoint[] = [];

  for (let i = 0; i < dayCount; i++) {
    const day = addDays(startDate, i);
    const key = format(day, "yyyy-MM-dd");
    const label = format(day, "dd MMM");
    points.push({ date: label, value: byDate.get(key) ?? null });
  }

  return points;
}
