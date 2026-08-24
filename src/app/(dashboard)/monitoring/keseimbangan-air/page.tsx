"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { StationSelect } from "@/components/shared/StationSelect";
import { DataTable } from "@/components/shared/DataTable";
import { DataState } from "@/components/shared/DataState";
import { useWaterBalance } from "@/hooks/use-water-balance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BULAN_LABEL: Record<string, string> = {
  jan: "Januari",
  feb: "Februari",
  mar: "Maret",
  apr: "April",
  may: "Mei",
  jun: "Juni",
  jul: "Juli",
  aug: "Agustus",
  sep: "September",
  oct: "Oktober",
  nov: "November",
  dec: "Desember",
};

type DisplayRow = {
  bulan: string;
  curahHujan: string;
  defisitAir: string;
  hariHujan: string;
  kelebihanAir: string;
};

const columns: ColumnDef<DisplayRow>[] = [
  { accessorKey: "bulan", header: "Bulan" },
  { accessorKey: "curahHujan", header: "Curah Hujan" },
  { accessorKey: "defisitAir", header: "Defisit Air" },
  { accessorKey: "hariHujan", header: "Hari Hujan" },
  { accessorKey: "kelebihanAir", header: "Kelebihan Air" },
];

function fmt(value: number | null) {
  return value == null ? "--" : String(value);
}

export default function KeseimbanganAirPage() {
  const [stationId, setStationId] = useState<string>();
  const { data, isLoading, isError, error } = useWaterBalance({ stationId });

  const rows = useMemo<DisplayRow[]>(() => {
    if (!data) return [];
    // Panjang tabel ikut apa adanya array bulanan dari API — jangan hardcode 12.
    return data.bulanan.map((bulan) => ({
      bulan: BULAN_LABEL[bulan.bulan] ?? bulan.bulan,
      curahHujan: fmt(bulan.curahHujan),
      defisitAir: fmt(bulan.defisitAir),
      hariHujan: fmt(bulan.hariHujan),
      kelebihanAir: fmt(bulan.kelebihanAir),
    }));
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <StationSelect value={stationId} onChange={setStationId} />

      <Card>
        <CardHeader>
          <CardTitle>Keseimbangan Air — {data?.tahun ?? "—"}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataState
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={rows.length === 0}
            emptyMessage="Pilih stasiun untuk melihat keseimbangan air"
          >
            <DataTable columns={columns} data={rows} />
          </DataState>
        </CardContent>
      </Card>
    </div>
  );
}
