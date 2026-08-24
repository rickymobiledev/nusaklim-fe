"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { StationSelect } from "@/components/shared/StationSelect";
import { DataTable } from "@/components/shared/DataTable";
import { DataState } from "@/components/shared/DataState";
import { useSunshineDuration } from "@/hooks/use-sunshine-duration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DisplayRow = {
  tanggal: string;
  lamaPenyinaranJam: string;
  batasBawahJam: string;
};

const columns: ColumnDef<DisplayRow>[] = [
  { accessorKey: "tanggal", header: "Tanggal" },
  { accessorKey: "lamaPenyinaranJam", header: "Lama Penyinaran" },
  { accessorKey: "batasBawahJam", header: "Batas Bawah" },
];

export default function LamaPenyinaranPage() {
  const [stationId, setStationId] = useState<string>();
  const { data, isLoading, isError, error } = useSunshineDuration({ stationId });

  // Panjang tabel ikut apa adanya rentang tanggal dari API.
  const rows = useMemo<DisplayRow[]>(
    () =>
      (data ?? []).map((row) => ({
        tanggal: row.tanggal,
        lamaPenyinaranJam: `${row.lamaPenyinaranJam} jam`,
        batasBawahJam: `${row.batasBawahJam} jam`,
      })),
    [data],
  );

  return (
    <div className="flex flex-col gap-4">
      <StationSelect value={stationId} onChange={setStationId} />

      <Card>
        <CardHeader>
          <CardTitle>Lama Penyinaran</CardTitle>
        </CardHeader>
        <CardContent>
          <DataState
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={rows.length === 0}
            emptyMessage="Pilih stasiun untuk melihat lama penyinaran"
          >
            <DataTable columns={columns} data={rows} />
          </DataState>
        </CardContent>
      </Card>
    </div>
  );
}
