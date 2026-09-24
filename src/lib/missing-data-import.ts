/** Validasi file import Excel "Missing Data" — SATU sumber untuk UI
 *  (`"use client"`, tidak boleh import `lib/api/*`) dan Route Handler. */
export const MAX_IMPORT_FILE_SIZE = 5 * 1024 * 1024;
export const IMPORT_FILE_EXTENSIONS = [".xlsx", ".xls"];

/** Balikin pesan error, atau `null` kalau file valid. */
export function validateImportFile(file: { name: string; size: number }): string | null {
  const lower = file.name.toLowerCase();
  if (!IMPORT_FILE_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
    return "Format file harus .xlsx atau .xls.";
  }
  if (file.size > MAX_IMPORT_FILE_SIZE) {
    return "Ukuran file maksimal 5 MB.";
  }
  return null;
}
