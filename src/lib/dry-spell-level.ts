import type { DrySpellLevel } from "@/types/domain";

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
