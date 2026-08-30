"use client";

import styled from "styled-components";
import { useStations } from "@/hooks/use-stations";
import {
  StationActiveIcon,
  StationIcon,
  StationInactiveIcon,
} from "@/components/shared/DashboardIcons";

/** Sengaja baca dari `useStations()` (query yang sama dengan
 *  `StationSyncCard`, bukan query/endpoint ringkasan terpisah) — supaya
 *  cuma 1 request yang benar-benar terjadi ke backend real (React Query
 *  otomatis berbagi query dengan queryKey identik yang mount bersamaan;
 *  ini bukan cache tambahan, cuma 2 komponen yang memang minta data yang
 *  sama lewat hook yang sama). */
export function StationStatsCard() {
  const { data: stationsResponse, isLoading } = useStations();
  const stations = stationsResponse?.data;
  const totalStasiun = stations?.length ?? 0;
  const stasiunAktif = stations?.filter((s) => s.status === "on").length ?? 0;
  const stasiunTidakAktif = stations?.filter((s) => s.status === "off").length ?? 0;

  return (
    <Card>
      <Glow aria-hidden />
      <Content>
        <Stat>
          <IconBadge $bg="#C3DFFA">
            <StationIcon size={24} color="#175FE2" />
          </IconBadge>
          <TextBlock>
            <StatLabel>Total Stasiun</StatLabel>
            <StatValue>{isLoading ? "--" : totalStasiun}</StatValue>
          </TextBlock>
        </Stat>

        <Stat>
          <IconBadge $bg="#ECF8EF">
            <StationActiveIcon size={24} color="#43B75D" />
          </IconBadge>
          <TextBlock>
            <StatLabel>Stasiun Aktif</StatLabel>
            <StatValue>{isLoading ? "--" : stasiunAktif}</StatValue>
          </TextBlock>
        </Stat>

        <Stat>
          <IconBadge $bg="#FDECEC">
            <StationInactiveIcon size={24} color="#EE443F" />
          </IconBadge>
          <TextBlock>
            <StatLabel>Tidak Aktif</StatLabel>
            <StatValue>{isLoading ? "--" : stasiunTidakAktif}</StatValue>
          </TextBlock>
        </Stat>
      </Content>
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 380px;
  min-width: 0;
  max-width: 468px;
  padding: 8px 24px;
  border-radius: 20px;
  overflow: hidden;
  background: #658ed5;
`;

const Glow = styled.div`
  position: absolute;
  width: 320px;
  height: 320px;
  left: -100px;
  top: -140px;
  background: linear-gradient(276.6deg, #175fe2 15.24%, #1045a8 72.24%);
  filter: blur(60px);
  z-index: 0;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 24px;
  width: 100%;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconBadge = styled.div<{ $bg: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(p) => p.$bg};
  flex-shrink: 0;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatLabel = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #ffffff;
  white-space: nowrap;
`;

const StatValue = styled.span`
  font-family: var(--font-manrope), sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 34px;
  color: #ffffff;
`;
