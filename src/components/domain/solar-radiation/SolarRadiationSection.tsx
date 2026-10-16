"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { format as formatDate, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  downloadElementAsImage,
  downloadTabular,
  isImageFormat,
  type ExportFormat,
} from "@/lib/export";
import { useStations } from "@/hooks/use-stations";
import { useSolarRadiationChart } from "@/hooks/use-solar-radiation-chart";
import { getStationColor } from "@/lib/station-colors";
import { buildRadiationCsv } from "@/lib/solar-radiation-chart-utils";
import { SolarRadiationFilters } from "./SolarRadiationFilters";
import { SolarRadiationChart } from "./SolarRadiationChart";

const DEFAULT_RANGE_DAYS = 21;

export function SolarRadiationSection() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { data: stationsResponse, isLoading: isLoadingStations } = useStations();
  const stations = useMemo(() => stationsResponse?.data ?? [], [stationsResponse]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    return { from: subDays(to, DEFAULT_RANGE_DAYS - 1), to };
  });

  // Sekali stasiun ke-load & belum ada yang dipilih, auto-pilih stasiun
  // PERTAMA saja (BUKAN lagi semua stasiun) — guard ref biar tidak
  // retrigger tiap polling useStations() (refetch tiap 5 menit), dan
  // supaya kalau user sengaja mengosongkan semua pilihan manual lewat
  // MultiStationSelect, tidak auto ke-isi ulang. Dulu auto-pilih SEMUA
  // stasiun (matching behaviour project lama), tapi itu fan-out
  // Promise.all ke /weathers/daily per stasiun terpilih di server
  // (lib/api/solar-radiation-client.ts) — company dengan ratusan
  // stasiun bikin page load lambat. Mirror perbaikan yang sama seperti
  // air-temperature; 5 halaman detail cuaca historis lain TETAP
  // auto-pilih semua stasiun.
  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current || stations.length === 0 || selectedIds.length > 0) return;
    seededRef.current = true;
    setSelectedIds([stations[0].id]);
  }, [stations, selectedIds.length]);

  const {
    data: series,
    isLoading: isLoadingChart,
    isError,
    error,
  } = useSolarRadiationChart(selectedIds, dateRange);

  const coloredSeries = (series ?? []).map((s, index) => ({
    ...s,
    color: getStationColor(index),
  }));

  function handleDownload(stationIds: string[], format: ExportFormat) {
    const from = dateRange.from ? formatDate(dateRange.from, "yyyy-MM-dd") : "mulai";
    const to = dateRange.to ? formatDate(dateRange.to, "yyyy-MM-dd") : "akhir";
    const basename = `radiasi-matahari_${from}_${to}`;
    if (isImageFormat(format)) {
      if (chartRef.current)
        void downloadElementAsImage(chartRef.current, basename, format);
      return;
    }
    const selected = coloredSeries.filter((s) => stationIds.includes(s.stationId));
    const csv = buildRadiationCsv(selected);
    void downloadTabular(basename, csv, format);
  }

  return (
    <Wrapper>
      <SolarRadiationFilters
        stations={stations}
        isLoadingStations={isLoadingStations}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        dateRange={dateRange}
        onDateRangeChange={(range) => range && setDateRange(range)}
        onDownload={handleDownload}
        downloadDisabled={coloredSeries.length === 0}
      />

      <SolarRadiationChart
        series={coloredSeries}
        isLoading={isLoadingChart}
        isError={isError}
        error={error}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
