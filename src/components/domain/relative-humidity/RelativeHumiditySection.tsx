"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useStations } from "@/hooks/use-stations";
import { useRelativeHumidityChart } from "@/hooks/use-relative-humidity-chart";
import { getStationColor } from "@/lib/station-colors";
import {
  buildHumidityCsv,
  downloadChartImage,
  downloadCsvFile,
} from "@/lib/relative-humidity-chart-utils";
import { media } from "@/lib/breakpoints";
import { RelativeHumidityFilters } from "./RelativeHumidityFilters";
import { RelativeHumidityChart } from "./RelativeHumidityChart";
import { RelativeHumidityStationList } from "./RelativeHumidityStationList";

const DEFAULT_RANGE_DAYS = 21;

export function RelativeHumiditySection() {
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
  } = useRelativeHumidityChart(selectedIds, dateRange);

  const coloredSeries = (series ?? []).map((s, index) => ({
    ...s,
    color: getStationColor(index),
  }));

  async function handleDownload(exportFormat: "csv" | "png" | "svg") {
    const from = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "mulai";
    const to = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "akhir";

    if (exportFormat === "csv") {
      const csv = buildHumidityCsv(coloredSeries);
      downloadCsvFile(`kelembapan-relatif_${from}_${to}.csv`, csv);
      return;
    }

    if (!chartCardRef.current) return;
    await downloadChartImage(
      chartCardRef.current,
      `kelembapan-relatif_${from}_${to}.${exportFormat}`,
      exportFormat,
    );
  }

  return (
    <Wrapper>
      <RelativeHumidityFilters
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
          <RelativeHumidityChart
            series={coloredSeries}
            isLoading={isLoadingChart}
            isError={isError}
            error={error}
            chartRef={chartCardRef}
          />
        </ChartColumn>

        <RelativeHumidityStationList
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
