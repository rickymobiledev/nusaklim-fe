import { format } from "date-fns";
import type {
  Station,
  StationWaterDeficit,
  StationDrySpell,
  StationRainfallToday,
} from "@/types/domain";
import { mapDeviceStatus, STATION_STATUS_BADGE } from "@/lib/status";
import { RAINFALL_TODAY_LABEL, getRainfallTodayLevel } from "@/lib/rainfall-today-level";

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

/** CSV "Perbandingan Defisit Air" dari data yang sudah ke-fetch
 *  (`useWaterDeficit()`) — dipakai tombol "Unduh" di toolbar peta tab
 *  Keseimbangan Air, semangatnya sama seperti `buildStationsCsv`. */
export function buildWaterDeficitCsv(rows: StationWaterDeficit[]): string {
  const header = ["Nama", "Curah Hujan", "Defisit Air", "Hari Hujan", "Kelebihan Air"];

  const lines = rows.map((row) =>
    [
      csvEscape(row.nama),
      row.curahHujan ?? "",
      row.defisitAir ?? "",
      row.hariHujan ?? "",
      row.kelebihanAir ?? "",
    ].join(","),
  );

  return [header.join(","), ...lines].join("\n");
}

/** CSV "Perbandingan Hari Tidak Hujan" dari data yang sudah ke-fetch
 *  (`useDrySpellMap()`) — dipakai tombol "Unduh" di toolbar peta tab
 *  Deret Terpanjang Hari Tidak Hujan, semangatnya sama seperti
 *  `buildWaterDeficitCsv`. */
export function buildDrySpellCsv(rows: StationDrySpell[]): string {
  const header = ["Nama", "Durasi Terakhir (Hari)", "Tanggal Mulai", "Tanggal Selesai"];

  const lines = rows.map((row) =>
    [
      csvEscape(row.nama),
      row.durasiTerakhir ?? "",
      row.tanggalMulai ?? "",
      row.tanggalSelesai ?? "",
    ].join(","),
  );

  return [header.join(","), ...lines].join("\n");
}

/** CSV "Curah Hujan Hari Ini" dari data yang sudah ke-fetch
 *  (`useRainfallToday()`) — dipakai tombol "Unduh" di toolbar peta tab
 *  Curah Hujan Hari Ini, semangatnya sama seperti `buildDrySpellCsv`. */
export function buildRainfallTodayCsv(rows: StationRainfallToday[]): string {
  const header = ["Nama", "Curah Hujan (mm)", "Status"];

  const lines = rows.map((row) =>
    [
      csvEscape(row.nama),
      row.curahHujan ?? "",
      csvEscape(RAINFALL_TODAY_LABEL[getRainfallTodayLevel(row.isHujan)]),
    ].join(","),
  );

  return [header.join(","), ...lines].join("\n");
}
