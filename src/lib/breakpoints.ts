/** Breakpoint tunggal switch shell mobile <-> desktop (Header nav + Sidebar
 *  drawer). BUKAN bagian dari design-tokens.ts (itu khusus color/spacing/
 *  radius) — modul terpisah karena nilainya dipakai lewat `@media` di banyak
 *  styled-component, bukan token warna/tema. Nilainya = breakpoint Tailwind
 *  `xl` (tailwind.config.mts, default tak diubah) supaya kedua sistem
 *  styling tetap konsisten.
 *
 *  Pola wajib: mobile-first — base style styled-component = tampilan mobile,
 *  `${media.desktop}` meng-override untuk >=1280px. Jangan hardcode literal
 *  1280 di komponen lain; kalau butuh breakpoint baru, tambah di sini juga.
 */
export const SHELL_BREAKPOINT = 1280;

export const media = {
  desktop: `@media (min-width: ${SHELL_BREAKPOINT}px)`,
} as const;
