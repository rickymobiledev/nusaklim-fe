"use client";

import styled from "styled-components";
import type { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
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
        <Select
          value={stationId}
          onValueChange={onStationIdChange}
          disabled={isLoadingStations}
        >
          <StationTrigger aria-label="Pilih Stasiun">
            <SelectValue
              placeholder={isLoadingStations ? "Memuat stasiun..." : "Pilih Stasiun"}
            />
          </StationTrigger>
          <SelectContent>
            {stations.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

const StationTrigger = styled(SelectTrigger)`
  width: 100%;
  height: 48px;
  padding: 12px;
  background: #ffffff;
  border: 1.5px solid #d6dcd8;
  border-radius: 12px;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #1d2520;

  ${media.desktop} {
    width: 250px;
  }

  & svg {
    color: #8b9c90;
  }
`;
