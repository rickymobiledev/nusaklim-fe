"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { StationSelect } from "@/components/shared/StationSelect";
import { DataTable } from "@/components/shared/DataTable";
import { DataState } from "@/components/shared/DataState";
import { useDrySpell } from "@/hooks/use-dry-spell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DisplayRow = {
  tanggal: string;
  totalHariKering: number;
  tanggalMulai: string;
  tanggalSelesai: string;
};

const columns: ColumnDef<DisplayRow>[] = [
  { accessorKey: "tanggal", header: "Tanggal" },
  { accessorKey: "totalHariKering", header: "Total Hari Kering" },
  { accessorKey: "tanggalMulai", header: "Mulai" },
  { accessorKey: "tanggalSelesai", header: "Selesai" },
];

export default function DrySpellPage() {
  const [stationId, setStationId] = useState<string>();
  const { data, isLoading, isError, error } = useDrySpell({ stationId });

  // Panjang tabel ikut apa adanya jumlah periode dry-spell dari API.
  const rows = useMemo<DisplayRow[]>(() => data ?? [], [data]);

  return (
    <div className="flex flex-col gap-4">
      <StationSelect value={stationId} onChange={setStationId} />

      <Card>
        <CardHeader>
          <CardTitle>Deret Hari Terpanjang Tidak Hujan</CardTitle>
        </CardHeader>
        <CardContent>
          <DataState
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={rows.length === 0}
            emptyMessage="Pilih stasiun untuk melihat deret hari tidak hujan"
          >
            <DataTable columns={columns} data={rows} />
          </DataState>
        </CardContent>
      </Card>
    </div>
  );
}
