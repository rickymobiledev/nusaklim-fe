"use client";

import type { DateRange } from "react-day-picker";
import styled from "styled-components";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiStationSelect } from "@/components/shared/MultiStationSelect";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";

export function AirPressureFilters({
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
  onDownload: () => void;
  downloadDisabled: boolean;
}) {
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

      <DownloadButton variant="outline" onClick={onDownload} disabled={downloadDisabled}>
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
  gap: 16px;
`;

const DownloadButton = styled(Button)`
  color: #175fe2;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;

  background: #ffffff;
  border: 1.5px solid #175fe2;
  border-radius: 12px;

  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  align-items: center;
  text-align: center;

  &:hover {
    background: #eff5ff;
  }
`;
