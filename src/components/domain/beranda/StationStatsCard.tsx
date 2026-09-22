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
 *  Badge lingkaran putih+border berwarna dipakai di SEMUA breakpoint
 *  (bukan cuma desktop lagi) — dikoreksi setelah user kasih CSS Figma
 *  mobile persis: mobile TIDAK pakai card gelap `#0d3787`/badge pastel
 *  tanpa border seperti revisi sebelumnya, badge duduk LANGSUNG di atas
 *  background hero sama seperti desktop, cuma ukurannya lebih kecil
 *  (60px badge/50px icon mobile vs 80px/70px desktop) — typography label
 *  & angka JUGA sama persis desktop (16px/40px), tidak diperkecil lagi
 *  di mobile. */
export function StationStatsCard() {
  const { data: stationsResponse, isLoading } = useStations();
  const stations = stationsResponse?.data;
  const totalStasiun = stations?.length ?? 0;
  const stasiunAktif = stations?.filter((s) => s.status === "on").length ?? 0;
  const stasiunTidakAktif = stations?.filter((s) => s.status === "off").length ?? 0;

  return (
    <Content>
      <Stat>
        <IconBadge $borderColor="#175FE2">
          <StatIcon src="/brand/station-total.png" alt="" width={70} height={70} />
        </IconBadge>
        <TextBlock>
          <StatLabel>Total Stasiun</StatLabel>
          <StatValue>{isLoading ? "--" : totalStasiun}</StatValue>
        </TextBlock>
      </Stat>

      <Stat>
        <IconBadge $borderColor="#43B75D">
          <StatIcon src="/brand/station-active.png" alt="" width={70} height={70} />
        </IconBadge>
        <TextBlock>
          <StatLabel>Stasiun Aktif</StatLabel>
          <StatValue>{isLoading ? "--" : stasiunAktif}</StatValue>
        </TextBlock>
      </Stat>

      <Stat>
        <IconBadge $borderColor="#EE443F">
          <StatIcon src="/brand/station-inactive.png" alt="" width={70} height={70} />
        </IconBadge>
        <TextBlock>
          <StatLabel>Tidak Aktif</StatLabel>
          <StatValue>{isLoading ? "--" : stasiunTidakAktif}</StatValue>
        </TextBlock>
      </Stat>
    </Content>
  );
}

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px 24px;
  width: 100%;

  ${media.desktop} {
    width: auto;
    justify-content: flex-start;
  }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${media.desktop} {
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
  }
`;

const IconBadge = styled.div<{ $borderColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid ${(p) => p.$borderColor};
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

  ${media.desktop} {
    width: 80px;
    height: 80px;
  }
`;

const StatIcon = styled(Image)`
  width: 50px;
  height: 50px;

  ${media.desktop} {
    width: 70px;
    height: 70px;
  }
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  ${media.desktop} {
    align-items: flex-start;
  }
`;

const StatLabel = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;

  ${media.desktop} {
    text-align: left;
  }
`;

const StatValue = styled.span`
  font-family: var(--font-manrope), sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 48px;
  color: #ffffff;
  text-align: center;

  ${media.desktop} {
    text-align: left;
  }
`;
