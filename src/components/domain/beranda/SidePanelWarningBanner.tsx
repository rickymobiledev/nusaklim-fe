"use client";

import styled from "styled-components";
import { WarningCircleIcon } from "@/components/shared/DashboardIcons";

/** Banner peringatan oranye (Figma "Frame 191") yang dipakai SEMUA kartu
 *  sidebar kanan Beranda — Deret Hari Terpanjang Tidak Hujan, Keseimbangan
 *  Air, Lama Penyinaran, VPD. Spec-nya identik di keempat kartu, makanya
 *  dijadikan satu komponen. `z-index` di atas lapisan latar dekoratif
 *  kartu (glow/hujan) yang berada di `z-index: 0`. */
export function SidePanelWarningBanner({ message }: { message: string }) {
  return (
    <Banner>
      <BannerIcon>
        <WarningCircleIcon />
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
  background: #ffe5b0;
  border: 1px solid #e89b00;
  border-radius: 8px;
`;

const BannerIcon = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #ffaa00;
  border-radius: 50px;
`;

const BannerText = styled.p`
  margin: 0;
  flex: 1;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #27313f;
`;
