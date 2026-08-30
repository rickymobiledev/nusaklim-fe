import type { ApiItemResponse } from "@/types/api";
import type { ForecastDay, ForecastResult } from "@/types/ramalan-cuaca";
import type { RamalanCuacaApi } from "../ramalan-cuaca-api";
import { stationApi } from "../station-client";
import { delay } from "./delay";

/** Nilai contoh mengikuti pola response BE existing (lihat Postman
 *  "Nusaklim" > Forecast) — REFERENSI kontrak, bukan wire format final,
 *  karena model DL baru masih dibangun tim Data Analyst. */
const MOCK_FORECAST_DAYS: ForecastDay[] = [
  {
    date: "2026-08-19",
    temperature: 26.8,
    humidity: 88,
    radiation: 22.74,
    rainfall: 1.9,
    airPressure: 1010,
    windSpeed: 0.87,
    windDirectionDeg: 213,
  },
  {
    date: "2026-08-20",
    temperature: 27.3,
    humidity: 84,
    radiation: 20.11,
    rainfall: 0.1,
    airPressure: 1009.9,
    windSpeed: 1.1,
    windDirectionDeg: 180,
  },
  {
    date: "2026-08-21",
    temperature: 27.7,
    humidity: 83,
    radiation: 21.43,
    rainfall: 0,
    airPressure: 1009.1,
    windSpeed: 1.23,
    windDirectionDeg: 238,
  },
  {
    date: "2026-08-22",
    temperature: 27.7,
    humidity: 86,
    radiation: 22.9,
    rainfall: 2.5,
    airPressure: 1009.2,
    windSpeed: 1.33,
    windDirectionDeg: 270,
  },
  {
    date: "2026-08-23",
    temperature: 26.7,
    humidity: 89,
    radiation: 22.78,
    rainfall: 3.2,
    airPressure: 1009.8,
    windSpeed: 1.24,
    windDirectionDeg: 180,
  },
  {
    date: "2026-08-24",
    temperature: 25.7,
    humidity: 92,
    radiation: 19.68,
    rainfall: 4.7,
    airPressure: 1010,
    windSpeed: 1.18,
    windDirectionDeg: 213,
  },
  {
    date: "2026-08-25",
    temperature: 25.9,
    humidity: 90,
    radiation: 20.77,
    rainfall: 3,
    airPressure: 1009.7,
    windSpeed: 1.08,
    windDirectionDeg: 225,
  },
];

const MOCK_UNITS: Record<string, string> = {
  temperature: "°C",
  humidity: "%",
  radiation: "MJ/m²",
  rainfall: "mm",
  airPressure: "hPa",
  windSpeed: "m/s",
};

export const mockRamalanCuacaApi: RamalanCuacaApi = {
  async getForecast(
    stationId: string,
    companyId?: string,
  ): Promise<ApiItemResponse<ForecastResult>> {
    await delay();

    // Belum ada stasiun dipilih di UI — tampilkan tabel kosong, jangan error.
    if (!stationId) {
      return {
        data: {
          stationId: "",
          stationName: "",
          latitude: 0,
          longitude: 0,
          timezone: "Asia/Jakarta",
          forecast: [],
          units: MOCK_UNITS,
        },
      };
    }

    // Reuse data stasiun dari stationApi (juga otomatis throw
    // STATION_NOT_FOUND untuk id yang tidak valid ATAU beda company)
    // supaya tidak duplikasi data stasiun / guard company di sini.
    const { data: station } = await stationApi.getStationDetail(stationId, companyId);

    return {
      data: {
        stationId: station.id,
        stationName: station.nama,
        latitude: station.lat,
        longitude: station.long,
        timezone: "Asia/Jakarta",
        forecast: MOCK_FORECAST_DAYS,
        units: MOCK_UNITS,
      },
    };
  },
};
