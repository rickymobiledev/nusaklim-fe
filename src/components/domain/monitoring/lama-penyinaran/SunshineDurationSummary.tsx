"use client";

import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import {
  AlertTriangleIcon,
  CalendarOutlineIcon,
} from "@/components/shared/DashboardIcons";
import { getBatasBawahJam, getBelowLimitDays } from "@/lib/sunshine-duration-summary";
import type { SunshineDuration } from "@/types/domain";

const MAX_CARDS = 4;

/** Panel merah "Jumlah hari lama penyinaran di bawah batas N jam" + kartu
 *  hari-harinya (maks 4 TERBARU, ditampilkan urut tanggal naik). Data
 *  contoh Figma berisi nilai di ATAS batas — jelas placeholder, jadi kartu
 *  sengaja hanya hari di BAWAH batas (keputusan user). Disembunyikan kalau
 *  tidak ada hari di bawah batas. */
export function SunshineDurationSummary({ data }: { data: SunshineDuration[] }) {
  const below = getBelowLimitDays(data);
  if (below.length === 0) return null;

  const batasBawah = getBatasBawahJam(data);
  const cards = below.slice(-MAX_CARDS);

  return (
    <Panel>
      <AlertRow>
        <AlertTriangleIcon size={24} color="#EE443F" />
        <AlertText>Jumlah hari lama penyinaran di bawah batas {batasBawah} jam</AlertText>
        <AlertCount>{below.length} Hari</AlertCount>
      </AlertRow>

      <Cards>
        {cards.map((row) => (
          <DayCard key={row.tanggal}>
            <DayValue>{Number(row.lamaPenyinaranJam.toFixed(2))} Jam</DayValue>
            <DayDate>
              <CalendarOutlineIcon size={18} color="#8B9C90" />
              {format(parseISO(row.tanggal), "dd MMMM yyyy", { locale: id })}
            </DayDate>
          </DayCard>
        ))}
      </Cards>
    </Panel>
  );
}

const Panel = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 20px;
`;

const AlertRow = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  padding: 8px 16px;
  border: 1px solid #ee443f;
  border-radius: 8px;
`;

const AlertText = styled.p`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 18px;
  line-height: 28px;
  font-weight: 700;
  color: #667a6c;
`;

const AlertCount = styled.span`
  font-family: var(--font-heading), sans-serif;
  font-size: 28px;
  line-height: 34px;
  font-weight: 700;
  color: #ee443f;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(213px, 1fr));
  gap: 16px;
`;

const DayCard = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 96px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #d6dcd8;
  border-radius: 8px;
`;

const DayValue = styled.span`
  font-family: var(--font-heading), sans-serif;
  font-size: 24px;
  line-height: 28px;
  font-weight: 700;
  color: #1d2520;
`;

const DayDate = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 16px;
  font-weight: 600;
  color: #667a6c;
  white-space: nowrap;
`;
