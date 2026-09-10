import type { DrySpellReport } from "@/types/domain";

/** Bentuk mentah `GET /dry_spell?device_id=&start_date=&end_date=`
 *  (dikonfirmasi lewat tes langsung ke backend asli, curl pakai
 *  `API_KEY`/`API_BASE_URL` dari `.env.local`) — satu baris per periode
 *  dry-spell (BUKAN satu baris per hari), dibungkus
 *  `{status, message, data}` sama seperti 3 endpoint Monitoring lain.
 *
 *  **JANGAN disamakan** dengan `lib/api/adapters/dry-spell-adapter.ts`
 *  (`mapRawDeviceToDrySpell`) — itu punya `GET /devices/dry_spell?company_code=&year=`
 *  company-wide untuk tab PETA, bentuk mentahnya beda total (device +
 *  array `dry_spell[]`). File ini KHUSUS halaman Monitoring
 *  (per-stasiun, `start_date`/`end_date`). `STNNAME` cuma echo
 *  `device_id`, BUKAN nama stasiun, sengaja TIDAK dipetakan ke
 *  `DrySpellReport.stasiun`. */
export interface RawDrySpellReportRow {
  STNNAME: string;
  TANGGAL: string;
  TOTAL_DRY_SPELL: number;
  START_DATE: string;
  END_DATE: string;
}

export interface RawDrySpellReportResponse {
  status: boolean;
  message: string;
  data: RawDrySpellReportRow[];
}

/** `stasiun` diisi dari `stationId` yang KITA tahu sendiri (device_id
 *  yang diminta), bukan `raw.STNNAME` — pola sama
 *  `mapRawSunshineDuration`/`mapRawVpd`. */
export function mapRawDrySpellReport(
  raw: RawDrySpellReportRow,
  stationId: string,
): DrySpellReport {
  return {
    stasiun: stationId,
    tanggal: raw.TANGGAL,
    totalHariKering: Number(raw.TOTAL_DRY_SPELL),
    tanggalMulai: raw.START_DATE,
    tanggalSelesai: raw.END_DATE,
  };
}
