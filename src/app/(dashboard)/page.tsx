"use client";

import { useState } from "react";
import Link from "next/link";
import { ForecastCard } from "@/components/domain/beranda/ForecastCard";
import { RainfallHeatmapCard } from "@/components/domain/beranda/RainfallHeatmapCard";
import { NewsCard } from "@/components/domain/beranda/NewsCard";
import { BerandaSidePanel } from "@/components/domain/beranda/BerandaSidePanel";
import { DashboardGreeting } from "@/components/domain/beranda/DashboardGreeting";
import { StationSyncCard } from "@/components/domain/beranda/StationSyncCard";
import { StationStatsCard } from "@/components/domain/beranda/StationStatsCard";
import { BerandaHeroBanner } from "@/components/domain/beranda/BerandaHeroBanner";
import { WeatherSummaryCard } from "@/components/domain/beranda/WeatherSummaryCard";
import { useLatestWeather, computeDayTrend } from "@/hooks/use-latest-weather";
import type { LatestWeatherItem } from "@/lib/api/latest-weather-client";
import { useStations } from "@/hooks/use-stations";
import { Skeleton } from "@/components/ui/skeleton";

function toCardProps(item?: LatestWeatherItem, isWindDirection = false) {
  return {
    displayValue: item?.latest_10_min ?? "--",
    days:
      item?.last_3_days?.map((d) => ({
        date: d.date,
        valueText: isWindDirection
          ? (d.average_direction ?? d.average ?? "--")
          : (d.average ?? d.sum ?? "--"),
      })) ?? [],
    trendPercent: isWindDirection ? null : computeDayTrend(item?.last_3_days),
    status: {
      tone: "warning" as const,
      message:
        item?.interpretation && item.interpretation !== "---"
          ? item.interpretation
          : "",
    },
  };
}

export default function BerandaPage() {
  const [stationId, setStationId] = useState<string>();

  const { data: stationsResponse } = useStations();
  const selectedStationId = stationId ?? stationsResponse?.data[0]?.id;

  const {
    weatherMap,
    lastSync,
    isLoading: loadingWeather,
  } = useLatestWeather(selectedStationId);

  const rainfallProps = toCardProps(weatherMap["rainfall"]);
  const humidityProps = toCardProps(weatherMap["humidity"]);
  const tempProps = toCardProps(weatherMap["temperature"]);
  const solarProps = toCardProps(weatherMap["solar_radiation"]);
  const pressureProps = toCardProps(weatherMap["air_pressure"]);
  const windSpeedProps = toCardProps(weatherMap["wind_speed"]);
  const windDirItem = weatherMap["wind_direction"];
  const windDirProps = toCardProps(windDirItem, true);

  return (
    <div className="flex flex-col gap-6" data-page="beranda">
      <div className="relative -mx-4 -mt-6 flex flex-col gap-4 px-4 py-4 lg:-mx-6 lg:px-6 lg:py-6">
        <BerandaHeroBanner />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <DashboardGreeting />
            <StationStatsCard />
          </div>

          <StationSyncCard
            value={selectedStationId}
            onChange={setStationId}
            lastSync={lastSync}
          />
        </div>
      </div>

      <div className="relative z-10">
        {loadingWeather ? (
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
            <div />
          </div>
        ) : selectedStationId ? (
          <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_300px]">
            <div className="flex min-w-0 flex-col gap-4">
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <ForecastCard stationId={selectedStationId} />
                <Link href="/rainfall" className="flex">
                  <WeatherSummaryCard
                    label="Curah Hujan"
                    illustrationSrc="/brand/rainy.png"
                    {...rainfallProps}
                  />
                </Link>
              </div>
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <Link href="/relative-humidity" className="flex">
                  <WeatherSummaryCard
                    label="Kelembapan Relatif"
                    illustrationSrc="/brand/humidity.png"
                    {...humidityProps}
                  />
                </Link>
                <Link href="/air-temperature" className="flex">
                  <WeatherSummaryCard
                    label="Temperatur Udara"
                    illustrationSrc="/brand/temperature.png"
                    {...tempProps}
                  />
                </Link>
                <Link href="/solar-radiation" className="flex">
                  <WeatherSummaryCard
                    label="Radiasi Matahari"
                    illustrationSrc="/brand/weather-sunny.png"
                    {...solarProps}
                  />
                </Link>
                <Link href="/air-pressure" className="flex">
                  <WeatherSummaryCard
                    label="Tekanan Udara"
                    illustrationSrc="/brand/air-pressure.png"
                    {...pressureProps}
                  />
                </Link>
                <Link href="/wind-speed" className="flex">
                  <WeatherSummaryCard
                    label="Kecepatan Angin"
                    illustrationSrc="/brand/wind-speed.png"
                    {...windSpeedProps}
                  />
                </Link>
                <Link href="/wind-direction" className="flex">
                  <WeatherSummaryCard
                    label="Arah Mata Angin"
                    illustrationSrc="/brand/wind-direction.png"
                    {...windDirProps}
                    showTrend={false}
                    valueSuffix={windDirItem?.latest_10_min_direction}
                  />
                </Link>
              </div>

              <RainfallHeatmapCard stationId={selectedStationId} />
            </div>
            {/* Sidebar kanan — baru alert info + Deret Hari Terpanjang Tidak
                Hujan; Keseimbangan Air, Lama Penyinaran, VPD menyusul sbg
                task terpisah, lihat CLAUDE.md. */}
            <BerandaSidePanel stationId={selectedStationId} />
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Pilih stasiun di atas untuk melihat data cuaca terkini.
          </p>
        )}
      </div>

      <NewsCard />
    </div>
  );
}
