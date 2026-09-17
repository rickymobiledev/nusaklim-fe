"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import styled from "styled-components";
import { useForecast } from "@/hooks/use-forecast";
import { NavArrowRightIcon } from "@/components/shared/DashboardIcons";
import { FORECAST_ICON_SRC, getForecastIconLevel } from "@/lib/forecast-icon-level";

export function ForecastCard({ stationId }: { stationId?: string }) {
  const { data, isLoading } = useForecast(stationId);
  // Panjang ikut array `forecast` apa adanya — horizon bisa berubah begitu
  // model DL baru selesai, jangan hardcode 7 (pola sama /forecast).
  const days = data?.forecast ?? [];
  const unit = data?.units.rainfall ?? "mm";

  return (
    <Card>
      <HeaderRow>
        <Title>Ramalan Cuaca</Title>
        <Link href="/forecast">
          <SeeMore>
            Lihat Selengkapnya
            <NavArrowRightIcon size={18} />
          </SeeMore>
        </Link>
      </HeaderRow>
      <Subtitle>Ramalan curah hujan 7 Hari Ke Depan</Subtitle>

      <DayStrip>
        {isLoading ? (
          <EmptyMessage>Memuat ramalan...</EmptyMessage>
        ) : days.length === 0 ? (
          <EmptyMessage>Pilih stasiun untuk melihat ramalan cuaca.</EmptyMessage>
        ) : (
          days.map((day) => {
            const date = new Date(day.date);
            return (
              <DayColumn key={day.date}>
                <DateBlock>
                  <DateText>{format(date, "d MMM", { locale: id })}</DateText>
                  <DayName>{format(date, "EEEE", { locale: id })}</DayName>
                </DateBlock>
                <StatusBlock>
                  <Image
                    src={FORECAST_ICON_SRC[getForecastIconLevel(day.rainfall)]}
                    alt=""
                    width={40}
                    height={40}
                  />
                  <RainfallValue>
                    {day.rainfall} {unit}
                  </RainfallValue>
                </StatusBlock>
              </DayColumn>
            );
          })
        )}
      </DayStrip>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 4px;
  max-width: 530px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
`;

const Title = styled.h2`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
`;

const SeeMore = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #175fe2;
  white-space: nowrap;
`;

const Subtitle = styled.p`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #667a6c;
`;

/* `overflow-x:auto` bukan bagian spec Figma (Figma cuma render 7 kolom
 * pas di lebar kartu 530px desktop) — fallback supaya di layar sempit
 * kolom tidak terpaksa menyusut di bawah lebar wajarnya, sekaligus tidak
 * ada mockup mobile untuk kartu ini. */
const DayStrip = styled.div`
  display: flex;
  align-items: stretch;
  overflow-x: auto;
  margin-top: 12px;
`;

const EmptyMessage = styled.p`
  padding: 8px 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  color: #667a6c;
`;

const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 70px;
  gap: 8px;
  padding: 8px;

  &:not(:last-child) {
    border-right: 1px solid #ecefed;
  }
`;

const DateBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const DateText = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  color: #1d2520;
`;

const DayName = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #667a6c;
`;

const StatusBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const RainfallValue = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
  white-space: nowrap;
`;
