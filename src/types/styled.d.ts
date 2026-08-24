import type { AppTheme } from "@/lib/theme";

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- module augmentation requires `interface`, not `type`
  export interface DefaultTheme extends AppTheme {}
}
