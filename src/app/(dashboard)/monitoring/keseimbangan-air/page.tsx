"use client";

import { useState } from "react";
import { StationSelect } from "@/components/weather/station-select";
import { useKeseimbanganAir } from "@/hooks/use-weather-snapshot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KeseimbanganAirPage() {
  const [stationId, setStationId] = useState<string>();
  const { data, isLoading } = useKeseimbanganAir(stationId);

  return (
    <div className="flex flex-col gap-4">
      <StationSelect value={stationId} onChange={setStationId} />

      <Card>
        <CardHeader>
          <CardTitle>Laporan Keseimbangan Air — {data?.periode ?? "—"}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Curah Hujan", data?.curahHujan],
            ["Defisit Air", data?.defisitAir],
            ["Hari Hujan", data?.hariHujan],
            ["Kelebihan Air", data?.kelebihanAir],
          ].map(([label, value]) => (
            <div key={label as string}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="tabular-data text-xl font-semibold">
                {isLoading ? "…" : (value as number | null) ?? "--"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Catatan: periode monitoring diambil dari data bulan sebelumnya (mengikuti
        perilaku app existing). Tambahkan grafik tren bulanan di sini pakai{" "}
        <code>WeatherTrendChart</code> setelah endpoint historis dari Backend siap.
      </p>
    </div>
  );
}
