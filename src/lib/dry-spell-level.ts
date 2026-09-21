import type { DrySpellLevel, DrySpellReport } from "@/types/domain";

/** Threshold <10/>10/>20 hari ikut label yang ditampilkan di Figma tab
 *  Peta > Deret Terpanjang Hari Tidak Hujan. BELUM ada konfirmasi resmi
 *  dari BE/Data Analyst — threshold sementara, status "belum final" sama
 *  seperti `getWaterDeficitLevel` di `water-deficit-level.ts`.
 *
 *  `null` (array `dry_spell` kosong, tidak ada periode kekeringan
 *  tercatat) di-treat SAMA seperti `rendah` (bukan level terpisah) —
 *  dikonfirmasi dari dashboard Nusaklim produksi (ground truth): stasiun
 *  tanpa periode tercatat ditampilkan dengan status "< 10 hari", bukan
 *  "tidak ada data". */
export function getDrySpellLevel(durasiTerakhir: number | null): DrySpellLevel {
  if (durasiTerakhir === null) return "rendah";
  if (durasiTerakhir > 20) return "tinggi";
  if (durasiTerakhir > 10) return "sedang";
  return "rendah";
}

/** Warna dot marker/legend/panel per level — satu sumber supaya tidak ada
 *  ternary warna berulang di komponen (`dry-spell-map.tsx`,
 *  `DrySpellLegend.tsx`, `DrySpellPanel.tsx`). */
export const DRY_SPELL_COLOR: Record<DrySpellLevel, string> = {
  rendah: "#43B75D",
  sedang: "#E2AF17",
  tinggi: "#EE443F",
};

export const DRY_SPELL_LABEL: Record<DrySpellLevel, string> = {
  rendah: "< 10 Hari",
  sedang: "> 10 Hari",
  tinggi: "> 20 Hari",
};

/** Kalimat banner kartu "Deret Hari Terpanjang Tidak Hujan" di sidebar
 *  Beranda. Hanya `sedang` yang datang dari Figma (persis); `rendah` &
 *  `tinggi` USULAN (mengacu alert di `DrySpellList.tsx`) — BELUM final,
 *  butuh konfirmasi Data Analyst, sama status threshold-nya di atas. */
export const DRY_SPELL_MESSAGE: Record<DrySpellLevel, string> = {
  rendah: "Belum ada deret hari tidak hujan yang panjang. Kondisi aman untuk pemupukan.",
  sedang:
    "Hari Tidak Hujan Panjang: Indeks stress tanaman di atas batas aman selama 10 hari berturut-turut",
  tinggi:
    "Deret hari tidak hujan lebih dari 20 hari: tanaman sawit anda akan mengalami cekaman kekeringan.",
};

/** Periode dengan `tanggalSelesai` PALING BARU (bukan durasi terbesar) —
 *  aturan yang sama dengan `pickMostRecentDrySpell` di
 *  `lib/api/adapters/dry-spell-adapter.ts` (tab Peta), dikonfirmasi
 *  terhadap dashboard Nusaklim produksi. `null` kalau tidak ada periode. */
export function pickLatestDrySpellReport(rows: DrySpellReport[]): DrySpellReport | null {
  if (rows.length === 0) return null;
  return rows.reduce((latest, row) =>
    row.tanggalSelesai > latest.tanggalSelesai ? row : latest,
  );
}
