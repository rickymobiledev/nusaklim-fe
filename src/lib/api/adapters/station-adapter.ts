import type { Station } from "@/types/domain";

/**
 * Bentuk mentah `GET /devices/status` (dikonfirmasi dari sample response
 * asli tim BE) — cuma field yang benar-benar dipetakan ke `Station` yang
 * dideklarasikan di sini, field lain (`company_image_url`,
 * `company_created_at`, `company_updated_at`, `type`, dst) sengaja
 * diabaikan karena tidak ada di tipe domain kita dan tidak dipakai UI.
 */
export interface RawDevice {
  id: string;
  name: string;
  brand: string;
  latitude: string;
  longitude: string;
  company_code: string;
  company_name: string;
  status: string; // "ON" | "OFF" dari BE (uppercase)
  last_sync_time: string | null; // "YYYY-MM-DD HH:mm", bukan ISO
}

export function mapDeviceToStation(raw: RawDevice): Station {
  return {
    id: raw.id,
    nama: raw.name,
    brand: raw.brand,
    companyCode: raw.company_code,
    companyName: raw.company_name,
    lat: Number(raw.latitude),
    long: Number(raw.longitude),
    status: raw.status.toLowerCase() === "on" ? "on" : "off",
    sinkronisasiTerakhir: raw.last_sync_time
      ? raw.last_sync_time.replace(" ", "T")
      : null,
  };
}

/**
 * Bentuk mentah `GET /devices` — dipakai HANYA Manajemen > Stasiun
 * (`stations-admin-client.ts`). Beda dari `RawDevice` (`/devices/status`):
 * TIDAK ada `status`/`last_sync_time`, tapi ada `flag` + `elevation`.
 */
export interface RawAdminDevice {
  id: string;
  name: string;
  brand: string;
  latitude: string;
  longitude: string;
  elevation?: string | number | null;
  flag?: number | null; // 1 = aktif (ASUMSI — belum dikonfirmasi BE)
  company_code: string;
  company_name: string;
}

function parseElevation(value: RawAdminDevice["elevation"]): number | null {
  return value === null || value === undefined || value === "" ? null : Number(value);
}

export function mapAdminDeviceToStation(raw: RawAdminDevice): Station {
  return {
    id: raw.id,
    nama: raw.name,
    brand: raw.brand,
    companyCode: raw.company_code,
    companyName: raw.company_name,
    lat: Number(raw.latitude),
    long: Number(raw.longitude),
    elevation: parseElevation(raw.elevation),
    status: raw.flag === 1 ? "on" : "off",
    sinkronisasiTerakhir: null,
  };
}
