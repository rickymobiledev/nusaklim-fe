import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Batas styling: components/ui/** harus tetap primitif Tailwind/shadcn
  // murni, tidak boleh styled-components (lihat rule di bawah untuk
  // components/{shared,layout,domain}/** yang sebaliknya).
  {
    files: ["src/components/ui/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["styled-components", "styled-components/*"],
              message:
                "components/ui/** harus tetap primitif Tailwind/shadcn murni — styling dinamis/bertema pindah ke components/shared|layout|domain.",
            },
          ],
        },
      ],
    },
  },
  // components/{shared,layout,domain}/** pakai styled-components + token dari
  // lib/design-tokens.ts, bukan cn()/tailwind-merge/cva ala shadcn.
  {
    files: [
      "src/components/shared/**",
      "src/components/layout/**",
      "src/components/domain/**",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/lib/utils",
                "@/lib/utils/*",
                "tailwind-merge",
                "class-variance-authority",
                "class-variance-authority/*",
              ],
              message:
                "Jangan susun className Tailwind manual (cn/tailwind-merge/cva) di luar components/ui/** — pakai styled-components + token dari lib/design-tokens.ts, atau compose komponen ui/** yang sudah ada.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Harus di baris terakhir — mematikan rule stylistic yang konflik dengan
  // Prettier (tidak menyentuh no-restricted-imports di atas).
  eslintConfigPrettier,
]);

export default eslintConfig;
