"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { StationSelect } from "@/components/shared/StationSelect";
import { DataTable } from "@/components/shared/DataTable";
import { useForecast } from "@/hooks/use-forecast";
import { degreesToCompass } from "@/lib/utils";

type DisplayRow = {
  tanggal: string;
  temperaturUdara: string;
  kelembabanUdara: string;
  curahHujan: string;
  radiasiMatahari: string;
  tekananUdara: string;
  kecepatanAngin: string;
  arahMataAngin: string;
};

const columns: ColumnDef<DisplayRow>[] = [
  { accessorKey: "tanggal", header: "Tanggal" },
  { accessorKey: "temperaturUdara", header: "Temperatur Udara" },
  { accessorKey: "kelembabanUdara", header: "Kelembaban Udara" },
  { accessorKey: "curahHujan", header: "Curah Hujan" },
  { accessorKey: "radiasiMatahari", header: "Radiasi Matahari" },
  { accessorKey: "tekananUdara", header: "Tekanan Udara" },
  { accessorKey: "kecepatanAngin", header: "Kecepatan Angin" },
  { accessorKey: "arahMataAngin", header: "Arah Mata Angin" },
];

function fmt(value: number, unit?: string) {
  return unit ? `${value} ${unit}` : `${value}`;
}

export default function RamalanCuacaPage() {
  const [stationId, setStationId] = useState<string>();
  const { data, isLoading } = useForecast(stationId);

  const rows = useMemo<DisplayRow[]>(() => {
    if (!data) return [];
    const { units } = data;

    // Panjang tabel ikut apa adanya array forecast dari API — durasi
    // horizon bisa berubah begitu model DL baru selesai, jangan hardcode 7.
    return data.forecast.map((day) => ({
      tanggal: day.date,
      temperaturUdara: fmt(day.temperature, units.temperature),
      kelembabanUdara: fmt(day.humidity, units.humidity),
      curahHujan: fmt(day.rainfall, units.rainfall),
      radiasiMatahari: fmt(day.radiation, units.radiation),
      tekananUdara: fmt(day.airPressure, units.airPressure),
      kecepatanAngin: fmt(day.windSpeed, units.windSpeed),
      arahMataAngin: degreesToCompass(day.windDirectionDeg),
    }));
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <StationSelect value={stationId} onChange={setStationId} />

      <DataTable
        columns={columns}
        data={rows}
        emptyMessage={
          isLoading ? "Memuat ramalan..." : "Pilih stasiun untuk melihat ramalan cuaca"
        }
      />

      <p className="text-muted-foreground text-sm">
        Data ini berasal dari model Deep Learning tim Data Analyst, diekspos Backend lewat
        endpoint <code>/forecast</code>.
      </p>
    </div>
  );
}
