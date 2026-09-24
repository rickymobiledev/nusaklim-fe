"use client";

import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import {
  AlertTriangleIcon,
  CalendarOutlineIcon,
} from "@/components/shared/DashboardIcons";
import { getBatasAmanKpa, getAboveLimitVpdDays } from "@/lib/vpd-summary";
import type { VPDReport } from "@/types/domain";

const MAX_CARDS = 5;

/** Koma desimal id-ID, 1 desimal ("2,2") sesuai Figma. */
function formatVpdCard(value: number): string {
  return value.toLocaleString("id-ID", { maximumFractionDigits: 1 });
}

function formatBatas(value: number): string {
  return Number(value.toFixed(2)).toLocaleString("id-ID");
}

/** Panel merah "Jumlah hari VPD di atas batas N kPa" + kartu hari-harinya
 *  (maks 5 TERBARU, urut tanggal naik). Disembunyikan kalau tidak ada hari
 *  di atas batas. Baris kosong/lonjakan sensor diabaikan (`isMeaningfulVpdRow`). */
export function VpdSummary({ data }: { data: VPDReport[] }) {
  const above = getAboveLimitVpdDays(data);
  if (above.length === 0) return null;

  const batasAman = getBatasAmanKpa(data);
  const cards = above.slice(-MAX_CARDS);

  return (
    <Panel>
      <AlertRow>
        <AlertTriangleIcon size={24} color="#EE443F" />
        <AlertText>Jumlah hari VPD di atas batas {formatBatas(batasAman)} kPa</AlertText>
        <AlertCount>{above.length} Hari</AlertCount>
      </AlertRow>

      <Cards>
        {cards.map((row) => (
          <DayCard key={row.tanggal}>
            <DayValue>{formatVpdCard(row.vpd)} kPa</DayValue>
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
