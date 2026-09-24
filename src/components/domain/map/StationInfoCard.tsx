"use client";

import { useState } from "react";
import styled from "styled-components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "@/components/shared/DashboardIcons";
import { DownloadDataPagination } from "@/components/domain/download-data/DownloadDataTable";
import { mapDeviceStatus } from "@/lib/status";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";

type StatusFilter = "semua" | "aktif" | "tidak_aktif";

/** Warna pill status di tabel ini hex literal Figma (Green/500 & Red/500) —
 *  BEDA dari `STATION_STATUS_BADGE.tidak_aktif` (`#b91c1c`, dipakai popup
 *  peta), jadi sengaja tidak reuse konstanta itu. */
const STATUS_PILL: Record<"aktif" | "tidak_aktif", { label: string; bg: string }> = {
  aktif: { label: "Aktif", bg: "#43B75D" },
  tidak_aktif: { label: "Tidak Aktif", bg: "#EE443F" },
};

export function StationInfoCard({
  stations,
  selectedStationId,
  onSelectStation,
}: {
  stations: Station[];
  selectedStationId: string | null;
  onSelectStation: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("semua");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const keyword = searchTerm.trim().toLowerCase();
  const filtered = stations.filter(
    (s) =>
      s.nama.toLowerCase().includes(keyword) &&
      (statusFilter === "semua" || mapDeviceStatus(s.status) === statusFilter),
  );

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  // Derived, BUKAN useEffect+setPage (ditolak lint react-hooks/set-state-in-effect).
  const effectivePage = Math.min(page, pageCount);
  const start = (effectivePage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  return (
    <Card>
      <Title>Informasi Stasiun</Title>

      <Filters>
        <SearchWrap>
          <SearchInput
            placeholder="Cari Stasiun"
            aria-label="Cari Stasiun"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
          <SearchIcon size={24} />
        </SearchWrap>

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as StatusFilter);
            setPage(1);
          }}
        >
          <StatusTrigger aria-label="Filter status stasiun">
            <SelectValue />
          </StatusTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Status</SelectItem>
            <SelectItem value="aktif">Aktif</SelectItem>
            <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>
      </Filters>

      <TableFrame>
        <ScrollArea>
          <Table>
            <colgroup>
              <col style={{ width: 200 }} />
              <col style={{ width: 100 }} />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <Th $align="left">Nama Stasiun</Th>
                <Th $align="left">Kode</Th>
                <Th>Brand</Th>
                <Th>Latitude</Th>
                <Th>Longitude</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s, index) => {
                const pill = STATUS_PILL[mapDeviceStatus(s.status)];
                return (
                  <Tr
                    key={s.id}
                    $odd={index % 2 === 0}
                    $active={s.id === selectedStationId}
                    onClick={() => onSelectStation(s.id)}
                  >
                    <Td $align="left">{s.nama}</Td>
                    <Td $align="left">{s.id}</Td>
                    <Td>{s.brand}</Td>
                    <Td>{s.lat.toFixed(4)}</Td>
                    <Td>{s.long.toFixed(4)}</Td>
                    <Td>
                      <Pill $bg={pill.bg}>{pill.label}</Pill>
                    </Td>
                  </Tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <EmptyCell colSpan={6}>Stasiun tidak ditemukan.</EmptyCell>
                </tr>
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </TableFrame>

      <DownloadDataPagination
        meta={{ page: effectivePage, pageSize, total }}
        onPageChange={setPage}
        onPageSizeChange={(next) => {
          setPageSize(next);
          setPage(1);
        }}
      />
    </Card>
  );
}

const Card = styled.section`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border-radius: 16px;
`;

const Title = styled.h2`
  margin: 0;
  font-family: "Plus Jakarta Sans", var(--font-body), sans-serif;
  font-size: 18px;
  line-height: 28px;
  font-weight: 700;
  color: #000000;
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

const SearchWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  ${media.desktop} {
    width: 300px;
  }

  svg {
    position: absolute;
    right: 12px;
    pointer-events: none;
  }
`;

const SearchInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 48px;
  padding: 12px 48px 12px 12px;
  background: #ffffff;
  border: 1.5px solid #d6dcd8;
  border-radius: 12px;
  outline: none;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #1d2520;

  &::placeholder {
    color: #8b9c90;
  }

  &:focus-visible {
    border-color: #175fe2;
  }
`;

const StatusTrigger = styled(SelectTrigger)`
  box-sizing: border-box;
  width: 100%;
  height: 48px;
  padding: 12px;
  background: #ffffff;
  border: 1.5px solid #d6dcd8;
  border-radius: 12px;
  box-shadow: none;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #1d2520;

  ${media.desktop} {
    width: 220px;
  }
`;

const TableFrame = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7ea;
  border-radius: 12px;
  overflow: hidden;
`;

const ScrollArea = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  table-layout: fixed;
`;

type Align = "left" | "center";

const Th = styled.th<{ $align?: Align }>`
  box-sizing: border-box;
  height: 60px;
  padding: 8px 12px;
  background: #ffffff;
  text-align: ${(p) => p.$align ?? "center"};
  vertical-align: middle;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: #003f6b;
`;

const Tr = styled.tr<{ $odd: boolean; $active: boolean }>`
  height: 50px;
  background: ${(p) => (p.$active ? "#eff5ff" : p.$odd ? "#f6f8f7" : "#ffffff")};
  border-bottom: 1px solid #ecefed;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background: #eff5ff;
  }
`;

const Td = styled.td<{ $align?: Align }>`
  box-sizing: border-box;
  height: 49px;
  padding: 10px 12px;
  text-align: ${(p) => p.$align ?? "center"};
  vertical-align: middle;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #1d2520;
`;

const EmptyCell = styled.td`
  padding: 40px 12px;
  text-align: center;
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  color: #8b9c90;
`;

const Pill = styled.span<{ $bg: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: ${(p) => p.$bg};
  border-radius: 100px;
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
`;
