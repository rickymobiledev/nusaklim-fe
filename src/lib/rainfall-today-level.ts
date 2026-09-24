import type { RainfallTodayLevel } from "@/types/domain";

/** BEDA dari `getWaterDeficitLevel`/`getDrySpellLevel`: bukan threshold
 *  turunan dari angka, BE sudah balikin status hujan/tidak langsung
 *  lewat field `is_rain` (lihat `StationRainfallToday`) — fungsi ini
 *  cuma menerjemahkan boolean itu ke union type yang konsisten dengan
 *  pola `*Level` lain di codebase. */
export function getRainfallTodayLevel(isHujan: boolean): RainfallTodayLevel {
  return isHujan ? "hujan" : "tidak_hujan";
}

/** Warna dot marker/legend/chip panel per level — SAMA PERSIS warna
 *  warna chip biru (`#0095FF`) / merah (`#EE443F`) panel Peta lama "Daftar Stasiun"
 *  (biru untuk status "baik"/biru, merah untuk "tidak") — satu sumber
 *  supaya tidak ada duplikasi hex di `rainfall-today-map.tsx`,
 *  `RainfallTodayLegend.tsx`, `RainfallTodayPanel.tsx`. */
export const RAINFALL_TODAY_COLOR: Record<RainfallTodayLevel, string> = {
  hujan: "#0095FF",
  tidak_hujan: "#EE443F",
};

export const RAINFALL_TODAY_LABEL: Record<RainfallTodayLevel, string> = {
  hujan: "Hujan",
  tidak_hujan: "Tidak Hujan",
};
