/**
 * Sumber tunggal token warna/spacing/radius, dipakai bareng oleh
 * `tailwind.config.ts` (theme.extend) dan `lib/theme.ts` (ThemeProvider
 * styled-components) supaya keduanya tidak pernah punya nilai yang beda.
 *
 * `primary` di-derive dari #175FE2 (persis di step 600) dengan pergeseran
 * lightness HSL pada hue/saturation yang sama. `success`/`danger`/`neutral`
 * memakai palet Tailwind resmi (green/red/slate) karena token semantik
 * project ini kebetulan sudah persis palet Tailwind yang diberi nama ulang
 * (lihat `--success`/`--destructive`/warna primary lama di globals.css).
 */

export const colors = {
  primary: {
    50: "#F1F5FD",
    100: "#DFE9FB",
    200: "#BAD0F7",
    300: "#8CB0F2",
    400: "#5E90ED",
    500: "#3071E8",
    600: "#175FE2",
    700: "#144EB8",
    800: "#0F3A8A",
    900: "#0A275C",
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
} as const;

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
} as const;

export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.625rem",
  xl: "0.875rem",
  full: "9999px",
} as const;
