const CARDINAL_POINTS = ["Utara", "Timur", "Selatan", "Barat"];

/** Derajat arah angin (0-360) → 4 arah mata angin, sektor 90°: Utara
 *  ≈315°–45°, Timur 45°–135°, Selatan 135°–225°, Barat 225°–315°.
 *
 *  Ini mapping yang dipakai BACKEND (`wind_direction_name` di
 *  `/weathers/latest`) dan project lama — dikonfirmasi dengan sampling 40
 *  stasiun (mis. 308° = "Barat", 129° = "Timur", 150° = "Selatan"). BEDA
 *  dari `degreesToCompass` di `lib/utils` (8 arah, dipakai Ramalan Cuaca/
 *  Unduh Data/`/wind-direction`) — sampai sekarang cuma kartu Arah Mata
 *  Angin di Beranda yang memakai ini. Direproduksi di FE karena
 *  `average_wind_direction` harian hanya membawa derajat, tanpa nama. */
export function degreesToCardinal(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  return CARDINAL_POINTS[Math.floor(((normalized + 45) % 360) / 90)];
}
