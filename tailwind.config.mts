import type { Config } from "tailwindcss";
import { colors, radius, spacing } from "./src/lib/design-tokens";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        success: colors.success,
        danger: colors.danger,
        neutral: colors.neutral,
      },
      spacing,
      borderRadius: radius,
    },
  },
} satisfies Config;
