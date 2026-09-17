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
 *  sama lewat hook yang sama).
 *
 *  Nama "Card" cuma akurat di mobile (masih card berbingkai `#0d3787`) —
 *  di desktop (`media.desktop`) sudah bukan card lagi, badge duduk
 *  langsung di atas background hero (lihat CLAUDE.md bagian Beranda). */
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
          <IconBadge $bg="#BBD3FF" $borderColor="#175FE2">
            <StatIcon src="/brand/station-total.png" alt="" width={70} height={70} />
          </IconBadge>
          <TextBlock>
            <StatLabel>Total Stasiun</StatLabel>
            <StatValue>{isLoading ? "--" : totalStasiun}</StatValue>
          </TextBlock>
        </Stat>

        <Stat>
          <IconBadge $bg="#A9DEB4" $borderColor="#43B75D">
            <StatIcon src="/brand/station-active.png" alt="" width={70} height={70} />
          </IconBadge>
          <TextBlock>
            <StatLabel>Stasiun Aktif</StatLabel>
            <StatValue>{isLoading ? "--" : stasiunAktif}</StatValue>
          </TextBlock>
        </Stat>

        <Stat>
          <IconBadge $bg="#F7A9A7" $borderColor="#EE443F">
            <StatIcon src="/brand/station-inactive.png" alt="" width={70} height={70} />
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
  width: 100%;
  min-width: 0;
  padding: 24px 16px 20px;
  border-radius: 20px;
  overflow: hidden;
  background: #0d3787;

  ${media.desktop} {
    width: auto;
    padding: 8px 0;
    background: none;
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
    gap: 12px;
    padding: 0;
  }
`;

const IconBadge = styled.div<{ $bg: string; $borderColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(p) => p.$bg};
  flex-shrink: 0;

  ${media.desktop} {
    width: 80px;
    height: 80px;
    background: #ffffff;
    border: 2px solid ${(p) => p.$borderColor};
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled(Image)`
  width: 42px;
  height: 42px;

  ${media.desktop} {
    width: 70px;
    height: 70px;
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
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
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
    font-size: 40px;
    line-height: 48px;
    text-align: left;
  }
`;
