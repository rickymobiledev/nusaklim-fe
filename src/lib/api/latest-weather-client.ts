import { ApiError } from "@/types/api";
import { createApiClient } from "./fetcher";
import { extractBackendErrorMessage } from "./backend-error";

export interface LatestWeatherDayItem {
  date: string;
  average?: string;
  sum?: string;
  average_direction?: string;
}

export interface LatestWeatherItem {
  weather_parameter:
    | "temperature"
    | "humidity"
    | "rainfall"
    | "solar_radiation"
    | "air_pressure"
    | "wind_speed"
    | "wind_direction"
    | string;
  name: string;
  latest_10_min: string;
  min_today?: string;
  max_today?: string;
  avg_today?: string;
  latest_10_min_direction?: string;
  avg_today_direction?: string;
  last_3_days: LatestWeatherDayItem[];
  interpretation: string;
}

export interface LatestWeatherData {
  weather_station_id: string;
  weather_station_name: string;
  last_sync: string;
  weathers: LatestWeatherItem[];
}

interface Envelope<T> {
  status?: boolean;
  message?: string;
  data?: T;
}

function toApiError(err: unknown, fallback: string): ApiError {
  if (err instanceof ApiError) return err;
  return new ApiError(
    "LATEST_WEATHER_FETCH_FAILED",
    extractBackendErrorMessage(err) ?? fallback,
  );
}

/** Hit `GET /dashboards/latest_weather` di backend Nusaklim (prefixed `/api/v2`)
 *  Params: `weather_station_id`. */
export async function fetchLatestWeather(
  weatherStationId: string,
  companyCode?: string,
): Promise<LatestWeatherData> {
  try {
    const client = createApiClient(companyCode);
    const res = await client.get<Envelope<LatestWeatherData> | LatestWeatherData>(
      "/dashboards/latest_weather",
      {
        params: {
          weather_station_id: weatherStationId,
        },
      },
    );

    // Tangani respons yang dibungkus { status, data: { ... } } maupun objek langsung
    const rawData = res.data;
    if ("status" in rawData && rawData.status === false) {
      throw new ApiError(
        "LATEST_WEATHER_FETCH_FAILED",
        rawData.message || "Gagal mengambil data cuaca terkini.",
      );
    }

    const payload =
      "data" in rawData && rawData.data ? rawData.data : (rawData as LatestWeatherData);

    return payload;
  } catch (err) {
    throw toApiError(err, "Gagal terhubung ke server cuaca terkini.");
  }
}
