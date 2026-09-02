import { format, subDays, addDays, differenceInCalendarDays } from "date-fns";
import { ApiError } from "@/types/api";
import type { WeatherChartPoint } from "@/types/domain";
import { createApiClient } from "./fetcher";

const CHART_DAYS = 7;

/** Satu baris per hari dari `GET /weathers/daily` — dikonfirmasi reliable
 *  lintas brand utk `sum_rainfall` (field ada di raw payload semua brand).
 *  Field kelembapan (avg_humidity dkk) BELUM dikonfirmasi ada di payload
 *  asli — lihat parseHumidity(). Field temperatur JUGA belum dikonfirmasi
 *  (dipakai halaman /air-temperature) — lihat parseTemperature(). */
interface RawWeatherDaily {
  date: string; // "YYYY-MM-DD"
  sum_rainfall: number | string | null;
  // UNCONFIRMED terhadap backend asli — nama field agregat harian
  // kelembapan belum diverifikasi (beda dgn sum_rainfall yang sudah
  // dikonfirmasi). Coba beberapa alias umum, fallback null kalau semua
  // tidak ada. TODO: konfirmasi ke tim BE/Data Analyst.
  average_humidity?: number | string | null;
  // UNCONFIRMED terhadap backend asli — nama field agregat harian
  // temperatur belum diverifikasi (situasi sama seperti average_humidity
  // di atas). Coba beberapa alias umum, fallback null kalau semua tidak
  // ada. TODO: konfirmasi ke tim BE/Data Analyst begitu akses backend
  // real tersedia.
  average_temperature?: number | string | null;
  avg_temperature?: number | string | null;
  mean_temperature?: number | string | null;
}

function parseNumeric(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const n = typeof raw === "number" ? raw : parseFloat(String(raw));
  return Number.isFinite(n) ? n : null;
}

function parseHumidity(row: RawWeatherDaily): number | null {
  return parseNumeric(row.average_humidity);
}

function parseTemperature(row: RawWeatherDaily): number | null {
  return parseNumeric(
    row.average_temperature ?? row.avg_temperature ?? row.mean_temperature,
  );
}

/** Request mentah ke `/weathers/daily` untuk SATU device — dipakai baik
 *  oleh `fetchWeatherDailyChart()` (window 7 hari tetap, kartu Beranda)
 *  maupun `fetchTemperatureRange()` (window custom dari user, halaman
 *  `/air-temperature`). Error SENGAJA tidak ditangkap/di-fallback — biar
 *  gagal (`ApiError`), konsisten kebijakan Stasiun/Weather "tidak ada
 *  jalur mock sama sekali". */
async function fetchRawDaily(
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
