import type { StationRainfallToday } from "@/types/domain";

/**
 * Bentuk mentah `GET /devices/rainfall_today` (dikonfirmasi lewat tes
 * langsung ke endpoint asli) — cuma field yang benar-benar dipetakan ke
 * `StationRainfallToday` yang dideklarasikan di sini, field lain
 * (`created_at`, `updated_at`, `company_id`, `company_image_url`,
 * `company_created_at`, `company_updated_at`, dst) sengaja diabaikan
 * sama seperti pola `RawDrySpellDevice`/`RawWaterDeficitDevice`.
 *
 * `rainfall` STRING (bukan number) — salah satu device (brand "Meteo
 * Nusantara Instrumen"/ARR) pernah balikin literal `"---"` sebagai
 * sentinel "tidak ada data", lihat `parseRainfallValue()`.
 *
 * `is_rain` boolean untuk stasiun aktif, tapi STRING `"---"` (bukan
 * boolean) untuk stasiun yang tidak aktif hari ini — dikonfirmasi tes
 * langsung dan tim BE (`rainfall` ikut `"---"`).
 */
export interface RawRainfallTodayDevice {
  id: string;
  name: string;
  brand: string;
  latitude: string;
  longitude: string;
  company_code: string;
  company_name: string;
  rainfall: string;
  is_rain: boolean | string;
}

/** `Number("---")` = `NaN` — sentinel "tidak ada data" yang dikonfirmasi
 *  dari response asli (device brand ARR), di-treat sama seperti device
 *  tanpa nilai (`null`), bukan 0. */
function parseRainfallValue(raw: string): number | null {
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** `sinkronisasiTerakhir` TIDAK ada di payload `rainfall_today` asli —
 *  SENGAJA diisi waktu request saat ini (`new Date().toISOString()`),
 *  BUKAN hasil join ke `stationApi.getStations()` — pola & alasan yang
 *  sama persis `mapRawDeviceToDrySpell`/`mapRawDeviceToWaterDeficit`
 *  (menghindari 1 request bersamaan tambahan ke `/devices/status`, lihat
 *  `CLAUDE.md`). */
export function mapRawDeviceToRainfallToday(
  raw: RawRainfallTodayDevice,
): StationRainfallToday {
  return {
    stationId: raw.id,
    nama: raw.name,
    brand: raw.brand,
    lat: Number(raw.latitude),
    long: Number(raw.longitude),
    companyCode: raw.company_code,
    companyName: raw.company_name,
    curahHujan: parseRainfallValue(raw.rainfall),
    // Bukan boolean (`"---"`) = stasiun tidak aktif → `null`.
    isHujan: typeof raw.is_rain === "boolean" ? raw.is_rain : null,
    sinkronisasiTerakhir: new Date().toISOString(),
  };
}
