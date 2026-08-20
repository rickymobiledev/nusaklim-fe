"use client";

import { useState } from "react";
import { StationSelect } from "@/components/weather/station-select";
import { useDeretHariTidakHujan } from "@/hooks/use-weather-snapshot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeretHariTidakHujanPage() {
  const [stationId, setStationId] = useState<string>();
  const { data, isLoading } = useDeretHariTidakHujan(stationId);

  return (
    <div className="flex flex-col gap-4">
      <StationSelect value={stationId} onChange={setStationId} />

      <Card>
        <CardHeader>
          <CardTitle>Deret Hari Terpanjang Tidak Hujan</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Tanggal Mulai</p>
            <p className="text-xl font-semibold">
              {isLoading ? "…" : data?.tanggalMulai ?? "--"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Durasi (hari)</p>
            <p className="tabular-data text-xl font-semibold">
              {isLoading ? "…" : data?.durasiHari ?? "--"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
