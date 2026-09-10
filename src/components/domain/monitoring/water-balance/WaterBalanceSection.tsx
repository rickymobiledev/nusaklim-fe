"use client";

import { useState } from "react";
import styled from "styled-components";
import { useStations } from "@/hooks/use-stations";
import { useWaterBalance } from "@/hooks/use-water-balance";
import { MonitoringDomainNav } from "@/components/domain/monitoring/MonitoringDomainNav";
import type { WaterBalanceMetric } from "@/types/domain";
import { WaterBalanceFilters } from "./WaterBalanceFilters";
import { WaterBalanceTabs } from "./WaterBalanceTabs";
import { WaterBalanceChart } from "./WaterBalanceChart";

export function WaterBalanceSection() {
  const [stationId, setStationId] = useState<string>();
  const [years, setYears] = useState<number[]>([new Date().getFullYear()]);
  const [metric, setMetric] = useState<WaterBalanceMetric>("waterDeficit");

  const { data: stationsResponse, isLoading: isLoadingStations } = useStations();
  const stations = stationsResponse?.data ?? [];
  // Auto-select stasiun pertama begitu daftar termuat — derived value,
  // BUKAN useEffect+setStationId (ditolak lint react-hooks/set-state-in-effect
  // React Compiler), pola sama persis Beranda (app/(dashboard)/page.tsx).
  // SENGAJA cuma halaman ini (Fase 5) — 3 sub-halaman Monitoring lain
  // belum ikut auto-select.
  const selectedStationId = stationId ?? stationsResponse?.data[0]?.id;

  const { data, isLoading, isError, error } = useWaterBalance({
    stationId: selectedStationId,
    years,
  });
  const series = data ?? [];

  return (
    <Wrapper>
      <PageTitle>Monitoring</PageTitle>

      <MonitoringDomainNav />

      <Divider />

      <SectionTitle>Keseimbangan Air</SectionTitle>

      <WaterBalanceFilters
        stations={stations}
        isLoadingStations={isLoadingStations}
        stationId={selectedStationId}
        onStationIdChange={setStationId}
        years={years}
        onYearsChange={setYears}
        downloadDisabled={series.length === 0}
      />

      <WaterBalanceTabs active={metric} onChange={setMetric} />

      <WaterBalanceChart
        series={selectedStationId ? series : []}
        metric={metric}
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
