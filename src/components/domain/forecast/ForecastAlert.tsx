"use client";

import styled from "styled-components";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { WarningTriangleIcon } from "@/components/shared/DashboardIcons";
import { HEAVY_RAIN_ALERT_MM } from "@/lib/forecast-display";
import type { ForecastDay } from "@/types/forecast";

/** Alert kuning "Potensi Hujan Lebat" — tampil hanya bila ada hari dengan
 *  curah hujan di atas `HEAVY_RAIN_ALERT_MM`; yang disebut tanggal
 *  PERTAMA yang melewati ambang. */
export function ForecastAlert({ day }: { day?: ForecastDay }) {
  if (!day) return null;

  return (
    <Alert role="alert">
      <WarningTriangleIcon size={20} color="#6B4700" />
      <Content>
        <Title>Potensi Hujan Lebat</Title>
        <Message>
          Curah hujan diprediksi mencapai &gt; {HEAVY_RAIN_ALERT_MM}mm/hari pada tanggal{" "}
          {format(new Date(day.date), "d MMMM yyyy", { locale: id })}. Waspadai potensi
          genangan dan banjir
        </Message>
      </Content>
    </Alert>
  );
}

const Alert = styled.div`
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 16px;
  gap: 16px;
  background: #ffaa00;
  border-radius: 12px;

  svg {
    flex: none;
  }
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  color: #6b4700;
`;

const Message = styled.p`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #6b4700;
`;
