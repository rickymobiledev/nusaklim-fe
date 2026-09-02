import { format, subDays } from "date-fns";
import { ApiError } from "@/types/api";
import type { WeatherChartPoint } from "@/types/domain";
import { createApiClient } from "./fetcher";

const CHART_DAYS = 7;

/** Satu baris per hari dari `GET /weathers/daily` — dikonfirmasi reliable
 *  lintas brand utk `sum_rainfall` (field ada di raw payload semua brand).
 *  Field kelembapan (avg_humidity dkk) BELUM dikonfirmasi ada di payload
 *  asli — lihat parseHumidity(). */
interface RawWeatherDaily {
  date: string; // "YYYY-MM-DD"
  sum_rainfall: number | string | null;
  // UNCONFIRMED terhadap backend asli — nama field agregat harian
  // kelembapan belum diverifikasi (beda dgn sum_rainfall yang sudah
  // dikonfirmasi). Coba beberapa alias umum, fallback null kalau semua
  // tidak ada. TODO: konfirmasi ke tim BE/Data Analyst.
  avg_humidity?: number | string | null;
  humidity?: number | string | null;
  mean_humidity?: number | string | null;
}

function parseNumeric(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const n = typeof raw === "number" ? raw : parseFloat(String(raw));
  return Number.isFinite(n) ? n : null;
}

function parseHumidity(row: RawWeatherDaily): number | null {
  return parseNumeric(row.avg_humidity ?? row.humidity ?? row.mean_humidity);
}

/** Sumber chart 7 hari kartu Curah Hujan & Kelembapan Relatif — SATU-
 *  SATUNYA hal yang `weather-client.ts` tidak dapat dari `/weathers/latest`
 *  (yang cuma snapshot 1 hari). Rainfall & humidity digabung dalam SATU
 *  call karena sama-sama dari `/weathers/daily` dengan device_id+date
 *  range identik — hindari 2 request terpisah ke endpoint yang sama.
 *  Value/min/max saat ini kedua metrik sudah termasuk di
 *  `/weathers/latest` (lihat `weather-adapter.ts`). Error SENGAJA tidak
 *  ditangkap/di-fallback — biar gagal (`ApiError`), konsisten kebijakan
 *  Stasiun "tidak ada jalur mock sama sekali". */
export async function fetchWeatherDailyChart(
  deviceId: string,
  companyId?: string,
): Promise<{ rainfall: WeatherChartPoint[]; humidity: WeatherChartPoint[] }> {
  const client = createApiClient(companyId);
  const end = new Date();
  const start = subDays(end, CHART_DAYS - 1);

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

  // Backend bisa skip hari tanpa data sama sekali (bukan balikin null) —
  // dikonfirmasi uji langsung. Isi manual tiap tanggal dalam rentang biar
  // chart selalu 7 titik berurutan, tidak ada yang "hilang".
  const byDate = new Map(
    res.data.data.map((row) => [
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
