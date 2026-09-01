import { weatherClient } from "./weather-client";
import { mockMonitoringApi } from "./mock/monitoring-api";
import { mockDownloadApi } from "./mock/download-api";
import { mockRamalanCuacaApi } from "./mock/ramalan-cuaca-api";
import { stationApi as stationClient } from "./station-client";
import type { StationApi } from "./station-api";
import type { WeatherApi } from "./weather-api";
import type { MonitoringApi } from "./monitoring-api";
import type { DownloadApi } from "./download-api";
import type { RamalanCuacaApi } from "./ramalan-cuaca-api";

/**
 * Satu titik wiring — hooks import instance dari sini, bukan dari
 * `mock/*` langsung. Stasiun (`station-client.ts`) & Weather
 * (`weather-client.ts`) sudah 100% real, tidak ada varian mock lagi buat
 * kedua domain ini. Domain lain masih hardcode data contoh, tinggal buat
 * `<domain>-client.ts` yang implement interface yang sama lalu ganti
 * baris di bawah begitu kontrak backend-nya dikonfirmasi — hooks tidak
 * perlu berubah sama sekali.
 */
export const stationApi: StationApi = stationClient;
export const weatherApi: WeatherApi = weatherClient;
export const monitoringApi: MonitoringApi = mockMonitoringApi;
export const downloadApi: DownloadApi = mockDownloadApi;
export const ramalanCuacaApi: RamalanCuacaApi = mockRamalanCuacaApi;
