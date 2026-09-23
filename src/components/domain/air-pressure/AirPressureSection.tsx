"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useStations } from "@/hooks/use-stations";
import { useAirPressureChart } from "@/hooks/use-air-pressure-chart";
import { getStationColor } from "@/lib/station-colors";
import { buildPressureCsv, downloadCsvFile } from "@/lib/air-pressure-chart-utils";
import { AirPressureFilters } from "./AirPressureFilters";
import { AirPressureChart } from "./AirPressureChart";

const DEFAULT_RANGE_DAYS = 21;

export function AirPressureSection() {
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
  // MultiStationSelect, tidak auto ke-isi ulang. Mirror perbaikan yang
  // sama seperti air-temperature/solar-radiation — dulu auto-pilih
  // SEMUA stasiun, tapi itu fan-out Promise.all ke /weathers/daily per
  // stasiun terpilih di server (lib/api/air-pressure-client.ts) —
  // company dengan ratusan stasiun bikin page load lambat.
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
  } = useAirPressureChart(selectedIds, dateRange);

  const coloredSeries = (series ?? []).map((s, index) => ({
    ...s,
    color: getStationColor(index),
  }));

  function handleDownloadCsv(stationIds: string[]) {
    const from = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "mulai";
    const to = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "akhir";
    const selected = coloredSeries.filter((s) => stationIds.includes(s.stationId));
    const csv = buildPressureCsv(selected);
    downloadCsvFile(`tekanan-udara_${from}_${to}.csv`, csv);
  }

  return (
    <Wrapper>
      <AirPressureFilters
        stations={stations}
        isLoadingStations={isLoadingStations}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        dateRange={dateRange}
        onDateRangeChange={(range) => range && setDateRange(range)}
        onDownload={handleDownloadCsv}
        downloadDisabled={coloredSeries.length === 0}
      />

      <AirPressureChart
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
