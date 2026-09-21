"use client";

import { useState } from "react";
import Link from "next/link";
import { ForecastCard } from "@/components/domain/beranda/ForecastCard";
import { BerandaSidePanel } from "@/components/domain/beranda/BerandaSidePanel";
import { DashboardGreeting } from "@/components/domain/beranda/DashboardGreeting";
import { StationSyncCard } from "@/components/domain/beranda/StationSyncCard";
import { StationStatsCard } from "@/components/domain/beranda/StationStatsCard";
import { BerandaHeroBanner } from "@/components/domain/beranda/BerandaHeroBanner";
import { WeatherSummaryCard } from "@/components/domain/beranda/WeatherSummaryCard";
import { useWeatherMetrics } from "@/hooks/use-weather-metrics";
import { useStations } from "@/hooks/use-stations";
import { Skeleton } from "@/components/ui/skeleton";
import { degreesToCardinal } from "@/lib/cardinal-direction";

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
          <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <ForecastCard stationId={selectedStationId} />
                <Link href="/rainfall" className="flex">
                  <WeatherSummaryCard
                    label="Curah Hujan"
                    illustrationSrc="/brand/rainy.png"
                    value={snapshot.rainfall.value}
                    unit={snapshot.rainfall.unit}
                    chart={snapshot.rainfallDetail?.chart ?? []}
                    status={
                      snapshot.rainfallDetail?.status ?? { tone: "success", message: "" }
                    }
                  />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/relative-humidity" className="flex">
                  <WeatherSummaryCard
                    label="Kelembapan Relatif"
                    illustrationSrc="/brand/humidity.png"
                    value={snapshot.airHumidity.value}
                    unit={snapshot.airHumidity.unit}
                    chart={snapshot.humidityDetail?.chart ?? []}
                    status={
                      snapshot.humidityDetail?.status ?? { tone: "success", message: "" }
                    }
                  />
                </Link>
                <Link href="/air-temperature" className="flex">
                  <WeatherSummaryCard
                    label="Temperatur Udara"
                    illustrationSrc="/brand/temperature.png"
                    value={snapshot.airTemperature.value}
                    unit={snapshot.airTemperature.unit}
                    chart={snapshot.temperatureDetail?.chart ?? []}
                    status={
                      snapshot.temperatureDetail?.status ?? {
                        tone: "success",
                        message: "",
                      }
                    }
                  />
                </Link>
                <Link href="/solar-radiation" className="flex">
                  <WeatherSummaryCard
                    label="Radiasi Matahari"
                    illustrationSrc="/brand/weather-sunny.png"
                    value={snapshot.solarRadiation.value}
                    unit={snapshot.solarRadiation.unit}
                    chart={snapshot.solarRadiationDetail?.chart ?? []}
                    status={
                      snapshot.solarRadiationDetail?.status ?? {
                        tone: "success",
                        message: "",
                      }
                    }
                  />
                </Link>
                <Link href="/air-pressure" className="flex">
                  <WeatherSummaryCard
                    label="Tekanan Udara"
                    illustrationSrc="/brand/air-pressure.png"
                    value={snapshot.airPressure.value}
                    unit={snapshot.airPressure.unit}
                    chart={snapshot.airPressureDetail?.chart ?? []}
                    status={
                      snapshot.airPressureDetail?.status ?? {
                        tone: "success",
                        message: "",
                      }
                    }
                  />
                </Link>
                <Link href="/wind-speed" className="flex">
                  <WeatherSummaryCard
                    label="Kecepatan Angin"
                    illustrationSrc="/brand/wind-speed.png"
                    value={snapshot.windSpeed.value}
                    unit={snapshot.windSpeed.unit}
                    chart={snapshot.windSpeedDetail?.chart ?? []}
                    status={
                      snapshot.windSpeedDetail?.status ?? {
                        tone: "success",
                        message: "",
                      }
                    }
                  />
                </Link>
                <Link href="/wind-direction" className="flex">
                  <WeatherSummaryCard
                    label="Arah Mata Angin"
                    illustrationSrc="/brand/wind-direction.png"
                    value={snapshot.windDirection.value}
                    unit={snapshot.windDirection.unit}
                    chart={snapshot.windDirectionDetail?.chart ?? []}
                    status={
                      snapshot.windDirectionDetail?.status ?? {
                        tone: "success",
                        message: "",
                      }
                    }
                    showTrend={false}
                    valueSuffix={
                      snapshot.windDirection.value === null
                        ? undefined
                        : degreesToCardinal(snapshot.windDirection.value)
                    }
                    formatDayValue={(deg) =>
                      deg === null ? "--" : degreesToCardinal(deg)
                    }
                  />
                </Link>
              </div>
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
    </div>
  );
}
