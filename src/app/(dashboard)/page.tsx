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
import { StatCard } from "@/components/shared/StatCard";
import { MetricCard } from "@/components/shared/MetricCard";
import { StationSelect } from "@/components/shared/StationSelect";
import { useStationSummary } from "@/hooks/use-stations";
import { useWeatherMetrics } from "@/hooks/use-weather-metrics";
import { useWaterBalance } from "@/hooks/use-water-balance";
import { useDrySpell } from "@/hooks/use-dry-spell";
import { useSunshineDuration } from "@/hooks/use-sunshine-duration";
import { BULAN_ORDER } from "@/types/domain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BerandaPage() {
  const [stationId, setStationId] = useState<string>();

  const { data: summary, isLoading: loadingSummary } = useStationSummary();
  const { data: snapshot, isLoading: loadingSnapshot } = useWeatherMetrics(stationId);
  const { data: air } = useWaterBalance({ stationId });
  const { data: deretList } = useDrySpell({ stationId });
  const { data: penyinaranList } = useSunshineDuration({ stationId });

  // WaterBalance sekarang data setahun (bulanan[]) — ambil bulan berjalan.
  const bulanIni = BULAN_ORDER[new Date().getMonth()];
  const airBulanIni = air?.bulanan.find((b) => b.bulan === bulanIni);
  // DrySpell/SunshineDuration sekarang list per periode/hari — ambil yang paling baru.
  const deret = deretList?.at(-1);
  const penyinaran = penyinaranList?.at(-1);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          {loadingSummary ? (
            <Skeleton className="h-32 flex-1" />
          ) : (
            <>
              <StatCard
                icon={Smartphone}
                label="Total Stasiun"
                value={summary?.totalStasiun ?? 0}
              />
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

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Keseimbangan Air</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Curah Hujan" value={airBulanIni?.curahHujan} />
            <Metric label="Defisit Air" value={airBulanIni?.defisitAir} />
            <Metric label="Hari Hujan" value={airBulanIni?.hariHujan} />
            <Metric label="Kelebihan Air" value={airBulanIni?.kelebihanAir} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deret Hari Terpanjang Tidak Hujan</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Tanggal Mulai" value={deret?.tanggalMulai} />
            <Metric label="Total Hari Kering" value={deret?.totalHariKering} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lama Penyinaran</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Lama Penyinaran (jam)" value={penyinaran?.lamaPenyinaranJam} />
            <Metric label="Batas Bawah (jam)" value={penyinaran?.batasBawahJam} />
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
