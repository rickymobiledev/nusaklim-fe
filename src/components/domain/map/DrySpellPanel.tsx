"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { ArrowUpDown, Minus, TriangleAlert, Info } from "lucide-react";
import { media } from "@/lib/breakpoints";
import type { StationDrySpell } from "@/types/domain";
import {
  getDrySpellLevel,
  DRY_SPELL_COLOR,
  DRY_SPELL_LABEL,
} from "@/lib/dry-spell-level";

type SortDirection = "desc" | "asc";

/** Panel kanan tab Peta > Deret Terpanjang Hari Tidak Hujan — analog
 *  `WaterDeficitPanel.tsx`, tapi isinya perbandingan durasi deret hari
 *  tidak hujan (bukan defisit air). BEDA dari Water Deficit: panel ini
 *  baca `rows` yang SAMA dengan yang dipakai peta (satu-satunya endpoint
 *  yang tersedia, `/devices/dry_spell`) — TIDAK ada split endpoint mock
 *  terpisah seperti `WaterDeficitComparisonApi`. Row icon/warna ikut
 *  level (`getDrySpellLevel`), bukan check-dot hijau seragam, sesuai
 *  mockup Figma (3 gaya dot berbeda: merah/oranye/hijau).
 *
 *  `durasiTerakhir === null` (array `dry_spell` kosong) di-treat SAMA
 *  seperti nilai rendah biasa — ditampilkan dengan label `"< 10 Hari"`
 *  (`DRY_SPELL_LABEL.rendah`), BUKAN "Tidak Ada Data" — dikonfirmasi dari
 *  dashboard Nusaklim produksi (ground truth). Untuk SORTING, `null`
 *  di-treat sebagai `0` (baris "urutan terakhir" secara alami saat sort
 *  "Tertinggi"). */
export function DrySpellPanel({ rows }: { rows: StationDrySpell[] }) {
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  // Endpoint `/devices/dry_spell` cuma terima `year` (bukan `year`+`month`
  // seperti Water Deficit) — belum ada UI pemilih tahun di tab ini, jadi
  // banner tampilkan tahun berjalan, konsisten dengan default Route
  // Handler (`getDefaultDrySpellYear`).
  const tahunIni = useMemo(() => new Date().getFullYear(), []);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const valueA = a.durasiTerakhir ?? 0;
      const valueB = b.durasiTerakhir ?? 0;
      return sortDir === "desc" ? valueB - valueA : valueA - valueB;
    });
    return copy;
  }, [rows, sortDir]);

  const highest = useMemo(() => {
    const withData = rows.filter(
      (r): r is StationDrySpell & { durasiTerakhir: number } => r.durasiTerakhir !== null,
    );
    if (withData.length === 0) return null;
    return withData.reduce((a, b) => (b.durasiTerakhir > a.durasiTerakhir ? b : a));
  }, [rows]);

  return (
    <Card>
      <InfoAlert>
        <Info size={20} strokeWidth={1.5} color="#305ecc" />
        <AlertText>Periode monitoring: Tahun {tahunIni}.</AlertText>
      </InfoAlert>

      <Section>
        <SectionHeader>
          <Heading>Perbandingan Hari Tidak Hujan</Heading>
          <SortButton
            type="button"
            onClick={() => setSortDir((prev) => (prev === "desc" ? "asc" : "desc"))}
          >
            {sortDir === "desc" ? "Tertinggi" : "Terendah"}
            <ArrowUpDown size={14} strokeWidth={1.5} />
          </SortButton>
        </SectionHeader>

        <List>
          {sorted.map((row) => {
            const level = getDrySpellLevel(row.durasiTerakhir);
            const color = DRY_SPELL_COLOR[level];

            return (
              <Row key={row.stationId}>
                <RowLeft>
                  <LevelDot $color={color}>
                    {level === "rendah" ? (
                      <Minus size={12} strokeWidth={3} color="#ffffff" />
                    ) : (
                      <TriangleAlert size={12} strokeWidth={2} color="#ffffff" />
                    )}
                  </LevelDot>
                  <RowName>{row.nama}</RowName>
                </RowLeft>
                <RowValue>
                  {row.durasiTerakhir !== null
                    ? `${row.durasiTerakhir} Hari`
                    : DRY_SPELL_LABEL.rendah}
                </RowValue>
              </Row>
            );
          })}

          {sorted.length === 0 && <EmptyText>Belum ada data stasiun.</EmptyText>}
        </List>
      </Section>

      {highest && (
        <SummaryLink>
          Deret Hari Tidak Hujan terhadap stasiun tertinggi ({highest.nama},{" "}
          {highest.durasiTerakhir} Hari)
        </SummaryLink>
      )}

      <WarningAlert>
        <TriangleAlert size={20} strokeWidth={1.5} color="#ffffff" />
        <WarningText>
          Deret terpanjang hari tidak hujan &gt; 10: Pemupukan perlu dihentikan. Deret
          terpanjang hari tidak hujan &gt; 20: Tanaman sawit anda akan mengalami cekaman
          kekeringan.
        </WarningText>
      </WarningAlert>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 20px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge legacy */

  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Edge Chromium */
  }

  ${media.desktop} {
    width: 300px;
    height: 560px;
    flex-shrink: 0;
  }
`;

const InfoAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #eff5ff;
  border: 1.5px solid #175fe2;
  border-radius: 12px;
  flex: none;
  flex-direction: row;

  svg {
    flex: none;
  }
`;

const AlertText = styled.p`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 13px;
  color: #667a6c;
  font-weight: 400;
  line-height: 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Heading = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #000000;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #175fe2;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 13px 16px;
  border: 1px solid #e5e7ea;
  border-radius: 8px;
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LevelDot = styled.span<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex: none;
  background: ${(p) => p.$color};
  border-radius: 50%;
`;

const RowName = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: #1d2520;
`;

const RowValue = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #1d2520;
`;

const EmptyText = styled.p`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  color: #8b9c90;
  text-align: center;
  padding: 16px 0;
`;

const SummaryLink = styled.p`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #175fe2;
`;

const WarningAlert = styled.div`
  display: flex;
  align-items: flex-start;
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
  font-family: var(--font-body), sans-serif;
  font-size: 13px;
  color: #ffffff;
`;
