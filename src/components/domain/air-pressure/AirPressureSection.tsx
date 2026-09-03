"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useStations } from "@/hooks/use-stations";
import { useAirPressureChart } from "@/hooks/use-air-pressure-chart";
import { getStationColor } from "@/lib/station-colors";
import { buildPressureCsv, downloadCsvFile } from "@/lib/air-pressure-chart-utils";
import { media } from "@/lib/breakpoints";
import { AirPressureFilters } from "./AirPressureFilters";
import { AirPressureChart } from "./AirPressureChart";
import { AirPressureStationList } from "./AirPressureStationList";

const DEFAULT_RANGE_DAYS = 21;
const DEFAULT_SELECTED_STATION_COUNT = 3;

export function AirPressureSection() {
  const { data: stationsResponse, isLoading: isLoadingStations } = useStations();
  const stations = useMemo(() => stationsResponse?.data ?? [], [stationsResponse]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    return { from: subDays(to, DEFAULT_RANGE_DAYS - 1), to };
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Sekali stasiun aktif ke-load & belum ada yang dipilih, auto-pilih
  // beberapa stasiun pertama (approksimasi default Figma yang nunjukin 3
  // stasiun terpilih) — guard ref biar tidak retrigger tiap polling
  // useStations() (refetch tiap 5 menit).
  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current || stations.length === 0 || selectedIds.length > 0) return;
    seededRef.current = true;
    setSelectedIds(
      stations
        .filter((s) => s.status === "on")
        .slice(0, DEFAULT_SELECTED_STATION_COUNT)
        .map((s) => s.id),
    );
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

  function handleDownload() {
    const csv = buildPressureCsv(coloredSeries);
    const from = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "mulai";
    const to = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "akhir";
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
        onDownload={handleDownload}
        downloadDisabled={coloredSeries.length === 0}
      />

      <ContentRow>
        <ChartColumn>
          <AirPressureChart
            series={coloredSeries}
            isLoading={isLoadingChart}
            isError={isError}
            error={error}
          />
        </ChartColumn>

        <AirPressureStationList
          series={coloredSeries}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />
      </ContentRow>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${media.desktop} {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const ChartColumn = styled.div`
  min-width: 0;
  flex: 1;
`;
