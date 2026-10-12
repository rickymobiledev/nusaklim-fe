import type { WeatherStatus } from "@/types/domain";

/** Warna banner status kartu metrik Beranda dari `interpretation_level` BE:
 *  `maximum` → merah, `optimum` → hijau, `minimum` → kuning. Level kosong/tak
 *  dikenal → kuning (netral). */
export function toneFromInterpretationLevel(level?: string): WeatherStatus["tone"] {
  switch (level) {
    case "maximum":
      return "warning";
    case "optimum":
      return "success";
    default:
      return "caution";
  }
}
