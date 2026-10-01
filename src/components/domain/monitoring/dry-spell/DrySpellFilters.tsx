"use client";

import type { DateRange } from "react-day-picker";
import styled from "styled-components";
import { Download } from "lucide-react";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { StationSearchSelect } from "@/components/shared/StationSearchSelect";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";

export function DrySpellFilters({
  stations,
  isLoadingStations,
  stationId,
  onStationIdChange,
  dateRange,
  onDateRangeChange,
  downloadDisabled,
}: {
  stations: Station[];
  isLoadingStations: boolean;
  stationId?: string;
  onStationIdChange: (stationId: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  downloadDisabled: boolean;
}) {
  return (
    <Row>
      <Filters>
        <StationSearchSelect
          variant="outlined"
          desktopWidth={300}
          stations={stations}
          value={stationId}
          onChange={onStationIdChange}
          isLoading={isLoadingStations}
        />
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
      </Filters>

      {/* TODO: belum ada handler — sama seperti tombol "Unduh Data"
          placeholder di halaman Monitoring lain, export data belum
          diimplementasi. */}
      <DownloadButton type="button" disabled={downloadDisabled}>
        <Download size={20} />
        Unduh Data
      </DownloadButton>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  ${media.desktop} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

const DownloadButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  gap: 8px;

  color: #175fe2;
  background: #ffffff;
  border: 1.5px solid #175fe2;
  border-radius: 12px;

  font-family: var(--font-body), sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #eff5ff;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;
