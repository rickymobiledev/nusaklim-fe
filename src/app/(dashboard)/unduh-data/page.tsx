"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, Search } from "lucide-react";
import { StationSelect } from "@/components/weather/station-select";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DATA_GRANULARITY } from "@/lib/constants";
import { useWeatherDataTable } from "@/hooks/use-forecast";
import type { DataGranularity } from "@/types/domain";

type DisplayRow = {
  tanggal: string;
  rerataTemperaturUdaraMin: string;
  rerataTemperaturUdaraMax: string;
  totalCurahHujan: string;
  totalRadiasiMatahari: string;
  rerataTekananUdara: string;
  rerataKecepatanAngin: string;
  arahMataAngin: string;
};

const columns: ColumnDef<DisplayRow>[] = [
  { accessorKey: "tanggal", header: "Tanggal" },
  { accessorKey: "rerataTemperaturUdaraMin", header: "Rerata Temperatur Udara (Min)" },
  { accessorKey: "rerataTemperaturUdaraMax", header: "Rerata Temperatur Udara (Maks)" },
  { accessorKey: "totalCurahHujan", header: "Total Curah Hujan" },
  { accessorKey: "totalRadiasiMatahari", header: "Total Radiasi Matahari" },
  { accessorKey: "rerataTekananUdara", header: "Rerata Tekanan Udara" },
  { accessorKey: "rerataKecepatanAngin", header: "Rerata Kecepatan Angin" },
  { accessorKey: "arahMataAngin", header: "Arah Mata Angin" },
];

function fmt(value: number | null, unit: string) {
  return value == null ? "--" : `${value} ${unit}`;
}

export default function UnduhDataPage() {
  const [stationId, setStationId] = useState<string>();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [granularity, setGranularity] = useState<DataGranularity>("harian");

  const { data, isFetching, refetch } = useWeatherDataTable({
    stationId,
    from,
    to,
    granularity,
  });

  const rows = useMemo<DisplayRow[]>(
    () =>
      (data ?? []).map((r) => ({
        tanggal: r.tanggal,
        rerataTemperaturUdaraMin: fmt(r.rerataTemperaturUdaraMin, "°C"),
        rerataTemperaturUdaraMax: fmt(r.rerataTemperaturUdaraMax, "°C"),
        totalCurahHujan: fmt(r.totalCurahHujan, "mm"),
        totalRadiasiMatahari: fmt(r.totalRadiasiMatahari, "MJ/m²"),
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
          <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="to">Sampai Tanggal</Label>
          <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>

        <Button onClick={() => refetch()}>
          <Search /> Cari
        </Button>
      </div>

      <div className="flex gap-1 border-b border-border">
        {DATA_GRANULARITY.map((g) => (
          <button
            key={g.value}
            onClick={() => setGranularity(g.value)}
            className={cn(
              "px-3 py-2 text-sm font-medium transition-colors",
              granularity === g.value
                ? "border-b-2 border-primary text-primary"
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

      <DataTable
        columns={columns}
        data={rows}
        emptyMessage={isFetching ? "Memuat data..." : "Data Tidak Tersedia"}
      />
    </div>
  );
}
