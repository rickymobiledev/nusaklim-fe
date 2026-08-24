import { colors, radius, spacing } from "./design-tokens";

export const theme = {
  colors,
  spacing,
  radius,
} as const;

export type AppTheme = typeof theme;
