import type { StationStatus } from "@/types/domain";

/** "on"/"off" dari API asli -> istilah domain "aktif"/"tidak_aktif" yang
 *  dipakai di seluruh UI — jangan bandingkan langsung ke "on"/"off" di
 *  komponen, pakai ini supaya satu tempat kalau wire value BE berubah lagi. */
export function mapDeviceStatus(status: StationStatus): "aktif" | "tidak_aktif" {
  return status === "on" ? "aktif" : "tidak_aktif";
}

/** Label, tone StatusBadge, dan warna marker Peta — satu sumber per status
 *  domain supaya tidak ada ternary status berulang di komponen. */
export const STATION_STATUS_BADGE: Record<
  "aktif" | "tidak_aktif",
  { label: string; tone: "success" | "destructive"; color: string }
> = {
  aktif: { label: "Aktif", tone: "success", color: "#15803d" },
  tidak_aktif: { label: "Tidak Aktif", tone: "destructive", color: "#b91c1c" },
};
