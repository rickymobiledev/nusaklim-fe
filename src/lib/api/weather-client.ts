import { ApiError } from "@/types/api";
import type { ApiItemResponse } from "@/types/api";
import type { WeatherMetric } from "@/types/domain";
import { createApiClient } from "./fetcher";
import { normalizeWeather } from "./adapters/weather-adapter";
import { fetchWeatherDailyChart } from "./weather-daily-client";
import { deriveRainfallStatus } from "./rainfall-status";
import { deriveHumidityStatus } from "./humidity-status";
import { deriveTemperatureStatus } from "./temperature-status";
import { deriveSolarRadiationStatus } from "./solar-radiation-status";
import { deriveAirPressureStatus } from "./air-pressure-status";
import { deriveWindSpeedStatus } from "./wind-speed-status";
import { deriveWindDirectionStatus } from "./wind-direction-status";
import { stationApi } from "./station-client";
import { extractBackendErrorMessage } from "./backend-error";
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
 *  keterbatasan sensor device asli, bukan bug. Curah Hujan, Kelembapan
 *  Relatif, Temperatur Udara, Radiasi Matahari, Tekanan Udara, Kecepatan
 *  Angin & Arah Mata Angin dapat data tambahan (`rainfallDetail`/
 *  `humidityDetail`/`temperatureDetail`/`solarRadiationDetail`/
 *  `airPressureDetail`/`windSpeedDetail`/`windDirectionDetail`: chart 7 hari
 *  + status) dari `/weathers/daily` (satu call gabungan) — lihat
 *  `weather-daily-client.ts` dan `*-status.ts` di folder yang sama. */
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
      metric.temperatureDetail = {
        chart: dailyChart.temperature,
        status: deriveTemperatureStatus(metric.airTemperature.value),
      };
      metric.solarRadiationDetail = {
        chart: dailyChart.radiation,
        status: deriveSolarRadiationStatus(metric.solarRadiation.value),
      };
      metric.airPressureDetail = {
        chart: dailyChart.pressure,
        status: deriveAirPressureStatus(metric.airPressure.value),
      };
      metric.windSpeedDetail = {
        chart: dailyChart.windSpeed,
        status: deriveWindSpeedStatus(metric.windSpeed.value),
      };
      metric.windDirectionDetail = {
        chart: dailyChart.windDirection,
        status: deriveWindDirectionStatus(metric.windDirection.value),
      };

      return { data: metric };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "WEATHER_FETCH_FAILED",
        extractBackendErrorMessage(err) ?? "Gagal terhubung ke server cuaca.",
      );
    }
  },
};
