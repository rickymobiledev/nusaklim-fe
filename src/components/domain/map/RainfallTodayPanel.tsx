"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoEmptyIcon, SearchIcon } from "@/components/shared/DashboardIcons";
import { DownloadDataPagination } from "@/components/domain/download-data/DownloadDataTable";
import { media } from "@/lib/breakpoints";
import {
  getRainfallTodayLevel,
  RAINFALL_TODAY_COLOR,
  RAINFALL_TODAY_LABEL,
} from "@/lib/rainfall-today-level";
import type { RainfallTodayLevel, StationRainfallToday } from "@/types/domain";

type StatusFilter = "semua" | RainfallTodayLevel;

/** Warna pill status tabel ini hex literal Figma — Hujan biru `#175FE2`
 *  (BEDA dari `RAINFALL_TODAY_COLOR.hujan` `#0095FF` yang dipakai marker/
 *  legend peta), Tidak Hujan reuse merah yang sama dengan peta. */
const PILL_BG: Record<RainfallTodayLevel, string> = {
  hujan: "#175FE2",
  tidak_hujan: RAINFALL_TODAY_COLOR.tidak_hujan,
};

/** Kartu "Informasi Curah Hujan" tab Peta > Curah Hujan Hari Ini — layout
 *  Figma baru: di BAWAH peta full-width (bukan panel kanan 300px lagi),
 *  pola sama `StationInfoCard.tsx`. TANPA sort/badge sinkronisasi/banner
 *  warning (tidak ada di Figma tab ini, metrik boolean tidak punya urutan
 *  bermakna). Baca `rows` yang SAMA dengan peta (`/devices/rainfall_today`). */
export function RainfallTodayPanel({ rows }: { rows: StationRainfallToday[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("semua");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Endpoint otomatis "hari ini" di sisi BE (tanpa param tanggal), jadi teks
  // alert menampilkan tanggal hari ini, bukan "bulan ..." seperti data
  // contoh Figma.
  const tanggalIni = useMemo(
    () => format(new Date(), "d MMMM yyyy", { locale: idLocale }),
    [],
  );

  const filtered = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return rows.filter(
      (r) =>
        r.nama.toLowerCase().includes(keyword) &&
        (statusFilter === "semua" || getRainfallTodayLevel(r.isHujan) === statusFilter),
    );
  }, [rows, searchTerm, statusFilter]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  // Derived, BUKAN useEffect+setPage (ditolak lint react-hooks/set-state-in-effect).
  const effectivePage = Math.min(page, pageCount);
  const start = (effectivePage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  return (
    <>
      <InfoAlert>
        <InfoEmptyIcon size={20} />
        <AlertText>Data curah hujan untuk hari ini, {tanggalIni}.</AlertText>
      </InfoAlert>

      <Card>
        <Title>Informasi Curah Hujan</Title>

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
            <StatusTrigger aria-label="Filter status curah hujan">
              <SelectValue />
            </StatusTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Status</SelectItem>
              <SelectItem value="hujan">{RAINFALL_TODAY_LABEL.hujan}</SelectItem>
              <SelectItem value="tidak_hujan">
                {RAINFALL_TODAY_LABEL.tidak_hujan}
              </SelectItem>
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
              </colgroup>
              <thead>
                <tr>
                  <Th>Nama Stasiun</Th>
                  <Th>Kode</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, index) => {
                  const level = getRainfallTodayLevel(row.isHujan);
                  return (
                    <Tr key={row.stationId} $odd={index % 2 === 0}>
                      <Td>{row.nama}</Td>
                      <Td>{row.stationId}</Td>
                      <Td>
                        <Pill $bg={PILL_BG[level]}>{RAINFALL_TODAY_LABEL[level]}</Pill>
                      </Td>
                    </Tr>
                  );
                })}
                {pageRows.length === 0 && (
                  <tr>
                    <EmptyCell colSpan={3}>Stasiun tidak ditemukan.</EmptyCell>
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
    </>
  );
}

const InfoAlert = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #eff5ff;
  border: 1.5px solid #175fe2;
  border-radius: 12px;

  svg {
    flex: none;
  }
`;

const AlertText = styled.p`
  margin: 0;
  font-family: "Plus Jakarta Sans", var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #667a6c;
`;

const Card = styled.section`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 20px;
`;

const Title = styled.h2`
  margin: 0;
  font-family: "Plus Jakarta Sans", var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
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
    width: 236px;
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
  min-width: 400px;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Th = styled.th`
  box-sizing: border-box;
  height: 60px;
  padding: 8px 12px;
  background: #ffffff;
  text-align: left;
  vertical-align: middle;
  font-family: "Plus Jakarta Sans", var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: #003f6b;
`;

const Tr = styled.tr<{ $odd: boolean }>`
  height: 50px;
  background: ${(p) => (p.$odd ? "#f6f8f7" : "#ffffff")};
  border-bottom: 1px solid #ecefed;
`;

const Td = styled.td`
  box-sizing: border-box;
  height: 49px;
  padding: 10px 12px;
  text-align: left;
  vertical-align: middle;
  font-family: "Plus Jakarta Sans", var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #1d2520;
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

const EmptyCell = styled.td`
  padding: 40px 12px;
  text-align: center;
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  color: #8b9c90;
`;
