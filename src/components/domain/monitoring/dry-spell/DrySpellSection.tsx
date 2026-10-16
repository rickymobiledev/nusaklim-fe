"use client";

import { useState } from "react";
import styled from "styled-components";
import { format, startOfYear } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useStations } from "@/hooks/use-stations";
import { useDrySpell } from "@/hooks/use-dry-spell";
import { downloadTabular, type TabularFormat } from "@/lib/export";
import { buildDrySpellCsv } from "@/lib/dry-spell-level";
import { MonitoringDomainNav } from "@/components/domain/monitoring/MonitoringDomainNav";
import { DrySpellFilters } from "./DrySpellFilters";
import { DrySpellList } from "./DrySpellList";

export function DrySpellSection() {
  const [stationId, setStationId] = useState<string>();
  // Default 1 Januari tahun berjalan s/d hari ini — periode dry-spell butuh
  // jendela lebar, dan rentangnya sama dengan kartu dry-spell di Beranda.
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    return { from: startOfYear(to), to };
  });

  const { data: stationsResponse, isLoading: isLoadingStations } = useStations();
  const stations = stationsResponse?.data ?? [];
  // Auto-select stasiun pertama begitu daftar termuat — derived value,
  // BUKAN useEffect+setStationId (ditolak lint react-hooks/set-state-in-effect
  // React Compiler), pola sama Water Balance/Lama Penyinaran/VPD.
  const selectedStationId = stationId ?? stationsResponse?.data[0]?.id;

  const { data, isLoading, isError, error } = useDrySpell({
    stationId: selectedStationId,
    dateFrom: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    dateTo: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  });
  const rows = data ?? [];
  const visibleRows = selectedStationId ? rows : [];

  function handleDownload(exportFormat: TabularFormat) {
    if (visibleRows.length === 0) return;
    const from = dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "";
    const to = dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "";
    void downloadTabular(
      `hari-tanpa-hujan_${from}_${to}`,
      buildDrySpellCsv(visibleRows),
      exportFormat,
    );
  }

  return (
    <Wrapper>
      <PageTitle>Monitoring</PageTitle>

      <MonitoringDomainNav />

      <Divider />

      <SectionTitle>Durasi Hari Tanpa Hujan</SectionTitle>

      <DrySpellFilters
        stations={stations}
        isLoadingStations={isLoadingStations}
        stationId={selectedStationId}
        onStationIdChange={setStationId}
        dateRange={dateRange}
        onDateRangeChange={(range) => range && setDateRange(range)}
        onDownload={handleDownload}
        downloadDisabled={visibleRows.length === 0}
      />

      <DrySpellList
        data={visibleRows}
        isLoading={isLoading || isLoadingStations}
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
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: #000000;
`;
