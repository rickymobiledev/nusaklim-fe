import type { WeatherStatus } from "@/types/domain";
import { degreesToCardinal } from "@/lib/cardinal-direction";

/** Informasional saja (tidak ada ambang "baik/buruk" untuk arah angin) —
 *  kalimat dari Figma ("Angin datang dari arah Barat"), nama arah dari
 *  `degreesToCardinal` (4 arah, mapping BE). */
export function deriveWindDirectionStatus(value: number | null): WeatherStatus {
  if (value === null) {
    return { tone: "warning", message: "Data arah angin tidak tersedia" };
  }
  return {
    tone: "success",
    message: `Angin datang dari arah ${degreesToCardinal(value)}`,
  };
}
