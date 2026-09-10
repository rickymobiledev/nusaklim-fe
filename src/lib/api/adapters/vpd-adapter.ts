import type { VPDReport } from "@/types/domain";
import { deriveVpdKategori } from "@/lib/vpd-level";

/** Bentuk mentah `GET /vpd?device_id=&start_date=&end_date=`
 *  (dikonfirmasi lewat tes langsung ke backend asli, curl pakai
 *  `API_KEY`/`API_BASE_URL` dari `.env.local`) — satu baris per hari,
 *  dibungkus `{status, message, data}` sama seperti
 *  `/solar_sunshine`/`/water_deficit`/`/dry_spell`. Semua field numeric
 *  asli (beda dari `/solar_sunshine` yang `LAMA_PENYINARAN` string) —
 *  tetap di-`Number()` defensif saat map, konsisten pola adapter lain.
 *  `STNNAME` cuma echo `device_id`, BUKAN nama stasiun, sengaja TIDAK
 *  dipetakan ke `VPDReport.stasiun`. */
export interface RawVpdRow {
  STNNAME: string;
  TANGGAL: string;
  AIR_TEMPERATURE: number;
  AIR_HUMIDITY: number;
  SVP: number;
  VPD: number;
  SAFE_LIMIT: number;
}

export interface RawVpdResponse {
  status: boolean;
  message: string;
  data: RawVpdRow[];
}

/** `stasiun` diisi dari `stationId` yang KITA tahu sendiri (device_id
 *  yang diminta), bukan `raw.STNNAME` — pola sama
 *  `mapRawSunshineDuration`/`mapRawDeviceToDrySpell`. `kategori` BE
 *  tidak punya field ini, tetap derived lewat `deriveVpdKategori()`
 *  (threshold sementara, sama seperti mock — lihat `lib/vpd-level.ts`). */
export function mapRawVpd(raw: RawVpdRow, stationId: string): VPDReport {
  const vpd = Number(raw.VPD);
  const batasAman = Number(raw.SAFE_LIMIT);

  return {
    stasiun: stationId,
    tanggal: raw.TANGGAL,
    temperaturUdara: Number(raw.AIR_TEMPERATURE),
    kelembabanUdara: Number(raw.AIR_HUMIDITY),
    svp: Number(raw.SVP),
    vpd,
    batasAman,
    kategori: deriveVpdKategori(vpd, batasAman),
  };
}
