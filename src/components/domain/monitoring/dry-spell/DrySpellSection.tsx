"use client";

import { useState } from "react";
import styled from "styled-components";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useStations } from "@/hooks/use-stations";
import { useDrySpell } from "@/hooks/use-dry-spell";
import { MonitoringDomainNav } from "@/components/domain/monitoring/MonitoringDomainNav";
import { DrySpellFilters } from "./DrySpellFilters";
import { DrySpellList } from "./DrySpellList";

/** Beda dari Lama Penyinaran/VPD (10 hari) — periode dry-spell butuh
 *  jendela lebar biar ada isinya, cocok juga sama contoh Figma yang
 *  rentangnya ~1 tahun. */
const DEFAULT_RANGE_DAYS = 365;

export function DrySpellSection() {
  const [stationId, setStationId] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    return { from: subDays(to, DEFAULT_RANGE_DAYS - 1), to };
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
        downloadDisabled={rows.length === 0}
      />

      <DrySpellList
        data={selectedStationId ? rows : []}
        isLoading={isLoading}
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
