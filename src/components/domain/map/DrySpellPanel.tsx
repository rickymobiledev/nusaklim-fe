"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  AlertTriangleIcon,
  CheckIcon,
  DataTransferBothIcon,
  InfoEmptyIcon,
  SearchIcon,
  WarningTriangleLargeIcon,
} from "@/components/shared/DashboardIcons";
import { DownloadDataPagination } from "@/components/domain/download-data/DownloadDataTable";
import {
  getDrySpellLevel,
  DRY_SPELL_COLOR,
  DRY_SPELL_LABEL,
} from "@/lib/dry-spell-level";
import { media } from "@/lib/breakpoints";
import type { StationDrySpell } from "@/types/domain";

type SortDirection = "desc" | "asc";

/** Kartu "Perbandingan Hari Tidak Hujan" tab Peta > Deret Terpanjang Hari
 *  Tidak Hujan — layout Figma baru: di BAWAH peta full-width (bukan panel
 *  kanan 300px lagi), pola sama `WaterDeficitPanel.tsx`/`StationInfoCard.tsx`.
 *  Baca `rows` yang SAMA dengan peta (satu-satunya endpoint,
 *  `/devices/dry_spell`) — tidak ada split mock seperti Water Deficit.
 *
 *  `durasiTerakhir === null` (array `dry_spell` kosong) di-treat SAMA
 *  seperti nilai rendah — label `"< 10 Hari"`, BUKAN "Tidak Ada Data"
 *  (dikonfirmasi dari dashboard produksi). Untuk SORTING, `null` = 0. */
export function DrySpellPanel({ rows }: { rows: StationDrySpell[] }) {
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Endpoint cuma terima `year` (default tahun berjalan, lihat
  // `getDefaultDrySpellYear`) — periode = 1 Januari s/d hari ini.
  const periode = useMemo(() => {
    const now = new Date();
    return {
      tahun: now.getFullYear(),
      hariIni: format(now, "d MMMM yyyy", { locale: idLocale }),
    };
  }, []);

  const lastSync = useMemo(() => {
    const times = rows
      .map((r) => (r.sinkronisasiTerakhir ? new Date(r.sinkronisasiTerakhir) : null))
      .filter((d): d is Date => d !== null && !Number.isNaN(d.getTime()));
    if (times.length === 0) return "-";
    const latest = new Date(Math.max(...times.map((d) => d.getTime())));
    return format(latest, "dd-MM-yyyy HH:mm");
  }, [rows]);

  const sorted = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    const matched = rows.filter((r) => r.nama.toLowerCase().includes(keyword));
    matched.sort((a, b) => {
      const valueA = a.durasiTerakhir ?? 0;
      const valueB = b.durasiTerakhir ?? 0;
      return sortDir === "desc" ? valueB - valueA : valueA - valueB;
    });
    return matched;
  }, [rows, searchTerm, sortDir]);

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  // Derived, BUKAN useEffect+setPage (ditolak lint react-hooks/set-state-in-effect).
  const effectivePage = Math.min(page, pageCount);
  const start = (effectivePage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  return (
    <>
      <InfoAlert>
        <InfoEmptyIcon size={20} />
        <AlertText>
          Periode monitoring dari 1 Januari {periode.tahun} sampai dengan{" "}
          {periode.hariIni}
        </AlertText>
      </InfoAlert>

      <Card>
        <Title>Perbandingan Hari Tidak Hujan</Title>

        <Toolbar>
          <ToolbarLeft>
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

            <SortButton
              type="button"
              onClick={() => {
                setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
                setPage(1);
              }}
            >
              {sortDir === "desc" ? "Tertinggi" : "Terendah"}
              <DataTransferBothIcon size={24} />
            </SortButton>
          </ToolbarLeft>

          <SyncBadge>Sinkronisasi Terakhir: {lastSync}</SyncBadge>
        </Toolbar>

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
                  <Th>Durasi</Th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, index) => {
                  const level = getDrySpellLevel(row.durasiTerakhir);
                  return (
                    <Tr key={row.stationId} $odd={index % 2 === 0}>
                      <Td>{row.nama}</Td>
                      <Td>{row.stationId}</Td>
                      <Td>
                        <DurationCell>
                          <StatusDot $bg={DRY_SPELL_COLOR[level]}>
                            {level === "tinggi" ? (
                              <AlertTriangleIcon size={14} />
                            ) : (
                              <CheckIcon />
                            )}
                          </StatusDot>
                          {row.durasiTerakhir !== null
                            ? `${row.durasiTerakhir} Hari`
                            : DRY_SPELL_LABEL.rendah}
                        </DurationCell>
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

        <WarningAlert>
          <WarningTriangleLargeIcon size={20} />
          <WarningText>
            Deret hari terpanjang tidak hujan &gt; 10 : Pemupukan perlu dihentikan. Deret
            hari terpanjang tidak hujan &gt; 20 : Tanaman sawit anda akan mengalami
            cekaman kekeringan.
          </WarningText>
        </WarningAlert>
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

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;

  ${media.desktop} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const ToolbarLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const SearchWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;

  ${media.desktop} {
    flex: none;
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

const SortButton = styled.button`
  display: flex;
  flex: none;
  align-items: center;
  gap: 4px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-family: "Plus Jakarta Sans", var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: #175fe2;
`;

const SyncBadge = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 8px 16px;
  background: #eff5ff;
  border: 1px solid #4f8cf5;
  border-radius: 12px;
  font-family: "Plus Jakarta Sans", var(--font-body), sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #1d2520;
  text-align: center;

  ${media.desktop} {
    font-size: 16px;
    line-height: 24px;
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

const DurationCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.span<{ $bg: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 24px;
  height: 24px;
  background: ${(p) => p.$bg};
  border-radius: 50px;
`;

const EmptyCell = styled.td`
  padding: 40px 12px;
  text-align: center;
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  color: #8b9c90;
`;

const WarningAlert = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #ffaa00;
  border-radius: 12px;

  svg {
    flex: none;
  }
`;

const WarningText = styled.p`
  margin: 0;
  font-family: "Plus Jakarta Sans", var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #6b4700;
`;
