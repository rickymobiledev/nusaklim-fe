"use client";

import { useState } from "react";
import {
  Smartphone,
  CheckCircle2,
  XCircle,
  Thermometer,
  Sun,
  Droplets,
  CloudRain,
  Gauge,
  Wind,
} from "lucide-react";
import { StatCard } from "@/components/weather/stat-card";
import { WeatherMetricCard } from "@/components/weather/weather-metric-card";
import { StationSelect } from "@/components/weather/station-select";
import { useStationSummary } from "@/hooks/use-stations";
import {
  useDeretHariTidakHujan,
  useKeseimbanganAir,
  useLamaPenyinaran,
  useWeatherSnapshot,
} from "@/hooks/use-weather-snapshot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BerandaPage() {
  const [stationId, setStationId] = useState<string>();

  const { data: summary, isLoading: loadingSummary } = useStationSummary();
  const { data: snapshot, isLoading: loadingSnapshot } = useWeatherSnapshot(stationId);
  const { data: air } = useKeseimbanganAir(stationId);
  const { data: deret } = useDeretHariTidakHujan(stationId);
  const { data: penyinaran } = useLamaPenyinaran(stationId);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          {loadingSummary ? (
            <Skeleton className="h-32 flex-1" />
          ) : (
            <>
              <StatCard icon={Smartphone} label="Total Stasiun" value={summary?.totalStasiun ?? 0} />
              <StatCard
                icon={CheckCircle2}
                label="Stasiun Aktif"
                value={summary?.stasiunAktif ?? 0}
                tone="success"
              />
              <StatCard
                icon={XCircle}
                label="Stasiun Tidak Aktif"
                value={summary?.stasiunTidakAktif ?? 0}
                tone="destructive"
              />
            </>
          )}
        </div>

        <StationSelect value={stationId} onChange={setStationId} />

        {loadingSnapshot ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : snapshot ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <WeatherMetricCard icon={Thermometer} label="Temperatur Udara" data={snapshot.temperaturUdara} />
            <WeatherMetricCard icon={Sun} label="Radiasi Matahari" data={snapshot.radiasiMatahari} />
            <WeatherMetricCard icon={Droplets} label="Kelembaban Udara" data={snapshot.kelembabanUdara} />
            <WeatherMetricCard icon={CloudRain} label="Curah Hujan" data={snapshot.curahHujan} />
            <WeatherMetricCard icon={Gauge} label="Tekanan Udara" data={snapshot.tekananUdara} />
            <WeatherMetricCard icon={Wind} label="Kecepatan Angin" data={snapshot.kecepatanAngin} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Pilih stasiun di atas untuk melihat data cuaca terkini.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Keseimbangan Air</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Curah Hujan" value={air?.curahHujan} />
            <Metric label="Defisit Air" value={air?.defisitAir} />
            <Metric label="Hari Hujan" value={air?.hariHujan} />
            <Metric label="Kelebihan Air" value={air?.kelebihanAir} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deret Hari Terpanjang Tidak Hujan</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Tanggal" value={deret?.tanggalMulai} />
            <Metric label="Durasi (hari)" value={deret?.durasiHari} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lama Penyinaran</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Batas Bawah" value={penyinaran?.batasBawahJam} />
            <Metric label="Batas Atas" value={penyinaran?.batasAtasJam} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="tabular-data font-medium">{value ?? "--"}</p>
    </div>
  );
}
