"use client";

import styled from "styled-components";
import type { DateRange } from "react-day-picker";
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { media } from "@/lib/breakpoints";
import { DATA_GRANULARITY } from "@/constants";
import type { DataGranularity, Station } from "@/types/domain";

export function DownloadDataFilters({
  stations,
  isLoadingStations,
  stationId,
  onStationIdChange,
  dateRange,
  onDateRangeChange,
  granularity,
  onGranularityChange,
  onDownload,
  downloadDisabled,
}: {
  stations: Station[];
  isLoadingStations: boolean;
  stationId?: string;
  onStationIdChange: (stationId: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  granularity: DataGranularity;
  onGranularityChange: (granularity: DataGranularity) => void;
  onDownload: () => void;
  downloadDisabled: boolean;
}) {
  return (
    <Row>
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

        <Select
          value={granularity}
          onValueChange={(value) => onGranularityChange(value as DataGranularity)}
        >
          <GranularityTrigger aria-label="Granularitas Data">
            <SelectValue />
          </GranularityTrigger>
          <SelectContent>
            {DATA_GRANULARITY.map((g) => (
              <SelectItem key={g.value} value={g.value}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Filters>

      <DownloadButton type="button" onClick={onDownload} disabled={downloadDisabled}>
        <Download size={24} />
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

const StationTrigger = styled(SelectTrigger)`
  width: 250px;
  height: 48px;
  padding: 12px;
  background: #ffffff;
  border: 1.5px solid #d6dcd8;
  border-radius: 12px;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #1d2520;

  & svg {
    color: #8b9c90;
  }
`;

const GranularityTrigger = styled(SelectTrigger)`
  width: 173px;
  height: 48px;
  padding: 12px;
  background: #ffffff;
  border: 1.5px solid #d6dcd8;
  border-radius: 12px;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #1d2520;

  & svg {
    color: #8b9c90;
  }
`;

const DownloadButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 40px;
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
  white-space: nowrap;

  &:hover {
    background: #eff5ff;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;
