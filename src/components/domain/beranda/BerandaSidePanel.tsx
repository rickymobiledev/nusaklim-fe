"use client";

import Link from "next/link";
import styled from "styled-components";
import { DrySpellSummaryCard } from "@/components/domain/beranda/DrySpellSummaryCard";
import { WaterBalanceSummaryCard } from "@/components/domain/beranda/WaterBalanceSummaryCard";
import { SunshineDurationSummaryCard } from "@/components/domain/beranda/SunshineDurationSummaryCard";
import { VpdSummaryCard } from "@/components/domain/beranda/VpdSummaryCard";

/** Sidebar kanan Beranda (Figma "Frame 35"): alert info + kartu Deret
 *  Hari Terpanjang Tidak Hujan, Keseimbangan Air, Lama Penyinaran & VPD —
 *  seluruh widget sidebar dari Figma sudah lengkap. Tiap kartu adalah link
 *  ke halaman Monitoring domain yang sama. */
export function BerandaSidePanel({ stationId }: { stationId?: string }) {
  return (
    <Panel>
      <CardLink href="/monitoring/dry-spell">
        <DrySpellSummaryCard stationId={stationId} />
      </CardLink>
      <CardLink href="/monitoring/water-balance">
        <WaterBalanceSummaryCard stationId={stationId} />
      </CardLink>
      <CardLink href="/monitoring/lama-penyinaran">
        <SunshineDurationSummaryCard stationId={stationId} />
      </CardLink>
      <CardLink href="/monitoring/vpd">
        <VpdSummaryCard stationId={stationId} />
      </CardLink>
    </Panel>
  );
}

const CardLink = styled(Link)`
  display: block;
  width: 100%;
  color: inherit;
  text-decoration: none;
`;

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
