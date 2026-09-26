import { ApiError } from "@/types/api";
import { createApiClient } from "./fetcher";
import { extractBackendErrorMessage } from "./backend-error";

export interface DashboardWaterBalanceData {
  year: string;
  total_rainfall: string;
  total_rainy_day: string;
  total_water_deficit: string;
  total_water_surplus: string;
  insight: string;
}

export interface DashboardDrySpellData {
  total_dry_spell: string;
  date: string;
  insight: string;
}

export interface DashboardSunshineDurationData {
  date: string;
  total_solar_sunshine_duration: string;
  min_threshold: string;
  insight: string;
}

export interface DashboardVpdData {
  date: string;
  vpd: string;
  max_threshold: string;
  insight: string;
}

interface Envelope<T> {
  status?: boolean;
  message?: string;
  data: T;
}

function toApiError(err: unknown, fallback: string): ApiError {
  if (err instanceof ApiError) return err;
  return new ApiError(
    "DASHBOARD_SIDEBAR_FETCH_FAILED",
    extractBackendErrorMessage(err) ?? fallback,
  );
}

function extractPayload<T>(rawData: Envelope<T> | T): T {
  if (rawData && typeof rawData === "object") {
    if ("status" in rawData && rawData.status === false) {
      throw new ApiError(
        "DASHBOARD_SIDEBAR_FETCH_FAILED",
        rawData.message || "Gagal mengambil data dashboard.",
      );
    }
    if ("data" in rawData && rawData.data) {
      return rawData.data;
    }
  }
  return rawData as T;
}

/** Hit `GET /dashboards/water_balance?weather_station_id=...` */
export async function fetchDashboardWaterBalance(
  weatherStationId: string,
  companyCode?: string,
): Promise<DashboardWaterBalanceData> {
  try {
    const client = createApiClient(companyCode);
    const res = await client.get<Envelope<DashboardWaterBalanceData> | DashboardWaterBalanceData>(
      "/dashboards/water_balance",
      {
        params: { weather_station_id: weatherStationId },
      },
    );
    return extractPayload(res.data);
  } catch (err) {
    throw toApiError(err, "Gagal terhubung ke server keseimbangan air.");
  }
}

/** Hit `GET /dashboards/dry_spell?weather_station_id=...` */
export async function fetchDashboardDrySpell(
  weatherStationId: string,
  companyCode?: string,
): Promise<DashboardDrySpellData> {
  try {
    const client = createApiClient(companyCode);
    const res = await client.get<Envelope<DashboardDrySpellData> | DashboardDrySpellData>(
      "/dashboards/dry_spell",
      {
        params: { weather_station_id: weatherStationId },
      },
    );
    return extractPayload(res.data);
  } catch (err) {
    throw toApiError(err, "Gagal terhubung ke server deret hari terpanjang.");
  }
}

/** Hit `GET /dashboards/solar_sunshine_duration?weather_station_id=...` */
export async function fetchDashboardSunshineDuration(
  weatherStationId: string,
  companyCode?: string,
): Promise<DashboardSunshineDurationData> {
  try {
    const client = createApiClient(companyCode);
    const res = await client.get<
      Envelope<DashboardSunshineDurationData> | DashboardSunshineDurationData
    >("/dashboards/solar_sunshine_duration", {
      params: { weather_station_id: weatherStationId },
    });
    return extractPayload(res.data);
  } catch (err) {
    throw toApiError(err, "Gagal terhubung ke server lama penyinaran.");
  }
}

/** Hit `GET /dashboards/vpd?weather_station_id=...` */
export async function fetchDashboardVpd(
  weatherStationId: string,
  companyCode?: string,
): Promise<DashboardVpdData> {
  try {
    const client = createApiClient(companyCode);
    const res = await client.get<Envelope<DashboardVpdData> | DashboardVpdData>(
      "/dashboards/vpd",
      {
        params: { weather_station_id: weatherStationId },
      },
    );
    return extractPayload(res.data);
  } catch (err) {
    throw toApiError(err, "Gagal terhubung ke server VPD.");
  }
}
