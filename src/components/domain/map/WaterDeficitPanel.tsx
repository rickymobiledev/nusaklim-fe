"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { format, subMonths } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ArrowUpDown, Check, Info, TriangleAlert } from "lucide-react";
import { media } from "@/lib/breakpoints";
import type { StationWaterDeficit } from "@/types/domain";

type SortDirection = "desc" | "asc";

/** Panel kanan tab Peta > Keseimbangan Air — analog `MapStationList.tsx`
 *  (Status Stasiun), tapi isinya perbandingan defisit air (bukan daftar
 *  stasiun + search). Layout & urutan section mengikuti Figma: alert info
 *  periode, heading + toggle sort, list perbandingan, link ringkasan
 *  stasiun tertinggi, alert warning ambang kekeringan. */
export function WaterDeficitPanel({ rows }: { rows: StationWaterDeficit[] }) {
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  // Bulan LALU (bulan penuh terakhir), bukan bulan berjalan — konsisten
  // dengan periode default yang dipakai peta real (lihat
  // getDefaultWaterDeficitPeriod di lib/api/water-deficit-api.ts), meski
  // data panel ini sendiri masih mock.
  const bulanIni = useMemo(
    () => format(subMonths(new Date(), 1), "MMMM", { locale: idLocale }),
    [],
  );

  const sorted = useMemo(() => {
    const withData = rows.filter(
      (r): r is StationWaterDeficit & { defisitAir: number } => r.defisitAir !== null,
    );
    const withoutData = rows.filter((r) => r.defisitAir === null);
    withData.sort((a, b) =>
      sortDir === "desc" ? b.defisitAir - a.defisitAir : a.defisitAir - b.defisitAir,
    );
    return [...withData, ...withoutData];
  }, [rows, sortDir]);

  const highest = useMemo(() => {
    const withData = rows.filter(
      (r): r is StationWaterDeficit & { defisitAir: number } => r.defisitAir !== null,
    );
    if (withData.length === 0) return null;
    return withData.reduce((a, b) => (b.defisitAir > a.defisitAir ? b : a));
  }, [rows]);

  return (
    <Card>
      <InfoAlert>
        <Info size={20} strokeWidth={1.5} color="#305ecc" />
        <AlertText>Periode monitoring diambil dari bulan {bulanIni}.</AlertText>
      </InfoAlert>

      <Section>
        <SectionHeader>
          <Heading>Perbandingan Defisit Air</Heading>
          <SortButton
            type="button"
            onClick={() => setSortDir((prev) => (prev === "desc" ? "asc" : "desc"))}
          >
            {sortDir === "desc" ? "Tertinggi" : "Terendah"}
            <ArrowUpDown size={14} strokeWidth={1.5} />
          </SortButton>
        </SectionHeader>

        <List>
          {sorted.map((row) => (
            <Row key={row.stationId}>
              {row.defisitAir !== null ? (
                <>
                  <RowLeft>
                    <CheckDot>
                      <Check size={10} strokeWidth={3} color="#ffffff" />
                    </CheckDot>
                    <RowName>{row.nama}</RowName>
                  </RowLeft>
                  <RowValue>{row.defisitAir}</RowValue>
                </>
              ) : (
                <>
                  <RowName $muted>{row.nama}</RowName>
                  <RowValue $muted>Tidak Ada Data</RowValue>
                </>
              )}
            </Row>
          ))}

          {sorted.length === 0 && <EmptyText>Belum ada data stasiun.</EmptyText>}
        </List>
      </Section>

      {highest && (
        <SummaryLink>
          Curah Hujan terhadap stasiun tertinggi hari ini ({highest.nama},{" "}
          {highest.defisitAir})
        </SummaryLink>
      )}

      <WarningAlert>
        <TriangleAlert size={20} strokeWidth={1.5} color="#ffffff" />
        <WarningText>
          Defisit Air &gt; 200 mm/tahun akan menyebabkan cekaman kekeringan bagi tanaman
          kelapa sawit
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

const CheckDot = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex: none;
  background: #43b75d;
  border-radius: 50%;
`;

const RowName = styled.span<{ $muted?: boolean }>`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  line-height: 16px;
  font-weight: ${(p) => (p.$muted ? 500 : 500)};
  color: ${(p) => (p.$muted ? "#667a6c" : "#1d2520")};
`;

const RowValue = styled.span<{ $muted?: boolean }>`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => (p.$muted ? "#667a6c" : "#1d2520")};
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
