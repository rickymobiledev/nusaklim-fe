"use client";

import styled from "styled-components";
import { Plus, X, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";

const CURRENT_YEAR = new Date().getFullYear();
const MAX_COMPARE_YEARS = 5;
/** Rentang tahun yang bisa dipilih — 15 tahun ke belakang cukup untuk
 *  kebutuhan banding, belum ada acuan Figma soal batas pastinya. */
const YEAR_OPTIONS = Array.from({ length: 16 }, (_, i) => CURRENT_YEAR - i);

export function WaterBalanceFilters({
  stations,
  isLoadingStations,
  stationId,
  onStationIdChange,
  years,
  onYearsChange,
  downloadDisabled,
}: {
  stations: Station[];
  isLoadingStations: boolean;
  stationId?: string;
  onStationIdChange: (stationId: string) => void;
  years: number[];
  onYearsChange: (years: number[]) => void;
  downloadDisabled: boolean;
}) {
  function handleYearChange(index: number, value: string) {
    const next = [...years];
    next[index] = Number(value);
    onYearsChange(next);
  }

  function handleRemoveYear(index: number) {
    onYearsChange(years.filter((_, i) => i !== index));
  }

  function handleAddYear() {
    const nextYear = YEAR_OPTIONS.find((year) => !years.includes(year));
    if (nextYear === undefined) return;
    onYearsChange([...years, nextYear]);
  }

  const canAddYear = years.length < Math.min(MAX_COMPARE_YEARS, YEAR_OPTIONS.length);

  function renderYearOptions(current: number) {
    return YEAR_OPTIONS.map((option) => (
      <SelectItem
        key={option}
        value={String(option)}
        disabled={option !== current && years.includes(option)}
      >
        {option}
      </SelectItem>
    ));
  }

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

        <Select
          value={String(years[0])}
          onValueChange={(value) => handleYearChange(0, value)}
        >
          <YearTrigger>
            <SelectValue />
          </YearTrigger>
          <SelectContent>{renderYearOptions(years[0])}</SelectContent>
        </Select>

        <CompareGroup>
          {years.slice(1).map((year, i) => {
            const index = i + 1;
            return (
              <ExtraYearItem key={index}>
                <Select
                  value={String(year)}
                  onValueChange={(value) => handleYearChange(index, value)}
                >
                  <ExtraYearTrigger>
                    <SelectValue />
                  </ExtraYearTrigger>
                  <SelectContent>{renderYearOptions(year)}</SelectContent>
                </Select>
                <RemoveYearButton
                  type="button"
                  onClick={() => handleRemoveYear(index)}
                  aria-label={`Hapus tahun ${year} dari perbandingan`}
                >
                  <X size={14} />
                </RemoveYearButton>
              </ExtraYearItem>
            );
          })}

          <CompareYearButton type="button" onClick={handleAddYear} disabled={!canAddYear}>
            <Plus size={16} />
            Bandingkan Tahun
          </CompareYearButton>
        </CompareGroup>
      </Filters>

      {/* TODO: belum ada handler — export data chart Monitoring belum
          diimplementasi (beda dari tombol "Unduh Data" di halaman
          `/download-data`, yang sudah punya handler CSV, lihat
          `DownloadDataFilters.tsx`). */}
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

const StationTrigger = styled(SelectTrigger)`
  width: 300px;
  height: 48px;
  padding: 12px;
  background: #f6f8f7;
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

const YearTrigger = styled(SelectTrigger)`
  width: 126px;
  height: 48px;
  padding: 12px;
  background: #f6f8f7;
  border: 1.5px solid #d6dcd8;
  border-radius: 12px;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #1d2520;
`;

/** Grup box tahun tambahan + tombol "+ Bandingkan Tahun" — satu wrapper
 *  bg/border sesuai layer Figma "Frame 110" (bukan box lepas per item
 *  seperti tahun pertama). */
const CompareGroup = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 8px;
  height: 50px;
  background: #f6f8f7;
  border: 1.5px solid #d6dcd8;
  border-radius: 12px;
`;

const ExtraYearItem = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const ExtraYearTrigger = styled(SelectTrigger)`
  width: 79px;
  height: 48px;
  padding: 12px 0;
  border: none;
  background: transparent;
  font-family: var(--font-caption), sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
`;

const RemoveYearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #9ea2ae;
  cursor: pointer;

  &:hover {
    background: #e5e7ea;
    color: #6d717f;
  }
`;

const CompareYearButton = styled.button`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  height: 32px;
  background: transparent;
  border: 1.5px solid #667a6c;
  border-radius: 8px;
  color: #6d717f;
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #e5e7ea;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
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
