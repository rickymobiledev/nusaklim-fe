"use client";

import { useState } from "react";
import styled from "styled-components";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useStations } from "@/hooks/use-stations";
import { useVPD } from "@/hooks/use-vpd";
import { MonitoringDomainNav } from "@/components/domain/monitoring/MonitoringDomainNav";
import { Info } from "lucide-react";
import { downloadCsvFile } from "@/lib/download-data-csv-utils";
import { buildVpdCsv, getBatasAmanKpa } from "@/lib/vpd-summary";
import { VpdFilters } from "./VpdFilters";
import { VpdChart } from "./VpdChart";
import { VpdSummary } from "./VpdSummary";

const DEFAULT_RANGE_DAYS = 10;

export function VpdSection() {
  const [stationId, setStationId] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    return { from: subDays(to, DEFAULT_RANGE_DAYS - 1), to };
  });

  const { data: stationsResponse, isLoading: isLoadingStations } = useStations();
  const stations = stationsResponse?.data ?? [];
  // Auto-select stasiun pertama begitu daftar termuat — derived value,
  // BUKAN useEffect+setStationId (ditolak lint react-hooks/set-state-in-effect
  // React Compiler), pola sama Water Balance/Lama Penyinaran.
  const selectedStationId = stationId ?? stationsResponse?.data[0]?.id;

  const { data, isLoading, isError, error } = useVPD({
    stationId: selectedStationId,
    dateFrom: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    dateTo: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  });
  const rows = data ?? [];
  const visibleRows = selectedStationId ? rows : [];

  function handleDownload() {
    if (visibleRows.length === 0) return;
    const from = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "";
    const to = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "";
    downloadCsvFile(`vpd_${from}_${to}.csv`, buildVpdCsv(visibleRows));
  }

  return (
    <Wrapper>
      <PageTitle>Monitoring</PageTitle>

      <MonitoringDomainNav />

      <Divider />

      <SectionTitle>VPD</SectionTitle>

      <VpdFilters
        stations={stations}
        isLoadingStations={isLoadingStations}
        stationId={selectedStationId}
        onStationIdChange={setStationId}
        dateRange={dateRange}
        onDateRangeChange={(range) => range && setDateRange(range)}
        onDownload={handleDownload}
        downloadDisabled={rows.length === 0}
      />

      <VpdChart
        data={visibleRows}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      <VpdSummary data={visibleRows} />

      <InfoAlert>
        <Info size={20} strokeWidth={1.5} color="#175fe2" />
        <AlertText>
          VPD &gt; {Number(getBatasAmanKpa(visibleRows).toFixed(2))} kPa menandakan bahwa
          tanaman kelapa sawit mengalami stress lingkungan sehingga mengalami perlambatan
          fotosintesis.
        </AlertText>
      </InfoAlert>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-family: var(--font-heading), sans-serif;
  font-size: 24px;
  line-height: 28px;
  font-weight: 700;
  color: #000000;
`;

const Divider = styled.hr`
  margin: 8px 0;
  border: none;
  border-top: 1px solid #d2d5db;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 18px;
  line-height: 28px;
  font-weight: 700;
  color: #000000;
`;

const InfoAlert = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #e6f4ff;
  border: 1.5px solid #0095ff;
  border-radius: 12px;

  & svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const AlertText = styled.p`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #667a6c;
`;
