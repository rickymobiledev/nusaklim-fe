import type { AppTheme } from "./theme";

export type Tone = "default" | "success" | "destructive";

const TONE_FAMILY = {
  default: "primary",
  success: "success",
  destructive: "danger",
} as const;

/** Ambil warna dari lib/theme.ts sesuai tone — satu-satunya cara komponen
 *  shared boleh mengambil warna tone-based, supaya tidak ada hex baru
 *  yang ditulis lepas di file manapun. */
export function toneColor(
  theme: AppTheme,
  tone: Tone,
  shade: keyof AppTheme["colors"]["primary"],
) {
  return theme.colors[TONE_FAMILY[tone]][shade];
}
