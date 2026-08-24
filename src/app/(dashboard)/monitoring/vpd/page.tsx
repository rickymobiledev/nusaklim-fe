"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { StationSelect } from "@/components/shared/StationSelect";
import { DataTable } from "@/components/shared/DataTable";
import { DataState } from "@/components/shared/DataState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useVPD } from "@/hooks/use-vpd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KATEGORI_TONE = {
  rendah: "success",
  sedang: "warning",
  tinggi: "destructive",
} as const;

type DisplayRow = {
  tanggal: string;
  temperaturUdara: string;
  kelembabanUdara: string;
  vpd: string;
  batasAman: string;
  kategori: "rendah" | "sedang" | "tinggi";
};

const columns: ColumnDef<DisplayRow>[] = [
  { accessorKey: "tanggal", header: "Tanggal" },
  { accessorKey: "temperaturUdara", header: "Temperatur Udara" },
  { accessorKey: "kelembabanUdara", header: "Kelembaban Udara" },
  { accessorKey: "vpd", header: "VPD" },
  { accessorKey: "batasAman", header: "Batas Aman" },
  {
    accessorKey: "kategori",
    header: "Cekaman",
    cell: ({ row }) => {
      const kategori = row.original.kategori;
      return <StatusBadge label={`Cekaman ${kategori}`} tone={KATEGORI_TONE[kategori]} />;
    },
  },
];

export default function VpdPage() {
  const [stationId, setStationId] = useState<string>();
  const { data, isLoading, isError, error } = useVPD({ stationId });

  // Panjang tabel ikut apa adanya rentang tanggal dari API.
  const rows = useMemo<DisplayRow[]>(
    () =>
      (data ?? []).map((row) => ({
        tanggal: row.tanggal,
        temperaturUdara: `${row.temperaturUdara} °C`,
        kelembabanUdara: `${row.kelembabanUdara} %`,
        vpd: `${row.vpd} kPa`,
        batasAman: `${row.batasAman} kPa`,
        kategori: row.kategori,
      })),
    [data],
  );

  return (
    <div className="flex flex-col gap-4">
      <StationSelect value={stationId} onChange={setStationId} />

      <Card>
        <CardHeader>
          <CardTitle>VPD (Vapor Pressure Deficit)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataState
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={rows.length === 0}
            emptyMessage="Pilih stasiun untuk melihat VPD"
          >
            <DataTable columns={columns} data={rows} />
          </DataState>
        </CardContent>
      </Card>
    </div>
  );
}
