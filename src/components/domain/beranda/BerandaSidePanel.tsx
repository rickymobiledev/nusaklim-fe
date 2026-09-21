"use client";

import styled from "styled-components";
import { DrySpellSummaryCard } from "@/components/domain/beranda/DrySpellSummaryCard";
import { WaterBalanceSummaryCard } from "@/components/domain/beranda/WaterBalanceSummaryCard";
import { SunshineDurationSummaryCard } from "@/components/domain/beranda/SunshineDurationSummaryCard";
import { VpdSummaryCard } from "@/components/domain/beranda/VpdSummaryCard";
import { InfoEmptyIcon } from "@/components/shared/DashboardIcons";

/** Sidebar kanan Beranda (Figma "Frame 35"): alert info + kartu Deret
 *  Hari Terpanjang Tidak Hujan, Keseimbangan Air, Lama Penyinaran & VPD —
 *  seluruh widget sidebar dari Figma sudah lengkap. */
export function BerandaSidePanel({ stationId }: { stationId?: string }) {
  return (
    <Panel>
      <InfoAlert>
        <InfoEmptyIcon />
        <AlertText>Data diambil dari tanggal atau bulan sebelumnya.</AlertText>
      </InfoAlert>

      <DrySpellSummaryCard stationId={stationId} />
      <WaterBalanceSummaryCard stationId={stationId} />
      <SunshineDurationSummaryCard stationId={stationId} />
      <VpdSummaryCard stationId={stationId} />
    </Panel>
  );
}

const Panel = styled.aside`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: start;
  gap: 16px;
  width: 100%;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 20px;
`;

const InfoAlert = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  gap: 16px;
  padding: 16px;
  background: #eff5ff;
  border: 1.5px solid #175fe2;
  border-radius: 12px;

  svg {
    flex: none;
  }
`;

const AlertText = styled.p`
  margin: 0;
  flex: 1;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #667a6c;
`;
