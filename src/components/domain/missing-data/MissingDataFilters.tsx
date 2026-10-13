"use client";

import styled from "styled-components";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { StationSearchSelect } from "@/components/shared/StationSearchSelect";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";

/** Filter row tabel Missing Data (Figma "Frame 56"): Pilih Stasiun +
 *  rentang tanggal, di dalam header card dengan sudut atas membulat. */
export function MissingDataFilters({
  stations,
  isLoadingStations,
  stationId,
  onStationIdChange,
  dateRange,
  onDateRangeChange,
}: {
  stations: Station[];
  isLoadingStations: boolean;
  stationId?: string;
  onStationIdChange: (stationId: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}) {
  return (
    <Header>
      <Filters>
        <StationSearchSelect
          variant="outlined"
          desktopWidth={250}
          stations={stations}
          value={stationId}
          onChange={onStationIdChange}
          isLoading={isLoadingStations}
        />

        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
      </Filters>
    </Header>
  );
}

const Header = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 16px 16px 0 0;
`;

const Filters = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: 100%;

  ${media.desktop} {
    flex-direction: row;
    align-items: center;
    width: auto;
  }
`;
