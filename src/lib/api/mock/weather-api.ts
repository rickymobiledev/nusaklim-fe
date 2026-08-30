import type { ApiItemResponse } from "@/types/api";
import type { WeatherMetric } from "@/types/domain";
import type { WeatherApi } from "../weather-api";
import { normalizeWeatherByBrand } from "../adapters/weather-brand-adapter";
import { stationApi } from "../station-client";
import { delay } from "./delay";

/** Payload mentah contoh persis nilai dari Postman "Nusaklim" > Weathers >
 *  Latest — REFERENSI kontrak per brand, bukan wire format final. */
const RAW_WEATHER_BY_BRAND: Record<string, Record<string, unknown>> = {
  "Davis Instruments": {
    datetime: "01-11-2023 11:40",
    temperature: "30",
    humidity: "79",
    rainfall: "0",
    radiation: "802",
    air_pressure: "1001",
    wind_speed: "1",
    wind_direction: "123",
    index_uv: "9",
  },
  "Meteo Nusantara Instrumen": {
    id: "131856",
    device_id: "410",
    datetime: "01-11-2023 11:40",
    rainfall: "0",
    voltage: "13.3",
  },
  "Merapi Tani Instrumen": {
    rainfall: 0,
    air_humidity: 84.5,
    air_temperature: 28.68,
    datetime: "2023-10-30 22:00",
  },
};

export const mockWeatherApi: WeatherApi = {
  async getWeatherMetrics(
    stationId: string,
    companyId?: string,
  ): Promise<ApiItemResponse<WeatherMetric>> {
    await delay();

    // Belum ada stasiun dipilih di UI — tampilkan kartu kosong, jangan error.
    if (!stationId) {
      return { data: normalizeWeatherByBrand("", {}, "") };
    }

    // getStationDetail sudah throw STATION_NOT_FOUND kalau companyId beda.
    const { data: station } = await stationApi.getStationDetail(stationId, companyId);
    const raw = RAW_WEATHER_BY_BRAND[station.brand] ?? {};

    return { data: normalizeWeatherByBrand(station.brand, raw, station.id) };
  },
};
