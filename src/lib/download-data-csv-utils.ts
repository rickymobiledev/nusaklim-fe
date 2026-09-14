import type { DownloadDataRow } from "@/types/domain";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** CSV dari SELURUH baris hasil filter (bukan cuma satu halaman
 *  tabel) — dipanggil `DownloadDataSection.tsx` dari data yang sudah
 *  ke-fetch sekaligus (tanpa pagination server-side). Pola `csvEscape` + header/rows sama seperti
 *  `lib/map-utils.ts`/`lib/air-temperature-chart-utils.ts`, sengaja
 *  duplikat kecil daripada bikin abstraksi baru (konvensi project). Sel
 *  kosong (bukan literal "null") untuk metrik yang `null`. */
export function buildDownloadDataCsv(rows: DownloadDataRow[]): string {
  const header = [
    "Tanggal",
    "Rerata Temperatur Udara",
    "Rerata Kelembapan Relatif",
    "Total Curah Hujan",
    "Total Radiasi Matahari",
    "Rerata Tekanan Udara",
    "Rerata Kecepatan Angin",
    "Arah Mata Angin",
  ];

  const lines = rows.map((row) =>
    [
      csvEscape(row.tanggal),
      row.rerataTemperatur ?? "",
      row.rerataKelembapanRelatif ?? "",
      row.totalCurahHujan ?? "",
      row.totalRadiasi ?? "",
      row.rerataTekananUdara ?? "",
      row.rerataKecepatanAngin ?? "",
      row.arahMataAngin ? csvEscape(row.arahMataAngin) : "",
    ].join(","),
  );

  return [header.join(","), ...lines].join("\n");
}

/** Trigger save-as browser standar — sama persis
 *  `lib/air-temperature-chart-utils.ts` `downloadCsvFile()`, duplikat
 *  kecil di sini biar `lib/download-data-csv-utils.ts` berdiri sendiri
 *  (konsisten konvensi "sengaja paralel/duplikat" project, bukan share
 *  helper generik lintas domain). */
export function downloadCsvFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
