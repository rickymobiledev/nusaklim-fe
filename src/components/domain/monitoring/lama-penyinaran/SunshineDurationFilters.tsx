"use client";

import type { DateRange } from "react-day-picker";
import styled from "styled-components";
import { DownloadFormatMenu } from "@/components/shared/DownloadFormatMenu";
import { ALL_FORMATS, type ExportFormat } from "@/lib/export";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { StationSearchSelect } from "@/components/shared/StationSearchSelect";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";

export function SunshineDurationFilters({
  stations,
  isLoadingStations,
  stationId,
  onStationIdChange,
  dateRange,
  onDateRangeChange,
  onDownload,
  downloadDisabled,
}: {
  stations: Station[];
  isLoadingStations: boolean;
  stationId?: string;
  onStationIdChange: (stationId: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onDownload: (format: ExportFormat) => void;
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

      <DownloadFormatMenu
        formats={ALL_FORMATS}
        onSelect={onDownload}
        disabled={downloadDisabled}
      />
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;

  ${media.desktop} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
`;

const Filters = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;

  ${media.desktop} {
    flex-direction: row;
    align-items: center;
  }
`;
