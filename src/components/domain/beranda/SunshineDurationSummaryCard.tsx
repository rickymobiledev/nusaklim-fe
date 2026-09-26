"use client";

import Image from "next/image";
import styled from "styled-components";
import { useDashboardSunshineDuration } from "@/hooks/use-dashboard-sidebar";
import { SidePanelWarningBanner } from "@/components/domain/beranda/SidePanelWarningBanner";
import { getErrorMessage } from "@/lib/api/error-messages";
import { media } from "@/lib/breakpoints";

/** Kartu "Lama Penyinaran" di sidebar kanan Beranda.
 *  Hit `/api/v2/dashboards/solar_sunshine_duration?weather_station_id=...` */
export function SunshineDurationSummaryCard({ stationId }: { stationId?: string }) {
  const { data, isLoading, isError, error } = useDashboardSunshineDuration(stationId);

  const pending = !stationId || isLoading;

  let durationText = "Data Belum Tersedia";
  if (pending) durationText = "Memuat data...";
  else if (data?.total_solar_sunshine_duration) durationText = data.total_solar_sunshine_duration;

  const minThresholdText = pending ? "..." : (data?.min_threshold ?? "3 jam");

  let message = "";
  if (isError) message = getErrorMessage(error);
  else if (data?.insight) message = data.insight;

  return (
    <Card>
      <Header>
        <Image src="/brand/lama-penyinaran.png" alt="" width={50} height={50} />
        <Title>Lama Penyinaran</Title>
      </Header>

      <Row>
        <Label>Batas Bawah</Label>
        <Value $muted={false}>{minThresholdText}</Value>
      </Row>
      <Row>
        <Label>Lama Penyinaran</Label>
        <Value $muted={!data}>{durationText}</Value>
      </Row>

      {message ? <SidePanelWarningBanner message={message} /> : null}
    </Card>
  );
}

/* Mobile: tanpa border/radius, tanpa padding kiri-kanan — dipisah dari
 * kartu sebelumnya lewat `border-top` (pengganti box penuh), bukan
 * card berbingkai seperti kartu sidebar lain. Desktop tetap card
 * berbingkai seperti sebelumnya. */
const Card = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 8px;
  width: 100%;
  padding: 16px 0 0;
  border-top: 1px solid #d6dcd8;

  ${media.desktop} {
    padding: 16px;
    border: 1px solid #d6dcd8;
    border-radius: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #1d2520;
`;

const Row = styled.div`
  display: flex;
  align-self: stretch;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const Label = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #6d717f;
`;

const Value = styled.span<{ $muted: boolean }>`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  text-align: right;
  color: ${(p) => (p.$muted ? "#8b9c90" : "#1d2520")};
`;
