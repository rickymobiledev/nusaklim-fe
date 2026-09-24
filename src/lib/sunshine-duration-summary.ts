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

/** Batas bawah yang dipakai chart/panel/alert halaman Monitoring — nilai
 *  dari baris TERBARU yang valid (BE mengirim per-baris, praktisnya selalu
 *  3), fallback `DEFAULT_BATAS_BAWAH_JAM` kalau tidak ada baris. */
export function getBatasBawahJam(rows: SunshineDuration[]): number {
  const latest = pickLatestSunshineDuration(rows);
  return latest && Number.isFinite(latest.batasBawahJam)
    ? latest.batasBawahJam
    : DEFAULT_BATAS_BAWAH_JAM;
}

/** Hari yang lama penyinarannya DI BAWAH batas bawah barisnya sendiri,
 *  urut tanggal naik. Dipakai panel ringkasan Monitoring. */
export function getBelowLimitDays(rows: SunshineDuration[]): SunshineDuration[] {
  return rows
    .filter(
      (row) =>
        Number.isFinite(row.lamaPenyinaranJam) &&
        row.lamaPenyinaranJam < row.batasBawahJam,
    )
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** CSV data chart Monitoring > Lama Penyinaran (seluruh baris rentang). */
export function buildSunshineDurationCsv(rows: SunshineDuration[]): string {
  const header = ["Tanggal", "Stasiun", "Lama Penyinaran (Jam)", "Batas Bawah (Jam)"];
  const lines = rows.map((row) =>
    [
      csvEscape(row.tanggal),
      csvEscape(row.stasiun),
      row.lamaPenyinaranJam,
      row.batasBawahJam,
    ].join(","),
  );
  return [header.join(","), ...lines].join("\n");
}
