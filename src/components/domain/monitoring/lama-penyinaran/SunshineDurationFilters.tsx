"use client";

import type { DateRange } from "react-day-picker";
import styled from "styled-components";
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
      </Filters>

      <DownloadButton type="button" onClick={onDownload} disabled={downloadDisabled}>
        <Download size={20} />
        Unduh Data
      </DownloadButton>
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
    width: 300px;
  }

  & svg {
    color: #8b9c90;
  }
`;

const DownloadButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
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

  &:hover {
    background: #eff5ff;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;
