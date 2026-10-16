"use client";

import styled from "styled-components";
import type { DateRange } from "react-day-picker";
import { DownloadFormatMenu } from "@/components/shared/DownloadFormatMenu";
import { TABULAR_FORMATS, type TabularFormat } from "@/lib/export";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { StationSearchSelect } from "@/components/shared/StationSearchSelect";
import { media } from "@/lib/breakpoints";
import { DATA_GRANULARITY } from "@/constants";
import type { DataGranularity, Station } from "@/types/domain";
import type { Company } from "@/types/user-management";

export function DownloadDataFilters({
  companies,
  isLoadingCompanies,
  companyCode,
  onCompanyCodeChange,
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
  companies: Company[];
  isLoadingCompanies: boolean;
  companyCode?: string;
  onCompanyCodeChange: (companyCode: string) => void;
  stations: Station[];
  isLoadingStations: boolean;
  stationId?: string;
  onStationIdChange: (stationId: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  granularity: DataGranularity;
  onGranularityChange: (granularity: DataGranularity) => void;
  onDownload: (format: TabularFormat) => void;
  downloadDisabled: boolean;
}) {
  return (
    <Row>
      <Filters>
        <Select
          value={companyCode ?? ""}
          onValueChange={onCompanyCodeChange}
          disabled={isLoadingCompanies}
        >
          <RegionalTrigger aria-label="Regional">
            <SelectValue
              placeholder={isLoadingCompanies ? "Memuat regional..." : "Pilih Regional"}
            />
          </RegionalTrigger>
          <SelectContent>
            {companies.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <StationSearchSelect
          variant="outlined"
          desktopWidth={250}
          stations={stations}
          value={stationId}
          onChange={onStationIdChange}
          isLoading={isLoadingStations || !companyCode}
        />

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

      <DownloadFormatMenu
        formats={TABULAR_FORMATS}
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
  gap: 12px;

  ${media.desktop} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
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
  }
`;

const RegionalTrigger = styled(SelectTrigger)`
  width: 100%;

  ${media.desktop} {
    width: 250px;
  }

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
  width: 100%;

  ${media.desktop} {
    width: 173px;
  }

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
