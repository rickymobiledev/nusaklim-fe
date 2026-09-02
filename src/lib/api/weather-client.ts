import { ApiError } from "@/types/api";
import type { ApiItemResponse } from "@/types/api";
import type { WeatherMetric } from "@/types/domain";
import { createApiClient } from "./fetcher";
import { normalizeWeather } from "./adapters/weather-adapter";
import { fetchWeatherDailyChart } from "./weather-daily-client";
import { deriveRainfallStatus } from "./rainfall-status";
import { deriveHumidityStatus } from "./humidity-status";
import { stationApi } from "./station-client";
import type { WeatherApi } from "./weather-api";

async function fetchRawLatest(
  deviceId: string,
  companyId?: string,
): Promise<Record<string, unknown>> {
  const client = createApiClient(companyId);
  const res = await client.get<{
    status: boolean;
    message: string;
    data: Record<string, unknown>;
  }>("/weathers/latest", { params: { device_id: deviceId } });

  if (!res.data.status) {
    throw new ApiError(
      "WEATHER_FETCH_FAILED",
      res.data.message || "Gagal mengambil data cuaca.",
    );
  }

  return res.data.data;
}

/** Satu-satunya implementasi Weather — sudah 100% backend asli, tidak ada
 *  cabang mock lagi (persis presedan Stasiun). `normalizeWeather()`
 *  (`weather-adapter.ts`) tidak lagi peduli `station.brand` — field yang
 *  tidak tersedia di raw payload device jadi `null` (UI render "--"), itu
 *  keterbatasan sensor device asli, bukan bug. Curah Hujan & Kelembapan
 *  Relatif dapat data tambahan (`rainfallDetail`/`humidityDetail`: chart
 *  7 hari + status) dari `/weathers/daily` (satu call gabungan) — lihat
 *  `weather-daily-client.ts`/`rainfall-status.ts`/`humidity-status.ts`. */
export const weatherClient: WeatherApi = {
  async getWeatherMetrics(
    stationId: string,
    companyId?: string,
  ): Promise<ApiItemResponse<WeatherMetric>> {
    if (!stationId) {
      return { data: normalizeWeather({}, "") };
    }

    try {
      const { data: station } = await stationApi.getStationDetail(stationId, companyId);

      const [raw, dailyChart] = await Promise.all([
        fetchRawLatest(station.id, companyId),
        fetchWeatherDailyChart(station.id, companyId),
      ]);

      const metric = normalizeWeather(raw, station.id);
      metric.rainfallDetail = {
        chart: dailyChart.rainfall,
        status: deriveRainfallStatus(metric.rainfall.value),
      };
      metric.humidityDetail = {
        chart: dailyChart.humidity,
        status: deriveHumidityStatus(metric.airHumidity.value),
      };

      return { data: metric };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError("NETWORK_ERROR", "Gagal terhubung ke server cuaca.");
    }
  },
};
