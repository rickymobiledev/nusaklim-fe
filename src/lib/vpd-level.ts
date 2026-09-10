import type { VPDReport } from "@/types/domain";

/** Kategori cekaman VPD (`VPDReport.kategori`) — BUKAN field dari BE,
 *  derived dari rasio `vpd`/`batasAman` (<=70% rendah, <=100% sedang,
 *  >100% tinggi), threshold SEMENTARA, butuh konfirmasi Data
 *  Analyst/BE sebelum dianggap final (lihat catatan di
 *  `types/domain.ts`). Satu tempat, dipakai bareng oleh mock
 *  (`mock/monitoring-api.ts`) dan adapter real (`adapters/vpd-adapter.ts`)
 *  supaya threshold ini cuma ada di satu lokasi. */
export function deriveVpdKategori(vpd: number, batasAman: number): VPDReport["kategori"] {
  const rasio = vpd / batasAman;
  if (rasio <= 0.7) return "rendah";
  if (rasio <= 1) return "sedang";
  return "tinggi";
}
