"use client";

import { useState } from "react";
import { Thermometer, Sun, Droplets, Gauge, Wind } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { DashboardTitle } from "@/components/domain/beranda/DashboardTitle";
import { StationSyncCard } from "@/components/domain/beranda/StationSyncCard";
import { StationStatsCard } from "@/components/domain/beranda/StationStatsCard";
import { BerandaHeroBanner } from "@/components/domain/beranda/BerandaHeroBanner";
import { RainfallCard } from "@/components/domain/beranda/RainfallCard";
import { useWeatherMetrics } from "@/hooks/use-weather-metrics";
import { Skeleton } from "@/components/ui/skeleton";

export default function BerandaPage() {
  const [stationId, setStationId] = useState<string>();

  const { data: snapshot, isLoading: loadingSnapshot } = useWeatherMetrics(stationId);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative -mx-6 -mt-6 flex flex-col gap-4 px-4 pt-4 lg:px-6 lg:pt-6">
        <BerandaHeroBanner />

        <div className="relative z-10 flex flex-col gap-4">
          <DashboardTitle />

          <div className="flex flex-wrap gap-4">
            <StationSyncCard value={stationId} onChange={setStationId} />
            <StationStatsCard />
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {loadingSnapshot ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : snapshot ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <RainfallCard
              iconSrc="/brand/rainy.png"
              label="Curah Hujan"
              value={snapshot.rainfall.value}
              min={snapshot.rainfall.min}
              max={snapshot.rainfall.max}
              unit={snapshot.rainfall.unit}
              chart={snapshot.rainfallDetail?.chart ?? []}
              status={snapshot.rainfallDetail?.status ?? { tone: "success", message: "" }}
            />
            <MetricCard
              icon={Thermometer}
              label="Temperatur Udara"
              data={snapshot.airTemperature}
            />
            <MetricCard
              icon={Sun}
              label="Radiasi Matahari"
              data={snapshot.solarRadiation}
            />
            <MetricCard
              icon={Droplets}
              label="Kelembaban Udara"
              data={snapshot.airHumidity}
            />
            <MetricCard icon={Gauge} label="Tekanan Udara" data={snapshot.airPressure} />
            <MetricCard icon={Wind} label="Kecepatan Angin" data={snapshot.windSpeed} />
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Pilih stasiun di atas untuk melihat data cuaca terkini.
          </p>
        )}
      </div>
    </div>
  );
}
