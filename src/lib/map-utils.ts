import { format } from "date-fns";
import type { Station } from "@/types/domain";
import { mapDeviceStatus, STATION_STATUS_BADGE } from "@/lib/status";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** CSV daftar stasiun dari data yang sudah ke-fetch (`useStations()`) —
 *  dipakai tombol "Unduh" di toolbar peta. Bukan request baru ke server,
 *  murni export apa yang sedang tampil di client, sama semangatnya dengan
 *  `buildPressureCsv` di `lib/air-pressure-chart-utils.ts`. */
export function buildStationsCsv(stations: Station[]): string {
  const header = [
    "Nama",
    "Brand",
    "Status",
    "Latitude",
    "Longitude",
    "Sinkronisasi Terakhir",
  ];

  const lines = stations.map((s) => {
    const statusInfo = STATION_STATUS_BADGE[mapDeviceStatus(s.status)];
    const sync = s.sinkronisasiTerakhir
      ? format(new Date(s.sinkronisasiTerakhir), "dd/MM/yyyy HH:mm")
      : "";
    return [
      csvEscape(s.nama),
      csvEscape(s.brand),
      csvEscape(statusInfo.label),
      String(s.lat),
      String(s.long),
      csvEscape(sync),
    ].join(",");
  });

  return [header.join(","), ...lines].join("\n");
}
