"use client";

import styled from "styled-components";
import { WarningTriangleIcon } from "@/components/shared/DashboardIcons";

/** Banner peringatan merah yang dipakai SEMUA kartu sidebar kanan Beranda —
 *  Deret Hari Terpanjang Tidak Hujan, Keseimbangan Air, Lama Penyinaran,
 *  VPD. Warna/ikon disamakan dengan banner `warning` di kartu metrik kiri
 *  (`TONE_COLORS.warning` di `WeatherSummaryCard.tsx`). Spec-nya identik di
 *  keempat kartu, makanya dijadikan satu komponen. `z-index` di atas lapisan
 *  latar dekoratif kartu (glow/hujan) yang berada di `z-index: 0`. */
export function SidePanelWarningBanner({ message }: { message: string }) {
  return (
    <Banner>
      <BannerIcon>
        <WarningTriangleIcon />
      </BannerIcon>
      <BannerText>{message}</BannerText>
    </Banner>
  );
}

const Banner = styled.div`
  position: relative;
  z-index: 3;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  gap: 8px;
  padding: 4px 8px;
  background: #fac5c3;
  border-radius: 8px;
`;

const BannerIcon = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #ee443f;
  border-radius: 50px;
`;

const BannerText = styled.p`
  margin: 0;
  flex: 1;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #1d2520;
`;
