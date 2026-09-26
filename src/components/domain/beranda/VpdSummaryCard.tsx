"use client";

import Image from "next/image";
import styled from "styled-components";
import { useDashboardVpd } from "@/hooks/use-dashboard-sidebar";
import { SidePanelWarningBanner } from "@/components/domain/beranda/SidePanelWarningBanner";
import { InfoEmptyIcon } from "@/components/shared/DashboardIcons";
import { getErrorMessage } from "@/lib/api/error-messages";
import { media } from "@/lib/breakpoints";

/** Kartu "VPD" di sidebar kanan Beranda.
 *  Hit `/api/v2/dashboards/vpd?weather_station_id=...` */
export function VpdSummaryCard({ stationId }: { stationId?: string }) {
  const { data, isLoading, isError, error } = useDashboardVpd(stationId);
  const pending = !stationId || isLoading;

  const maxThresholdText = pending ? "..." : (data?.max_threshold ?? "2.1 kPa");
  const vpdText = pending ? "..." : (data?.vpd ?? "—");

  let message = "";
  if (isError) message = getErrorMessage(error);
  else if (data?.insight) message = data.insight;

  return (
    <Card>
      <Header>
        <Image src="/brand/vpd.png" alt="" width={50} height={50} />
        <Title>VPD</Title>
        <InfoEmptyIcon size={16} color="#8B9C90" />
      </Header>

      <Row>
        <Label>Batas Aman</Label>
        <Value $muted={false}>{maxThresholdText}</Value>
      </Row>
      <Row>
        <Label>VPD</Label>
        <Value $muted={!data}>{vpdText}</Value>
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

/* Nunito Sans — Figma memakai font ini khusus judul kartu VPD (kartu
 * sidebar lain Plus Jakarta Sans), diikuti apa adanya. */
const Title = styled.span`
  font-family: var(--font-nunito-sans), sans-serif;
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
