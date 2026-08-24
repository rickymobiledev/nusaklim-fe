import styled from "styled-components";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { toneColor, type Tone } from "@/lib/theme-utils";

/** Tone yang punya warna keluarga di lib/theme.ts (primary/success/danger). */
const THEMED_TONES: Tone[] = ["default", "success", "destructive"];

function isThemedTone(tone: string): tone is Tone {
  return (THEMED_TONES as string[]).includes(tone);
}

/** Override warna Badge shadcn (yang defaultnya dari var CSS Tailwind)
 *  supaya sumber warnanya lib/theme.ts, bukan --success/--destructive dst.
 *  `!important` dipakai karena Badge sudah membawa class Tailwind warna
 *  sendiri lewat prop `variant` — ini kompromi "kerangka dulu", bisa
 *  dirapikan nanti. */
const ThemedBadge = styled(Badge)<{ $tone: Tone }>`
  background-color: ${(p) => toneColor(p.theme, p.$tone, 100)} !important;
  color: ${(p) => toneColor(p.theme, p.$tone, p.$tone === "default" ? 600 : 700)} !important;
  border-color: transparent !important;
`;

export function StatusBadge({
  label,
  tone = "default",
}: {
  label: string;
  tone?: Tone | "secondary" | "warning" | "outline";
}) {
  // aktif -> tone="success" (hijau), tidak_aktif -> tone="destructive" (merah).
  if (isThemedTone(tone)) {
    return <ThemedBadge $tone={tone}>{label}</ThemedBadge>;
  }

  // Tone di luar keluarga warna lib/theme.ts (mis. "warning" untuk
  // kategori VPD "sedang") tetap pakai varian Badge bawaan apa adanya.
  return <Badge variant={tone as BadgeProps["variant"]}>{label}</Badge>;
}
