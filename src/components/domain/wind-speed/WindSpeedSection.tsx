"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useStations } from "@/hooks/use-stations";
import { useWindSpeedChart } from "@/hooks/use-wind-speed-chart";
import { getStationColor } from "@/lib/station-colors";
import {
  buildWindSpeedCsv,
  downloadChartImage,
  downloadCsvFile,
} from "@/lib/wind-speed-chart-utils";
import { media } from "@/lib/breakpoints";
import { WindSpeedFilters } from "./WindSpeedFilters";
import { WindSpeedChart } from "./WindSpeedChart";
import { WindSpeedStationList } from "./WindSpeedStationList";

const DEFAULT_RANGE_DAYS = 21;

export function WindSpeedSection() {
  const { data: stationsResponse, isLoading: isLoadingStations } = useStations();
  const stations = useMemo(() => stationsResponse?.data ?? [], [stationsResponse]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    return { from: subDays(to, DEFAULT_RANGE_DAYS - 1), to };
  });
  const [searchTerm, setSearchTerm] = useState("");
  const chartCardRef = useRef<HTMLDivElement>(null);

  // Sekali stasiun ke-load & belum ada yang dipilih, auto-pilih SEMUA
  // stasiun (tanpa filter status) — guard ref biar tidak retrigger tiap
  // polling useStations() (refetch tiap 5 menit).
  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current || stations.length === 0 || selectedIds.length > 0) return;
    seededRef.current = true;
    setSelectedIds(stations.map((s) => s.id));
  }, [stations, selectedIds.length]);

  const {
    data: series,
    isLoading: isLoadingChart,
    isError,
    error,
  } = useWindSpeedChart(selectedIds, dateRange);

  const coloredSeries = (series ?? []).map((s, index) => ({
    ...s,
    color: getStationColor(index),
  }));

  async function handleDownload(exportFormat: "csv" | "png" | "svg") {
    const from = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "mulai";
    const to = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "akhir";

    if (exportFormat === "csv") {
      const csv = buildWindSpeedCsv(coloredSeries);
      downloadCsvFile(`kecepatan-angin_${from}_${to}.csv`, csv);
      return;
    }

    if (!chartCardRef.current) return;
    await downloadChartImage(
      chartCardRef.current,
      `kecepatan-angin_${from}_${to}.${exportFormat}`,
      exportFormat,
    );
  }

  return (
    <Wrapper>
      <WindSpeedFilters
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
          <WindSpeedChart
            series={coloredSeries}
            isLoading={isLoadingChart}
            isError={isError}
            error={error}
            chartRef={chartCardRef}
          />
        </ChartColumn>

        <WindSpeedStationList
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
