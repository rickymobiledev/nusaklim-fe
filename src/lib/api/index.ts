import { mockStationApi } from "./mock/station-api";
import { mockWeatherApi } from "./mock/weather-api";
import { mockMonitoringApi } from "./mock/monitoring-api";
import { mockDownloadApi } from "./mock/download-api";
import { mockRamalanCuacaApi } from "./mock/ramalan-cuaca-api";
import type { StationApi } from "./station-api";
import type { WeatherApi } from "./weather-api";
import type { MonitoringApi } from "./monitoring-api";
import type { DownloadApi } from "./download-api";
import type { RamalanCuacaApi } from "./ramalan-cuaca-api";

/**
 * Satu titik wiring — hooks import instance dari sini, bukan dari
 * `mock/*` langsung. Begitu kontrak backend asli utk domain ini
 * dikonfirmasi, tinggal buat `real/station-api.ts` dkk yang implement
 * interface yang sama lalu ganti baris di bawah (mis.
 * `USE_MOCK ? mockStationApi : realStationApi`) — hooks tidak perlu
 * berubah sama sekali.
 */
export const stationApi: StationApi = mockStationApi;
export const weatherApi: WeatherApi = mockWeatherApi;
export const monitoringApi: MonitoringApi = mockMonitoringApi;
export const downloadApi: DownloadApi = mockDownloadApi;
export const ramalanCuacaApi: RamalanCuacaApi = mockRamalanCuacaApi;
