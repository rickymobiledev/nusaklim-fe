"use client";

import { useState } from "react";
import { Thermometer, Sun, Droplets, CloudRain, Gauge, Wind } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { DashboardTitle } from "@/components/domain/beranda/DashboardTitle";
import { StationSyncCard } from "@/components/domain/beranda/StationSyncCard";
import { StationStatsCard } from "@/components/domain/beranda/StationStatsCard";
import { useWeatherMetrics } from "@/hooks/use-weather-metrics";
import { Skeleton } from "@/components/ui/skeleton";

export default function BerandaPage() {
  const [stationId, setStationId] = useState<string>();

  const { data: snapshot, isLoading: loadingSnapshot } = useWeatherMetrics(stationId);

  return (
    <div className="flex flex-col gap-4">
      <DashboardTitle />

      <div className="flex flex-wrap gap-4">
        <StationSyncCard value={stationId} onChange={setStationId} />
        <StationStatsCard />
      </div>

      {loadingSnapshot ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : snapshot ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard
            icon={Thermometer}
            label="Temperatur Udara"
            data={snapshot.temperaturUdara}
          />
          <MetricCard
            icon={Sun}
            label="Radiasi Matahari"
            data={snapshot.radiasiMatahari}
          />
          <MetricCard
            icon={Droplets}
            label="Kelembaban Udara"
            data={snapshot.kelembabanUdara}
          />
          <MetricCard icon={CloudRain} label="Curah Hujan" data={snapshot.curahHujan} />
          <MetricCard icon={Gauge} label="Tekanan Udara" data={snapshot.tekananUdara} />
          <MetricCard
            icon={Wind}
            label="Kecepatan Angin"
            data={snapshot.kecepatanAngin}
          />
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          Pilih stasiun di atas untuk melihat data cuaca terkini.
        </p>
      )}
    </div>
  );
}
