"use client";

import { useState } from "react";
import { StationSelect } from "@/components/weather/station-select";
import { useLamaPenyinaran } from "@/hooks/use-weather-snapshot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LamaPenyinaranPage() {
  const [stationId, setStationId] = useState<string>();
  const { data, isLoading } = useLamaPenyinaran(stationId);

  return (
    <div className="flex flex-col gap-4">
      <StationSelect value={stationId} onChange={setStationId} />

      <Card>
        <CardHeader>
          <CardTitle>Lama Penyinaran</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Batas Bawah (jam)</p>
            <p className="tabular-data text-xl font-semibold">
              {isLoading ? "…" : data?.batasBawahJam ?? "--"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Batas Atas (jam)</p>
            <p className="tabular-data text-xl font-semibold">
              {isLoading ? "…" : data?.batasAtasJam ?? "--"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
