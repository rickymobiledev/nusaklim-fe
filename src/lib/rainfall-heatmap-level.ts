import type { RainfallHeatmapLevel } from "@/types/domain";

/** Threshold ikut label legenda "Keterangan Curah Hujan (mm)" di Figma
 *  (<0.1, 0.1-20, 21-50, 51-100, 101-150, >150) — BELUM ada konfirmasi
 *  resmi dari BE/Data Analyst, boundary di titik pecahan (mis. 20.5mm)
 *  adalah asumsi penulis, status "belum final" sama seperti
 *  `getDrySpellLevel`/`getWaterDeficitLevel`.
 *
 *  `isMasaDepan` WAJIB dikirim eksplisit oleh caller (bukan di-derive di
 *  sini) — `fetchRainfallRange()` (`lib/api/weather-daily-client.ts`)
 *  men-default hari tanpa record BE jadi 0mm, jadi nilai `curahHujan`
 *  SENDIRIAN tidak cukup untuk membedakan "hari lampau tanpa catatan"
 *  dari "hari belum terjadi" — perbandingan tanggal dilakukan di
 *  `use-rainfall-heatmap.ts`. */
export function getRainfallHeatmapLevel(
  curahHujan: number | null,
  isMasaDepan: boolean,
): RainfallHeatmapLevel {
  if (isMasaDepan || curahHujan === null) return "tidak_ada_data";
  if (curahHujan < 0.1) return "tidak_hujan";
  if (curahHujan <= 20) return "ringan";
  if (curahHujan <= 50) return "sedang";
  if (curahHujan <= 100) return "lebat";
  if (curahHujan <= 150) return "sangat_lebat";
  return "ekstrem";
}

/** Warna sel per level, persis Figma — `tidak_hujan` KHUSUS bg putih +
 *  border merah (bukan solid) untuk sel maupun bar legenda. */
export const RAINFALL_HEATMAP_COLOR: Record<
  RainfallHeatmapLevel,
  { bg: string; text: string; border?: string }
> = {
  tidak_hujan: { bg: "#FFFFFF", text: "#EE443F", border: "#EE443F" },
  ringan: { bg: "#86B6FC", text: "#FFFFFF" },
  sedang: { bg: "#639EF6", text: "#FFFFFF" },
  lebat: { bg: "#3582FB", text: "#FFFFFF" },
  sangat_lebat: { bg: "#004CD1", text: "#FFFFFF" },
  ekstrem: { bg: "#002171", text: "#FFFFFF" },
  tidak_ada_data: { bg: "#B7C2BB", text: "#FFFFFF" },
};

/** Urutan tampil legend — `tidak_ada_data` SENGAJA tidak diikutkan,
 *  tidak ada di legenda "Keterangan Curah Hujan (mm)" Figma. */
export const RAINFALL_HEATMAP_LEGEND_ORDER: Exclude<
  RainfallHeatmapLevel,
  "tidak_ada_data"
>[] = ["tidak_hujan", "ringan", "sedang", "lebat", "sangat_lebat", "ekstrem"];

export const RAINFALL_HEATMAP_RANGE_LABEL: Record<
  Exclude<RainfallHeatmapLevel, "tidak_ada_data">,
  string
> = {
  tidak_hujan: "<0.1",
  ringan: "0.1-20",
  sedang: "21-50",
  lebat: "51-100",
  sangat_lebat: "101-150",
  ekstrem: ">150",
};

/** Label rentang untuk popover detail (klik icon info di legend) —
 *  format BEDA dari `RAINFALL_HEATMAP_RANGE_LABEL` di atas (dipakai bar
 *  legend ringkas di bawah kalender): desimal koma + en dash + unit
 *  eksplisit, sesuai Figma "Tooltip Legen Cura Hujan". Angka SAMA (satu
 *  sumber threshold, `getRainfallHeatmapLevel`), cuma format teks beda
 *  konteks tampilan. */
export const RAINFALL_HEATMAP_TOOLTIP_RANGE_LABEL: Record<
  Exclude<RainfallHeatmapLevel, "tidak_ada_data">,
  string
> = {
  tidak_hujan: "<0,1 mm/hari",
  ringan: "0,1 – 20 mm/hari",
  sedang: "21 – 50 mm/hari",
  lebat: "51 – 100 mm/hari",
  sangat_lebat: "101 – 150 mm/hari",
  ekstrem: ">150 mm/hari",
};

/** Nama level untuk baris kedua tiap item popover — ditranskrip apa
 *  adanya dari Figma, TERMASUK kapitalisasi yang tidak konsisten
 *  ("Tidak hujan"/"Hujan ringan" huruf kecil vs "Hujan Sedang"/dst huruf
 *  besar) — bukan typo penulis, ikut desain apa adanya. */
export const RAINFALL_HEATMAP_TOOLTIP_NAME_LABEL: Record<
  Exclude<RainfallHeatmapLevel, "tidak_ada_data">,
  string
> = {
  tidak_hujan: "Tidak hujan",
  ringan: "Hujan ringan",
  sedang: "Hujan Sedang",
  lebat: "Hujan Lebat",
  sangat_lebat: "Hujan Sangat Lebat",
  ekstrem: "Hujan Ekstrem",
};
