import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely (handles conditional + conflicting classes).
 * Used by every UI primitive in `components/ui`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COMPASS_POINTS = [
  "Utara",
  "Timur Laut",
  "Timur",
  "Tenggara",
  "Selatan",
  "Barat Daya",
  "Barat",
  "Barat Laut",
];

/** Konversi derajat arah angin (0-360) ke teks 8 arah mata angin.
 *  Dipakai di Ramalan Cuaca & (nanti) kolom Arah Mata Angin di Unduh Data —
 *  jangan duplikasi logic ini di tempat lain. */
export function degreesToCompass(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % COMPASS_POINTS.length;
  return COMPASS_POINTS[index];
}
