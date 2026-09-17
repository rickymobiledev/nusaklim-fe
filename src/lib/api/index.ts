import { weatherClient } from "./weather-client";
import { waterBalanceClient } from "./water-balance-client";
import { sunshineDurationClient } from "./sunshine-duration-client";
import { vpdClient } from "./vpd-client";
import { drySpellReportClient } from "./dry-spell-report-client";
import { forecastClient } from "./forecast-client";
import { mockMonitoringApi } from "./mock/monitoring-api";
import { mockWaterDeficitComparisonApi } from "./mock/water-deficit-comparison-api";
import { waterDeficitClient } from "./water-deficit-client";
import { drySpellClient } from "./dry-spell-client";
import { rainfallTodayClient } from "./rainfall-today-client";
import { downloadClient } from "./download-client";
import { stationApi as stationClient } from "./station-client";
import { usersClient } from "./users-client";
import { companiesClient } from "./companies-client";
import { userRolesClient } from "./user-roles-client";
import type { StationApi } from "./station-api";
import type { WeatherApi } from "./weather-api";
import type { MonitoringApi } from "./monitoring-api";
import type { DownloadApi } from "./download-api";
import type { ForecastApi } from "./forecast-api";
import type { WaterDeficitApi } from "./water-deficit-api";
import type { DrySpellApi } from "./dry-spell-api";
import type { RainfallTodayApi } from "./rainfall-today-api";
import type { UsersApi } from "./users-api";
import type { CompaniesApi } from "./companies-api";
import type { UserRolesApi } from "./user-roles-api";

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
// SEMUA 4 method Monitoring sekarang real
// (`water-balance-client.ts`/`sunshine-duration-client.ts`/`vpd-client.ts`/
// `dry-spell-report-client.ts`, endpoint `GET /water_deficit?device_id=&year=` &
// `GET /solar_sunshine?device_id=&start_date=&end_date=` &
// `GET /vpd?device_id=&start_date=&end_date=` &
// `GET /dry_spell?device_id=&start_date=&end_date=` dikonfirmasi lewat
// curl ke backend asli) — spread `...mockMonitoringApi` di bawah jadi
// VESTIGIAL (semua method-nya ke-override), sengaja belum dibersihkan
// (di luar scope kalau nanti mau dirapikan, `mockMonitoringApi` masih
// bisa dipakai referensi pola mock kalau ada domain Monitoring baru).
// `drySpellReportClient` di sini BEDA dari `drySpellClient`/`drySpellApi`
// di bawah (itu punya tab Peta, endpoint company-wide `/devices/dry_spell?company_code=&year=`
// — JANGAN disamakan atau digabung).
export const monitoringApi: MonitoringApi = {
  ...mockMonitoringApi,
  getWaterBalance: waterBalanceClient.getWaterBalance,
  getSunshineDuration: sunshineDurationClient.getSunshineDuration,
  getVPD: vpdClient.getVPD,
  getDrySpell: drySpellReportClient.getDrySpell,
};
// Real via `/weathers/daily` (harian) + `/weathers/filter` (10 menit/pagi/
// siang/malam), dikonfirmasi lewat tes langsung ke backend asli —
// `mock/download-api.ts` dibiarkan ada tapi VESTIGIAL (tidak dipakai lagi),
// pola sama `mockMonitoringApi` di atas.
export const downloadApi: DownloadApi = downloadClient;
// Real via `POST /forecast` (body form `station_id`), dikonfirmasi lewat
// curl langsung ke backend asli — `mock/forecast-api.ts` dibiarkan
// ada tapi VESTIGIAL (tidak dipakai lagi), pola sama `mockMonitoringApi`/
// `mock/download-api.ts` di atas.
export const forecastApi: ForecastApi = forecastClient;
export const waterDeficitApi: WaterDeficitApi = waterDeficitClient;
// TODO: belum ada endpoint BE terkonfirmasi untuk panel "Perbandingan
// Defisit Air" (WaterDeficitPanel.tsx) — beda dari `waterDeficitApi` di
// atas (peta, sudah real). Ganti begitu kontraknya ada, lihat catatan di
// mock/water-deficit-comparison-api.ts.
export const waterDeficitComparisonApi: WaterDeficitApi = mockWaterDeficitComparisonApi;
export const drySpellApi: DrySpellApi = drySpellClient;
export const rainfallTodayApi: RainfallTodayApi = rainfallTodayClient;
// Domain "Manajemen Pengguna" (admin-only) — 100% real sejak awal, tidak
// pernah ada jalur mock (`GET/POST/PUT/DELETE /users`, `GET /companies`,
// `GET /user_roles`, dikonfirmasi curl langsung ke backend asli).
export const usersApi: UsersApi = usersClient;
export const companiesApi: CompaniesApi = companiesClient;
export const userRolesApi: UserRolesApi = userRolesClient;
