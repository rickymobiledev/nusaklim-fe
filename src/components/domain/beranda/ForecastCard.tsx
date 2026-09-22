"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import styled from "styled-components";
import { useForecast } from "@/hooks/use-forecast";
import { NavArrowRightIcon } from "@/components/shared/DashboardIcons";
import { FORECAST_ICON_SRC, getForecastIconLevel } from "@/lib/forecast-icon-level";
import { media } from "@/lib/breakpoints";

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
  min-width: 0;
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

/* `overflow-x:auto` sengaja dipertahankan sbg fallback safety-net kalau
 * suatu saat kolom tetap tidak muat (mis. horizon forecast berubah jadi
 * >7 hari) — TAPI di mobile, CSS Figma persis menunjukkan 7 kolom TETAP
 * muat TANPA scroll (kolom menyusut ke ~52px, bukan dipertahankan
 * min-width 70px seperti desktop) — lihat `DayColumn` di bawah. Tanpa
 * `min-width:0` di sini, konten yang mau di-scroll internal ini malah
 * memaksa `<main>` di layout dashboard ikut scroll horizontal (parent
 * flex/grid tidak otomatis menyusut ke bawah lebar konten intrinsiknya). */
const DayStrip = styled.div`
  display: flex;
  align-items: stretch;
  min-width: 0;
  overflow-x: auto;
  margin-top: 12px;
`;

const EmptyMessage = styled.p`
  padding: 8px 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  color: #667a6c;
`;

/* min-width 0 di mobile (7 kolom menyusut ke ~52px & tetap muat tanpa
 * scroll, dikonfirmasi CSS Figma mobile persis) — 70px cuma dipakai
 * mulai desktop, BEDA dari revisi sebelumnya yang 70px di semua
 * breakpoint (itu yang memaksa DayStrip melebar & bikin <main> ikut
 * scroll horizontal di mobile). */
const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  gap: 8px;
  padding: 8px;

  &:not(:last-child) {
    border-right: 1px solid #ecefed;
  }

  ${media.desktop} {
    min-width: 70px;
  }
`;

const DateBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

/* Lebih kecil di mobile (12px, cocok CSS Figma) — kolom cuma ~52px di
 * mobile, 13px desktop tetap seperti sebelumnya. */
const DateText = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #1d2520;

  ${media.desktop} {
    font-size: 13px;
    font-weight: 700;
    line-height: 20px;
  }
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

/* Lebih kecil di mobile (12px, cocok CSS Figma) — dengan kolom ~52px,
 * `white-space:nowrap` di ukuran 16px desktop bisa memaksa lebar
 * minimum kolom lebih besar dari yang tersedia. */
const RainfallValue = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #1d2520;
  white-space: nowrap;

  ${media.desktop} {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
  }
`;
