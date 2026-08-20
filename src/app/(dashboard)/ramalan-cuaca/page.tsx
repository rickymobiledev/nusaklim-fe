"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { StationSelect } from "@/components/weather/station-select";
import { DataTable } from "@/components/data-table/data-table";
import { useForecast } from "@/hooks/use-forecast";

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

function fmt(value: number | null, unit: string) {
  return value == null ? "--" : `${value} ${unit}`;
}

export default function RamalanCuacaPage() {
  const [stationId, setStationId] = useState<string>();
  const { data, isLoading } = useForecast(stationId);

  const rows = useMemo<DisplayRow[]>(
    () =>
      (data ?? []).map((r) => ({
        tanggal: r.tanggal,
        temperaturUdara: fmt(r.temperaturUdara, "°C"),
        kelembabanUdara: fmt(r.kelembabanUdara, "%"),
        curahHujan: fmt(r.curahHujan, "mm"),
        radiasiMatahari: fmt(r.radiasiMatahari, "MJ/m²"),
        tekananUdara: fmt(r.tekananUdara, "hPa"),
        kecepatanAngin: fmt(r.kecepatanAngin, "m/s"),
        arahMataAngin: r.arahMataAngin ?? "--",
      })),
    [data],
  );

  return (
    <div className="flex flex-col gap-4">
      <StationSelect value={stationId} onChange={setStationId} />

      <DataTable
        columns={columns}
        data={rows}
        emptyMessage={isLoading ? "Memuat ramalan..." : "Pilih stasiun untuk melihat ramalan cuaca"}
      />

      <p className="text-sm text-muted-foreground">
        Data ini berasal dari model Deep Learning tim Data Analyst, diekspos
        Backend lewat endpoint <code>/forecast</code>.
      </p>
    </div>
  );
}
