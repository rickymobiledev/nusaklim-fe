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
