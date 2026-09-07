import type { StationWaterDeficit } from "@/types/domain";

/**
 * Bentuk mentah `GET /devices/water_deficit` (dikonfirmasi dari Postman
 * collection tim BE, folder "Maps" > "Water Deficit") — cuma field yang
 * benar-benar dipetakan ke `StationWaterDeficit` yang dideklarasikan di
 * sini, field lain (`company_image_url`, `created_at`, `updated_at`,
 * `company_created_at`, `company_updated_at`, dst) sengaja diabaikan
 * sama seperti pola `RawDevice` di `station-adapter.ts`.
 *
 * `water_deficit` array bisa KOSONG (`[]`) untuk device tanpa data bulan
 * itu, ATAU ada tapi semua `value` null — keduanya di-treat sama oleh
 * `mapRawDeviceToWaterDeficit` (lihat catatan di `types/domain.ts`).
 */
export interface RawWaterDeficitDevice {
  id: string;
  name: string;
  brand: string;
  latitude: string;
  longitude: string;
  company_code: string;
  company_name: string;
  water_deficit: { component: string; value: string | null }[];
}

function parseComponentValue(value: string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** `sinkronisasiTerakhir` TIDAK ada di payload `water_deficit` asli.
 *  DULU di-join dari `stationApi.getStations()` (lihat
 *  `water-deficit-client.ts`), TAPI diganti jadi waktu-request-sekarang
 *  (`new Date().toISOString()`) — sama persis alasan & pola di
 *  `dry-spell-adapter.ts` (`mapRawDeviceToDrySpell`): menghilangkan 1
 *  request bersamaan ke `/devices/status`, endpoint yang terbukti lambat
 *  kalau kena concurrency (lihat `CLAUDE.md`). Konsekuensi: field ini
 *  BUKAN waktu sync asli device, cuma timestamp saat data di-fetch. */
export function mapRawDeviceToWaterDeficit(
  raw: RawWaterDeficitDevice,
): StationWaterDeficit {
  const byComponent = new Map(raw.water_deficit.map((c) => [c.component, c.value]));

  return {
    stationId: raw.id,
    nama: raw.name,
    brand: raw.brand,
    lat: Number(raw.latitude),
    long: Number(raw.longitude),
    companyCode: raw.company_code,
    companyName: raw.company_name,
    curahHujan: parseComponentValue(byComponent.get("CURAH_HUJAN")),
    defisitAir: parseComponentValue(byComponent.get("DEFISIT_AIR")),
    hariHujan: parseComponentValue(byComponent.get("HARI_HUJAN")),
    kelebihanAir: parseComponentValue(byComponent.get("KELEBIHAN_AIR")),
    sinkronisasiTerakhir: new Date().toISOString(),
  };
}
