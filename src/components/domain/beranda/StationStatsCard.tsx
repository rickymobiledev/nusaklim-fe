"use client";

import Image from "next/image";
import styled from "styled-components";
import { useStations } from "@/hooks/use-stations";
import { media } from "@/lib/breakpoints";

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
      <Content>
        <Stat>
          <IconBadge $bg="#BBD3FF" $desktopBg="#C3DFFA">
            <StatIcon src="/brand/station-total.png" alt="" width={42} height={42} />
          </IconBadge>
          <TextBlock>
            <StatLabel>Total Stasiun</StatLabel>
            <StatValue>{isLoading ? "--" : totalStasiun}</StatValue>
          </TextBlock>
        </Stat>

        <Stat>
          <IconBadge $bg="#A9DEB4" $desktopBg="#ECF8EF">
            <StatIcon src="/brand/station-active.png" alt="" width={42} height={42} />
          </IconBadge>
          <TextBlock>
            <StatLabel>Stasiun Aktif</StatLabel>
            <StatValue>{isLoading ? "--" : stasiunAktif}</StatValue>
          </TextBlock>
        </Stat>

        <Stat>
          <IconBadge $bg="#F7A9A7" $desktopBg="#FDECEC">
            <StatIcon src="/brand/station-inactive.png" alt="" width={42} height={42} />
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
  padding: 24px 16px 20px;
  border-radius: 20px;
  overflow: hidden;
  background: #0d3787;
  order: 0;

  ${media.desktop} {
    padding: 8px 24px;
    order: 1;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px 24px;
  width: 100%;

  ${media.desktop} {
    justify-content: flex-start;
  }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16.83px;

  ${media.desktop} {
    flex-direction: row;
    justify-content: flex-start;
    padding: 0;
  }
`;

const IconBadge = styled.div<{ $bg: string; $desktopBg: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(p) => p.$bg};
  flex-shrink: 0;

  ${media.desktop} {
    background: ${(p) => p.$desktopBg};
  }
`;

const StatIcon = styled(Image)`
  width: 42px;
  height: 42px;

  ${media.desktop} {
    width: 36px;
    height: 36px;
  }
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  ${media.desktop} {
    align-items: flex-start;
  }
`;

const StatLabel = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;

  ${media.desktop} {
    text-align: left;
  }
`;

const StatValue = styled.span`
  font-family: var(--font-manrope), sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 34px;
  color: #ffffff;
  text-align: center;

  ${media.desktop} {
    text-align: left;
  }
`;
