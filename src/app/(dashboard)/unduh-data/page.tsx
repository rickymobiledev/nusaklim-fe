"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, Search } from "lucide-react";
import { StationSelect } from "@/components/shared/StationSelect";
import { DataTable } from "@/components/shared/DataTable";
import { DataState } from "@/components/shared/DataState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DATA_GRANULARITY } from "@/constants";
import { useDownloadData } from "@/hooks/use-download-data";
import type { DataGranularity } from "@/types/domain";

type DisplayRow = {
  tanggal: string;
  rerataTemperatur: string;
  totalCurahHujan: string;
  totalRadiasi: string;
  rerataTekananUdara: string;
  rerataKecepatanAngin: string;
  arahMataAngin: string;
};

const columns: ColumnDef<DisplayRow>[] = [
  { accessorKey: "tanggal", header: "Tanggal" },
  { accessorKey: "rerataTemperatur", header: "Rerata Temperatur" },
  { accessorKey: "totalCurahHujan", header: "Total Curah Hujan" },
  { accessorKey: "totalRadiasi", header: "Total Radiasi" },
  { accessorKey: "rerataTekananUdara", header: "Rerata Tekanan Udara" },
  { accessorKey: "rerataKecepatanAngin", header: "Rerata Kecepatan Angin" },
  { accessorKey: "arahMataAngin", header: "Arah Mata Angin" },
];

function fmt(value: number | null, unit: string) {
  return value == null ? "--" : `${value} ${unit}`;
}

export default function UnduhDataPage() {
  const [stationId, setStationId] = useState<string>();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [granularity, setGranularity] = useState<DataGranularity>("harian");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, error, refetch } = useDownloadData({
    stationId,
    dateFrom,
    dateTo,
    granularity,
    page,
  });

  const rows = useMemo<DisplayRow[]>(
    () =>
      (data?.data ?? []).map((r) => ({
        tanggal: r.tanggal,
        rerataTemperatur: fmt(r.rerataTemperatur, "°C"),
        totalCurahHujan: fmt(r.totalCurahHujan, "mm"),
        totalRadiasi: fmt(r.totalRadiasi, "MJ/m²"),
        rerataTekananUdara: fmt(r.rerataTekananUdara, "hPa"),
        rerataKecepatanAngin: fmt(r.rerataKecepatanAngin, "m/s"),
        arahMataAngin: r.arahMataAngin ?? "--",
      })),
    [data],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <StationSelect value={stationId} onChange={setStationId} />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="from">Dari Tanggal</Label>
          <Input
            id="from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="to">Sampai Tanggal</Label>
          <Input
            id="to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        <Button onClick={() => refetch()}>
          <Search /> Cari
        </Button>
      </div>

      <div className="border-border flex gap-1 border-b">
        {DATA_GRANULARITY.map((g) => (
          <button
            key={g.value}
            onClick={() => setGranularity(g.value)}
            className={cn(
              "px-3 py-2 text-sm font-medium transition-colors",
              granularity === g.value
                ? "border-primary text-primary border-b-2"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        {/* Rekomendasi: biarkan Backend generate file (CSV/XLSX) dan endpoint
            ini cukup mengembalikan URL/blob untuk didownload — jangan hitung
            ulang & format file besar di client. */}
        <Button variant="secondary" disabled={rows.length === 0}>
          <Download /> Unduh Data
        </Button>
      </div>

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isFetching && rows.length === 0}
        emptyMessage={isFetching ? "Memuat data..." : "Data Tidak Tersedia"}
      >
        <DataTable
          columns={columns}
          data={rows}
          meta={data?.meta}
          onPageChange={setPage}
        />
      </DataState>
    </div>
  );
}
