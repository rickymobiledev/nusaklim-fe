"use client";

import { useState } from "react";
import Link from "next/link";
import { Thermometer, Sun, Gauge, Wind } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { ForecastCard } from "@/components/domain/beranda/ForecastCard";
import { DashboardGreeting } from "@/components/domain/beranda/DashboardGreeting";
import { StationSyncCard } from "@/components/domain/beranda/StationSyncCard";
import { StationStatsCard } from "@/components/domain/beranda/StationStatsCard";
import { BerandaHeroBanner } from "@/components/domain/beranda/BerandaHeroBanner";
import { WeatherChartCard } from "@/components/domain/beranda/WeatherChartCard";
import { useWeatherMetrics } from "@/hooks/use-weather-metrics";
import { useStations } from "@/hooks/use-stations";
import { Skeleton } from "@/components/ui/skeleton";

export default function BerandaPage() {
  const [stationId, setStationId] = useState<string>();

  const { data: stationsResponse } = useStations();
  const selectedStationId = stationId ?? stationsResponse?.data[0]?.id;

  const { data: snapshot, isLoading: loadingSnapshot } =
    useWeatherMetrics(selectedStationId);

  return (
    <div className="flex flex-col gap-6" data-page="beranda">
      <div className="relative -mx-6 -mt-6 flex flex-col gap-4 px-4 pt-4 lg:px-6 lg:py-6">
        <BerandaHeroBanner />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <DashboardGreeting />
            <StationStatsCard />
          </div>

          <StationSyncCard value={selectedStationId} onChange={setStationId} />
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
              <ForecastCard stationId={selectedStationId} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/rainfall">
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
                </Link>
                <Link href="/relative-humidity">
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
                </Link>
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
                <Link href="/wind-speed">
                  <MetricCard
                    icon={Wind}
                    label="Kecepatan Angin"
                    data={snapshot.windSpeed}
                  />
                </Link>
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
