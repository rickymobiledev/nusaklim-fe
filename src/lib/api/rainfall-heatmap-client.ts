import { ApiError } from "@/types/api";
import { createApiClient } from "./fetcher";
import { extractBackendErrorMessage } from "./backend-error";

export interface RawRainfallHeatmapItem {
  date: string;
  rainfall: number;
}

export interface RawRainfallHeatmapData {
  weather_station_id: string | number;
  weather_station_name: string;
  year: string | number;
  month: string | number;
  weathers: RawRainfallHeatmapItem[];
}

interface Envelope<T> {
  status: boolean;
  message?: string;
  data: T;
}

function toApiError(err: unknown, fallback: string): ApiError {
  if (err instanceof ApiError) return err;
  return new ApiError(
    "RAINFALL_HEATMAP_FETCH_FAILED",
    extractBackendErrorMessage(err) ?? fallback,
  );
}

/** Hit `GET /dashboards/rainfall_heatmap` di backend Nusaklim (prefixed `/api/v2`)
 *  Params: `weather_station_id`, `year`, `month`. */
export async function fetchRainfallHeatmap(
  weatherStationId: string,
  year: number,
  month: number,
  companyCode?: string,
): Promise<RawRainfallHeatmapData> {
  try {
    const client = createApiClient(companyCode);
    const res = await client.get<Envelope<RawRainfallHeatmapData>>(
      "/dashboards/rainfall_heatmap",
      {
        params: {
          weather_station_id: weatherStationId,
          year,
          month,
        },
      },
    );

    if (!res.data.status) {
      throw new ApiError(
        "RAINFALL_HEATMAP_FETCH_FAILED",
        res.data.message || "Gagal mengambil data heatmap curah hujan.",
      );
    }

    return res.data.data;
  } catch (err) {
    throw toApiError(err, "Gagal terhubung ke server heatmap curah hujan.");
  }
}
