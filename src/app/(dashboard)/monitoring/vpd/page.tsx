"use client";

import { useState } from "react";
import { StationSelect } from "@/components/weather/station-select";
import { useVpd } from "@/hooks/use-weather-snapshot";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KATEGORI_TONE = {
  rendah: "success",
  sedang: "warning",
  tinggi: "destructive",
} as const;

export default function VpdPage() {
  const [stationId, setStationId] = useState<string>();
  const { data, isLoading } = useVpd(stationId);

  return (
    <div className="flex flex-col gap-4">
      <StationSelect value={stationId} onChange={setStationId} />

      <Card>
        <CardHeader>
          <CardTitle>VPD (Vapor Pressure Deficit)</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <p className="tabular-data text-3xl font-bold">
            {isLoading ? "…" : data?.nilai ?? "--"}
          </p>
          {data?.kategori && (
            <Badge variant={KATEGORI_TONE[data.kategori]}>
              Cekaman {data.kategori}
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
