"use client";

import type { DateRange } from "react-day-picker";
import styled from "styled-components";
import { MultiStationSelect } from "@/components/shared/MultiStationSelect";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";
import { WindDirectionDownloadMenu } from "./WindDirectionDownloadMenu";

export function WindDirectionFilters({
  stations,
  isLoadingStations,
  selectedIds,
  onSelectedIdsChange,
  dateRange,
  onDateRangeChange,
  onDownload,
  downloadDisabled,
}: {
  stations: Station[];
  isLoadingStations: boolean;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onDownload: (stationIds: string[]) => void;
  downloadDisabled: boolean;
}) {
  const selectedStations = stations.filter((s) => selectedIds.includes(s.id));

  return (
    <Row>
      <Filters>
        <MultiStationSelect
          stations={stations}
          selectedIds={selectedIds}
          onChange={onSelectedIdsChange}
          isLoading={isLoadingStations}
        />
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
      </Filters>

      <WindDirectionDownloadMenu
        stations={selectedStations}
        onDownload={onDownload}
        disabled={downloadDisabled}
      />
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;

  ${media.desktop} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
`;

const Filters = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;

  ${media.desktop} {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
  }
`;
