"use client";

import { useState } from "react";
import Link from "next/link";
import { Thermometer, Sun, Gauge, Wind } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { DashboardTitle } from "@/components/domain/beranda/DashboardTitle";
import { StationSyncCard } from "@/components/domain/beranda/StationSyncCard";
import { StationStatsCard } from "@/components/domain/beranda/StationStatsCard";
import { BerandaHeroBanner } from "@/components/domain/beranda/BerandaHeroBanner";
import { WeatherChartCard } from "@/components/domain/beranda/WeatherChartCard";
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
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
            <div />
          </div>
        ) : snapshot ? (
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <WeatherChartCard
                  icon={{ src: "/brand/rainy.png" }}
                  label="Curah Hujan"
                  value={snapshot.rainfall.value}
                  min={snapshot.rainfall.min}
                  max={snapshot.rainfall.max}
                  unit={snapshot.rainfall.unit}
                  chart={snapshot.rainfallDetail?.chart ?? []}
                  status={
                    snapshot.rainfallDetail?.status ?? { tone: "success", message: "" }
                  }
                  chartColor="#175FE2"
                />
                <WeatherChartCard
                  icon={{ src: "/brand/humidity.png" }}
                  label="Kelembapan Relatif"
                  value={snapshot.airHumidity.value}
                  min={snapshot.airHumidity.min}
                  max={snapshot.airHumidity.max}
                  unit={snapshot.airHumidity.unit}
                  chart={snapshot.humidityDetail?.chart ?? []}
                  status={
                    snapshot.humidityDetail?.status ?? { tone: "success", message: "" }
                  }
                  chartColor="#0039FF"
                  headerBorderColor="#C3FAFA"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/air-temperature">
                  <MetricCard
                    icon={Thermometer}
                    label="Temperatur Udara"
                    data={snapshot.airTemperature}
                  />
                </Link>
                <Link href="/solar-radiation">
                  <MetricCard
                    icon={Sun}
                    label="Radiasi Matahari"
                    data={snapshot.solarRadiation}
                  />
                </Link>
                <Link href="/air-pressure">
                  <MetricCard
                    icon={Gauge}
                    label="Tekanan Udara"
                    data={snapshot.airPressure}
                  />
                </Link>
                <MetricCard
                  icon={Wind}
                  label="Kecepatan Angin"
                  data={snapshot.windSpeed}
                />
              </div>
            </div>
            {/* Placeholder sidebar kanan — widget (Periode Monitoring, Deret
                Hari Terpanjang Tidak Hujan, Keseimbangan Air, Lama
                Penyinaran, VPD) menyusul sbg task terpisah, lihat CLAUDE.md. */}
            <div />
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
