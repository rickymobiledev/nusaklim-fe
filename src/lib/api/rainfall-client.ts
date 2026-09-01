import { format, subDays } from "date-fns";
import { ApiError } from "@/types/api";
import type { WeatherChartPoint } from "@/types/domain";
import { createApiClient } from "./fetcher";

const CHART_DAYS = 7;

/** Satu baris per hari dari `GET /weathers/daily` — dikonfirmasi reliable
 *  lintas brand (field `rainfall` ada di raw payload semua brand). */
interface RawWeatherDaily {
  date: string; // "YYYY-MM-DD"
  sum_rainfall: number | string | null;
}

function parseRainfall(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const n = typeof raw === "number" ? raw : parseFloat(String(raw));
  return Number.isFinite(n) ? n : null;
}

/** Sumber chart 7 hari kartu Curah Hujan — SATU-SATUNYA hal yang
 *  `weather-client.ts` tidak dapat dari `/weathers/latest` (yang cuma
 *  snapshot 1 hari). Value/min/max Curah Hujan sendiri sudah termasuk di
 *  `/weathers/latest` (lihat `weather-adapter.ts`), TIDAK perlu
 *  request kedua khusus rainfall lagi. Error SENGAJA tidak
 *  ditangkap/di-fallback — biar gagal (`ApiError`), konsisten kebijakan
 *  Stasiun "tidak ada jalur mock sama sekali". */
export async function fetchRainfallChart(
  deviceId: string,
  companyId?: string,
): Promise<WeatherChartPoint[]> {
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
      "RAINFALL_CHART_FETCH_FAILED",
      res.data.message || "Gagal mengambil tren curah hujan.",
    );
  }

  // Backend bisa skip hari tanpa data sama sekali (bukan balikin null) —
  // dikonfirmasi uji langsung. Isi manual tiap tanggal dalam rentang biar
  // chart selalu 7 titik berurutan, tidak ada yang "hilang".
  const byDate = new Map(
    res.data.data.map((row) => [row.date, parseRainfall(row.sum_rainfall)]),
  );

  return Array.from({ length: CHART_DAYS }, (_, i) => {
    const day = subDays(end, CHART_DAYS - 1 - i);
    const key = format(day, "yyyy-MM-dd");
    return { date: format(day, "dd MMM"), value: byDate.get(key) ?? 0 };
  });
}
