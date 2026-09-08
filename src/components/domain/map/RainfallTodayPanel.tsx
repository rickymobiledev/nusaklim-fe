"use client";

import { useMemo } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Info } from "lucide-react";
import { media } from "@/lib/breakpoints";
import type { StationRainfallToday } from "@/types/domain";
import {
  getRainfallTodayLevel,
  RAINFALL_TODAY_COLOR,
  RAINFALL_TODAY_LABEL,
} from "@/lib/rainfall-today-level";

/** Warna chip SAMA PERSIS `CHIP_STYLE` di `MapStationList.tsx` (biru
 *  untuk status "baik", merah untuk "tidak") — reuse nilai dari
 *  `RAINFALL_TODAY_COLOR` daripada duplikat hex baru. */
const CHIP_BG: Record<"hujan" | "tidak_hujan", string> = {
  hujan: "#E6F4FF",
  tidak_hujan: "#FDECEC",
};

/** Panel kanan tab Peta > Curah Hujan Hari Ini — analog
 *  `DrySpellPanel.tsx`, TAPI lebih sederhana: tidak ada search/sort/
 *  warning-banner (tidak ada di Figma tab ini, metrik boolean tidak
 *  punya "urutan tertinggi/terendah" yang bermakna seperti nilai
 *  kontinu Water Deficit/Dry Spell). Baca `rows` yang SAMA dengan yang
 *  dipakai peta (satu-satunya endpoint yang tersedia,
 *  `/devices/rainfall_today`) — TIDAK ada split endpoint mock terpisah. */
export function RainfallTodayPanel({ rows }: { rows: StationRainfallToday[] }) {
  const tanggalIni = useMemo(
    () => format(new Date(), "dd MMMM yyyy", { locale: idLocale }),
    [],
  );

  return (
    <Card>
      <InfoAlert>
        <Info size={20} strokeWidth={1.5} color="#305ecc" />
        <AlertText>Data curah hujan untuk hari ini, {tanggalIni}.</AlertText>
      </InfoAlert>

      <Section>
        <List>
          {rows.map((row) => {
            const level = getRainfallTodayLevel(row.isHujan);
            const color = RAINFALL_TODAY_COLOR[level];

            return (
              <Row key={row.stationId}>
                <RowName>{row.nama}</RowName>
                <Chip $bg={CHIP_BG[level]} $border={color} $text={color}>
                  {RAINFALL_TODAY_LABEL[level]}
                </Chip>
              </Row>
            );
          })}

          {rows.length === 0 && <EmptyText>Belum ada data stasiun.</EmptyText>}
        </List>
      </Section>
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
  padding: 12px 16px;
  border: 1px solid #e5e7ea;
  border-radius: 8px;
`;

const RowName = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: #1d2520;
`;

const Chip = styled.span<{ $bg: string; $border: string; $text: string }>`
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 14px;
  border-radius: 100px;
  background: ${(p) => p.$bg};
  border: 1.5px solid ${(p) => p.$border};
  color: ${(p) => p.$text};
  font-family: var(--font-body), sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 12px;
  white-space: nowrap;
`;

const EmptyText = styled.p`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  color: #8b9c90;
  text-align: center;
  padding: 16px 0;
`;
