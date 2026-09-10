import type { SunshineDuration } from "@/types/domain";

/** Bentuk mentah `GET /solar_sunshine?device_id=&start_date=&end_date=`
 *  (dikonfirmasi lewat tes langsung ke backend asli, curl pakai
 *  `API_KEY`/`API_BASE_URL` dari `.env.local`) — satu baris per hari,
 *  dibungkus `{status, message, data}` sama seperti
 *  `/water_deficit`/`/dry_spell`/`/rainfall_today`. `LAMA_PENYINARAN`
 *  SELALU string (`"7.00"`), `BATAS_BAWAH` SELALU number (`3`) — beda
 *  tipe field dalam satu baris yang sama, dikonfirmasi dari response
 *  asli (bukan salah ketik). `STNNAME` cuma echo `device_id` ("007"),
 *  BUKAN nama stasiun manusiawi — sengaja TIDAK dipetakan ke
 *  `SunshineDuration.stasiun`, lihat `mapRawSunshineDuration`. */
export interface RawSunshineDurationRow {
  STNNAME: string;
  TANGGAL: string;
  LAMA_PENYINARAN: string;
  BATAS_BAWAH: number;
}

export interface RawSunshineDurationResponse {
  status: boolean;
  message: string;
  data: RawSunshineDurationRow[];
}

/** `stasiun` diisi dari `stationId` yang KITA tahu sendiri (device_id
 *  yang diminta), bukan `raw.STNNAME` — field itu cuma echo device_id
 *  lagi, bukan nama stasiun, pola sama `mapRawDeviceToDrySpell` yang
 *  juga tidak percaya field self-referential dari payload. */
export function mapRawSunshineDuration(
  raw: RawSunshineDurationRow,
  stationId: string,
): SunshineDuration {
  return {
    stasiun: stationId,
    tanggal: raw.TANGGAL,
    lamaPenyinaranJam: Number(raw.LAMA_PENYINARAN),
    batasBawahJam: Number(raw.BATAS_BAWAH),
  };
}
