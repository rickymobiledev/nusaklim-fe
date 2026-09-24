import type { VPDReport } from "@/types/domain";

/** "Batas Aman" yang ditampilkan kartu VPD saat baris hari ini belum ada —
 *  Figma dan project lama sama-sama tetap menampilkan "1.7 kPa", dan
 *  `SAFE_LIMIT` di data asli memang selalu 1.7. Nilai dari baris BE tetap
 *  prioritas; ini cuma fallback tampilan (pola sama
 *  `DEFAULT_BATAS_BAWAH_JAM` di `sunshine-duration-summary.ts`). */
export const DEFAULT_BATAS_AMAN_KPA = 1.7;

/** Di bawah nilai ini udara dianggap "terlalu lembap" (transpirasi
 *  tanaman terhambat). Angka USULAN — BELUM ada konfirmasi Data
 *  Analyst/BE, status "belum final" sama seperti `deriveVpdKategori`. */
export const VPD_LOW_KPA = 0.8;

/** Suhu udara di atas ini dianggap lonjakan sensor (batas fisik suhu udara
 *  di bumi ~57 °C). Data asli device 2207 punya baris 8 Mar dengan
 *  `AIR_TEMPERATURE` 1817 °C, `SVP` 1.3e25. */
const MAX_PLAUSIBLE_TEMPERATURE_C = 60;

/** VPD atmosfer nyata di bawah ~10 kPa; di atasnya lonjakan sensor. */
const MAX_PLAUSIBLE_VPD_KPA = 10;

/** Baris VPD yang punya pengukuran bermakna. BE memberi baris "kosong"
 *  untuk hari tanpa data — `AIR_TEMPERATURE`/`AIR_HUMIDITY`/`SVP` = `null`
 *  dan `VPD: 0` — dan `vpd-adapter.ts` memetakan `null` lewat `Number()`
 *  jadi 0, sehingga baris kosong tampak "valid". Kelembapan 0 (atau -1,
 *  seperti baris 30 Mar) mustahil untuk pengukuran nyata. */
export function isMeaningfulVpdRow(row: VPDReport): boolean {
  return (
    Number.isFinite(row.vpd) &&
    row.vpd <= MAX_PLAUSIBLE_VPD_KPA &&
    row.svp > 0 &&
    row.kelembabanUdara > 0 &&
    row.kelembabanUdara <= 100 &&
    row.temperaturUdara <= MAX_PLAUSIBLE_TEMPERATURE_C
  );
}

/** Baris bermakna dengan `tanggal` PALING BARU (format `YYYY-MM-DD`, bisa
 *  dibandingkan sebagai string) dalam rentang 1 Jan–hari ini yang diminta
 *  kartu VPD — mengikuti project lama, yang menampilkan baris terakhir
 *  (bukan hari ini: BE belum punya baris hari ini, jadi yang tampil data
 *  kemarin). Baris kosong & lonjakan sensor dilewati (lihat
 *  `isMeaningfulVpdRow`). `null` kalau tidak ada baris bermakna. */
export function pickLatestVpd(rows: VPDReport[]): VPDReport | null {
  let latest: VPDReport | null = null;
  for (const row of rows) {
    if (!isMeaningfulVpdRow(row)) continue;
    if (latest === null || row.tanggal > latest.tanggal) latest = row;
  }
  return latest;
}

/** Kalimat banner kartu — SEMUA belum final. Hanya kalimat "terlalu
 *  lembap" yang datang dari Figma (contoh VPD 0.54 / batas aman 1.7);
 *  "melebihi batas aman", "rentang aman" & "belum tersedia" USULAN.
 *  SENGAJA TIDAK memakai `VPDReport.kategori` (`deriveVpdKategori`, rasio
 *  vpd/batas aman): kategori "rendah" (rasio ≤70%, VPD ≤ ~1.19 kPa) akan
 *  memberi label "terlalu lembap" juga pada VPD yang justru ideal. */
export function getVpdMessage(row: VPDReport | null): string {
  if (!row) return "Data VPD belum tersedia.";
  if (row.vpd < VPD_LOW_KPA) {
    return "Udara terlalu lembap, tanaman jadi kurang “bernapas” dan serapan pupuk tidak maksimal.";
  }
  if (row.vpd > row.batasAman) {
    return "VPD melebihi batas aman. Udara terlalu kering, tanaman berisiko mengalami cekaman air.";
  }
  return "VPD berada dalam rentang aman bagi tanaman.";
}

/** Nilai APA ADANYA seperti project lama (`2.499037 kPa`, `5317.1 kPa`,
 *  `1.7 kPa`), maksimal 6 desimal (presisi asli BE) tanpa nol di belakang
 *  dan tanpa noise floating point (`0.060320000000000006` → `0.06032`).
 *  Angka contoh Figma (1.7 / 2716.4 / 0.54) tampil sama persis. */
export function formatKpa(value: number): string {
  return `${Number(value.toFixed(6))} kPa`;
}

/** Batas aman yang dipakai chart/panel/alert halaman Monitoring — nilai
 *  dari baris bermakna TERBARU (BE mengirim per-baris, praktisnya selalu
 *  1.7), fallback `DEFAULT_BATAS_AMAN_KPA` kalau tidak ada baris. */
export function getBatasAmanKpa(rows: VPDReport[]): number {
  const latest = pickLatestVpd(rows);
  return latest && Number.isFinite(latest.batasAman)
    ? latest.batasAman
    : DEFAULT_BATAS_AMAN_KPA;
}

/** Hari bermakna yang VPD-nya DI ATAS batas aman barisnya sendiri, urut
 *  tanggal naik. Dipakai panel ringkasan Monitoring. */
export function getAboveLimitVpdDays(rows: VPDReport[]): VPDReport[] {
  return rows
    .filter((row) => isMeaningfulVpdRow(row) && row.vpd > row.batasAman)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** CSV data chart Monitoring > VPD (seluruh baris rentang, termasuk baris
 *  kosong dari BE apa adanya). */
export function buildVpdCsv(rows: VPDReport[]): string {
  const header = [
    "Tanggal",
    "Stasiun",
    "Temperatur Udara",
    "Kelembapan Udara",
    "SVP",
    "VPD",
    "Batas Aman",
  ];
  const lines = rows.map((row) =>
    [
      csvEscape(row.tanggal),
      csvEscape(row.stasiun),
      row.temperaturUdara,
      row.kelembabanUdara,
      row.svp,
      row.vpd,
      row.batasAman,
    ].join(","),
  );
  return [header.join(","), ...lines].join("\n");
}
