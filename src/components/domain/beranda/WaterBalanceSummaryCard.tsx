"use client";

import { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { useWaterBalance } from "@/hooks/use-water-balance";
import { SidePanelWarningBanner } from "@/components/domain/beranda/SidePanelWarningBanner";
import { getErrorMessage } from "@/lib/api/error-messages";
import {
  getLastCompletedMonth,
  getWaterBalanceMessage,
  pickLatestWaterBalanceMonth,
} from "@/lib/water-balance-summary";

/** Kartu "Keseimbangan Air" di sidebar kanan Beranda. Data 4 metrik SATU
 *  bulan: bulan terakhir yang sudah selesai (mulai bulan lalu) dan ada
 *  datanya, dari endpoint per-stasiun yang SAMA dengan Monitoring >
 *  Keseimbangan Air (`useWaterBalance`) — BUKAN `/devices/water_deficit`
 *  (company-wide tab Peta). */
export function WaterBalanceSummaryCard({ stationId }: { stationId?: string }) {
  const [rainFailed, setRainFailed] = useState(false);

  const target = getLastCompletedMonth(new Date());
  const { data, isLoading, isError, error } = useWaterBalance({
    stationId,
    years: [target.year],
  });

  const month = pickLatestWaterBalanceMonth(data?.[0], target.monthIndex);

  let message: string;
  if (isError) message = getErrorMessage(error);
  else if (!stationId || isLoading) message = "Memuat data...";
  else message = getWaterBalanceMessage(month);

  return (
    <Card>
      {/* Aset hujan Figma (rain-png-45866) menyusul dari user — kalau file
          belum ada, disembunyikan saja supaya tidak muncul ikon gambar
          rusak, kartu tetap tampil normal. */}
      {!rainFailed && (
        <BackgroundFrame aria-hidden>
          <Rain
            src="/brand/water-balance-rain.png"
            alt=""
            width={159}
            height={119}
            onError={() => setRainFailed(true)}
          />
        </BackgroundFrame>
      )}

      <Header>
        <Image src="/brand/water-balance.png" alt="" width={50} height={50} />
        <Title>Keseimbangan Air</Title>
      </Header>

      <TileRow>
        <MetricTile label="Curah Hujan" value={formatDecimal(month?.rainfall)} />
        <MetricTile
          label="Hari Hujan"
          value={month?.rainyDays == null ? "—" : `${month.rainyDays} Hari`}
        />
      </TileRow>
      <TileRow>
        <MetricTile
          label="Defisit Air"
          value={formatDecimal(month?.waterDeficit)}
          unit="mm"
        />
        <MetricTile
          label="Kelebihan Air"
          value={formatDecimal(month?.waterSurplus)}
          unit="mm"
        />
      </TileRow>

      <SidePanelWarningBanner message={message} />
    </Card>
  );
}

function MetricTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <Tile>
      <TileLabel>{label}</TileLabel>
      <TileValue>
        {value}
        {unit && value !== "—" && <Unit> {unit}</Unit>}
      </TileValue>
    </Tile>
  );
}

function formatDecimal(value: number | null | undefined): string {
  return value == null ? "—" : value.toFixed(2);
}

const Card = styled.div`
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 8px;
  padding: 16px;
  overflow: hidden;
  background: linear-gradient(110.42deg, #e6f4ff 15.72%, #f6fbff 98.36%);
  border: 1px solid #b0deff;
  border-radius: 16px;
`;

/* Frame "Background" Figma (265×209) — gambar hujan di-mask radial putih
 * (Rectangle 1 Figma, tipe Mask) supaya cuma tampak di pojok kanan atas. */
const BackgroundFrame = styled.div`
  position: absolute;
  top: 1px;
  left: 0;
  right: 0;
  height: 209px;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  -webkit-mask-image: radial-gradient(
    48.9% 46.43% at 80.52% -2.62%,
    #000 0%,
    transparent 100%
  );
  mask-image: radial-gradient(48.9% 46.43% at 80.52% -2.62%, #000 0%, transparent 100%);
`;

const Rain = styled(Image)`
  position: absolute;
  top: 0;
  left: 109px;
  width: 159px;
  height: 119px;
  max-width: none;
`;

const Header = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #00528c;
`;

const TileRow = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-self: stretch;
  gap: 8px;
`;

const Tile = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-width: 0;
  height: 64px;
  padding: 8px;
  gap: 4px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
`;

const TileLabel = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #667a6c;
`;

const TileValue = styled.span`
  font-family: var(--font-manrope), sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  color: #006ab5;
  white-space: nowrap;
`;

/* Unit "mm" lebih kecil dari angka di screenshot Figma (CSS Figma cuma
 * mencatat satu ukuran 24px) — ukuran 16px perkiraan visual. */
const Unit = styled.span`
  font-size: 16px;
`;
