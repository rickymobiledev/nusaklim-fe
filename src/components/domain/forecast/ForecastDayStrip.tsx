"use client";

import Image from "next/image";
import styled from "styled-components";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FORECAST_ICON_SRC, getForecastIconLevel } from "@/lib/forecast-icon-level";
import { getForecastCategory } from "@/lib/forecast-display";
import { media } from "@/lib/breakpoints";
import type { ForecastDay } from "@/types/forecast";

export function ForecastDayStrip({
  days,
  activeDate,
  rainfallUnit,
  onSelect,
}: {
  days: ForecastDay[];
  activeDate?: string;
  rainfallUnit: string;
  onSelect: (date: string) => void;
}) {
  return (
    <Strip>
      {days.map((day) => {
        const date = new Date(day.date);
        const active = day.date === activeDate;

        return (
          <DayCard
            key={day.date}
            type="button"
            $active={active}
            aria-pressed={active}
            onClick={() => onSelect(day.date)}
          >
            <DateBlock>
              <DateText $active={active}>
                {format(date, "d MMM", { locale: id })}
              </DateText>
              <DayName $active={active}>{format(date, "EEEE", { locale: id })}</DayName>
            </DateBlock>
            <StatusBlock>
              <Image
                src={FORECAST_ICON_SRC[getForecastIconLevel(day.rainfall)]}
                alt=""
                width={60}
                height={60}
              />
              <ValueBlock>
                <RainfallValue $active={active}>
                  {day.rainfall} <small>{rainfallUnit}</small>
                </RainfallValue>
                <Category $active={active}>{getForecastCategory(day.rainfall)}</Category>
              </ValueBlock>
            </StatusBlock>
          </DayCard>
        );
      })}
    </Strip>
  );
}

const Strip = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  /* Scrollbar disembunyikan, strip tetap bisa digeser (swipe/scroll). */
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DayCard = styled.button<{ $active: boolean }>`
  display: flex;
  flex: 1 0 128px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 190px;
  padding: 12px 8px;
  gap: 8px;
  background: ${(p) => (p.$active ? "#175fe2" : "rgba(255, 255, 255, 0.8)")};
  border: 1px solid ${(p) => (p.$active ? "#0d3787" : "#d6dcd8")};
  border-radius: 8px;
  cursor: pointer;
  text-align: center;

  &:hover {
    border-color: #175fe2;
  }

  ${media.desktop} {
    flex-basis: 0;
    min-width: 96px;
  }
`;

const DateBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DateText = styled.span<{ $active: boolean }>`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: ${(p) => (p.$active ? "#ffffff" : "#1d2520")};
`;

const DayName = styled.span<{ $active: boolean }>`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${(p) => (p.$active ? "#ffffff" : "#667a6c")};
`;

const StatusBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const ValueBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RainfallValue = styled.span<{ $active: boolean }>`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  color: ${(p) => (p.$active ? "#ffffff" : "#1d2520")};
  white-space: nowrap;

  small {
    font-size: 14px;
    font-weight: 400;
  }
`;

const Category = styled.span<{ $active: boolean }>`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${(p) => (p.$active ? "#ffffff" : "#667a6c")};
  white-space: nowrap;
`;
