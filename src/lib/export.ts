import { toPng, toSvg } from "html-to-image";
import { MAP_EXPORT_IGNORE_ATTR } from "@/lib/map-image";

export type TabularFormat = "csv" | "xlsx";
export type ImageFormat = "png" | "svg";
export type ExportFormat = TabularFormat | ImageFormat;

export const TABULAR_FORMATS: TabularFormat[] = ["csv", "xlsx"];
export const ALL_FORMATS: ExportFormat[] = ["csv", "xlsx", "png", "svg"];

export const EXPORT_FORMAT_LABEL: Record<ExportFormat, string> = {
  csv: "CSV",
  xlsx: "XLSX",
  png: "PNG",
  svg: "SVG",
};

export function isImageFormat(format: ExportFormat): format is ImageFormat {
  return format === "png" || format === "svg";
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Parser CSV minimal (kutip ganda, koma & newline di dalam kutip) untuk
 *  string yang dihasilkan `build*Csv()` di project ini — dipakai supaya
 *  XLSX dibangun dari baris yang SAMA persis dengan CSV, bukan logic
 *  kolom kedua yang harus dijaga sinkron. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

// Angka murni (tanpa nol di depan, mis. "007" tetap teks) jadi sel numerik
// di XLSX supaya bisa langsung dijumlah/di-chart di Excel.
const NUMERIC_PATTERN = /^-?(0|[1-9]\d*)(\.\d+)?$/;

/** Unduh data tabel sebagai CSV atau XLSX dari string CSV yang sudah
 *  dibangun `build*Csv()`. `basename` TANPA ekstensi. */
export async function downloadTabular(
  basename: string,
  csv: string,
  format: TabularFormat,
): Promise<void> {
  if (format === "csv") {
    saveBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${basename}.csv`);
    return;
  }

  // Dynamic import — library XLSX cuma ke-load saat user memilih XLSX.
  const { default: writeXlsxFile } = await import("write-excel-file/browser");
  const [header = [], ...body] = parseCsv(csv);
  const sheetData = [
    header.map((value) => ({ value, fontWeight: "bold" as const })),
    ...body.map((row) =>
      row.map((value) => {
        if (value === "") return null;
        return NUMERIC_PATTERN.test(value) ? Number(value) : value;
      }),
    ),
  ];
  const blob = await writeXlsxFile(sheetData).toBlob();
  saveBlob(blob, `${basename}.xlsx`);
}

function shouldInclude(node: HTMLElement): boolean {
  return !(node.hasAttribute && node.hasAttribute(MAP_EXPORT_IGNORE_ATTR));
}

/** Render `element` (chart/peta) jadi PNG atau SVG lalu langsung diunduh.
 *  SVG-nya hasil `html-to-image` (HTML dibungkus `foreignObject`), jadi
 *  tampilannya identik dengan di layar tapi bukan vektor murni per-elemen. */
export async function downloadElementAsImage(
  element: HTMLElement,
  basename: string,
  format: ImageFormat,
): Promise<void> {
  const options = { cacheBust: true, backgroundColor: "#ffffff", filter: shouldInclude };
  const dataUrl =
    format === "png"
      ? await toPng(element, { ...options, pixelRatio: 2 })
      : await toSvg(element, options);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${basename}.${format}`;
  link.click();
}
