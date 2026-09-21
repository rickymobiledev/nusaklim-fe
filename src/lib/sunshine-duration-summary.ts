import type { SunshineDuration } from "@/types/domain";

/** "Batas Bawah" yang ditampilkan kartu Lama Penyinaran saat baris hari
 *  ini belum ada — Figma dan project lama sama-sama tetap menampilkan
 *  "3 Jam" di kondisi itu, dan `BATAS_BAWAH` di data asli memang selalu 3.
 *  Nilai dari baris BE tetap prioritas; ini cuma fallback tampilan. */
export const DEFAULT_BATAS_BAWAH_JAM = 3;

/** Baris dengan `tanggal` PALING BARU (format `YYYY-MM-DD`, bisa
 *  dibandingkan sebagai string). Kartu Lama Penyinaran di sidebar Beranda
 *  hanya meminta HARI INI (sama project lama), jadi biasanya 0–1 baris;
 *  logic "terbaru" dipertahankan supaya aman kalau jendela dilebarkan.
 *  Baris dengan `lamaPenyinaranJam` bukan angka (`Number()` dari string
 *  tak valid = `NaN`) diabaikan. `null` kalau tidak ada baris valid. */
export function pickLatestSunshineDuration(
  rows: SunshineDuration[],
): SunshineDuration | null {
  let latest: SunshineDuration | null = null;
  for (const row of rows) {
    if (!Number.isFinite(row.lamaPenyinaranJam)) continue;
    if (latest === null || row.tanggal > latest.tanggal) latest = row;
  }
  return latest;
}

/** Kalimat banner kartu — SEMUA belum final. Hanya kalimat "cukup" yang
 *  datang dari Figma; "kurang dari batas bawah" & "belum tersedia"
 *  USULAN (Figma cuma punya satu teks, dan state "Data Belum Tersedia"-nya
 *  malah dipasangkan dengan teks "cukup" — mockup statis). Butuh
 *  konfirmasi Data Analyst. */
export function getSunshineDurationMessage(row: SunshineDuration | null): string {
  if (!row) return "Data lama penyinaran belum tersedia.";
  if (row.lamaPenyinaranJam >= row.batasBawahJam) {
    return "Sinar matahari hari jauh lebih dari cukup untuk fotosintesis dan pertumbuhan. Tanaman berada pada kondisi cahaya yang bagus.";
  }
  return "Sinar matahari kurang dari batas bawah. Fotosintesis dan pertumbuhan tanaman dapat terganggu.";
}

/** `"3 Jam"`, `"7.5 Jam"` — maksimal 2 desimal tanpa nol di belakang,
 *  titik desimal seperti kartu sidebar lain. */
export function formatHours(value: number): string {
  return `${Number(value.toFixed(2))} Jam`;
}
