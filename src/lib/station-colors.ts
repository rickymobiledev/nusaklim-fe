/** Palet warna line chart/legend/stripe sidebar per stasiun — diberi
 *  berdasarkan URUTAN pilih (index di `selectedStationIds`), bukan id
 *  stasiun tertentu (Figma cuma contoh 3 stasiun spesifik, di app nyata
 *  stasiun yang dipilih bisa apa saja). 3 warna pertama persis contoh
 *  Figma (biru/hijau/merah), sisanya tambahan biar tetap beda kalau
 *  user pilih lebih dari 3 stasiun. */
export const STATION_CHART_COLORS = [
  "#0039FF",
  "#00FF55",
  "#FF0004",
  "#FFA500",
  "#9333EA",
  "#0EA5E9",
] as const;

export function getStationColor(index: number): string {
  return STATION_CHART_COLORS[index % STATION_CHART_COLORS.length];
}
