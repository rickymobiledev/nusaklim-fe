import type { WaterDeficitLevel } from "@/types/domain";

/** Threshold >200mm ikut ambang yang ditampilkan di alert Figma tab Peta >
 *  Keseimbangan Air ("Defisit Air > 200 mm/tahun akan menyebabkan cekaman
 *  kekeringan..."). BELUM ada konfirmasi resmi dari BE/Data Analyst —
 *  threshold sementara, status "belum final" sama seperti
 *  `rainfall-status.ts`/`humidity-status.ts`. */
export function getWaterDeficitLevel(defisitAir: number | null): WaterDeficitLevel {
  if (defisitAir === null) return "tidak_ada";
  return defisitAir > 200 ? "tinggi" : "rendah";
}

/** Warna dot marker/legend per level — satu sumber supaya tidak ada ternary
 *  warna berulang di komponen (`water-deficit-map.tsx`, `WaterDeficitLegend.tsx`). */
export const WATER_DEFICIT_COLOR: Record<WaterDeficitLevel, string> = {
  tidak_ada: "#5B5B5B",
  rendah: "#E2AF17",
  tinggi: "#EE443F",
};

export const WATER_DEFICIT_LABEL: Record<WaterDeficitLevel, string> = {
  tidak_ada: "Tidak Ada",
  rendah: "<200mm",
  tinggi: ">200mm",
};
