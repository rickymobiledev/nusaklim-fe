"use client";

import { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { useDashboardWaterBalance } from "@/hooks/use-dashboard-sidebar";
import { SidePanelWarningBanner } from "@/components/domain/beranda/SidePanelWarningBanner";
import { SkeletonBlock } from "@/components/shared/SkeletonBlock";
import { getErrorMessage } from "@/lib/api/error-messages";
import { media } from "@/lib/breakpoints";

/** Kartu "Keseimbangan Air" di sidebar kanan Beranda.
 *  Hit `/api/v2/dashboards/water_balance?weather_station_id=...` */
export function WaterBalanceSummaryCard({ stationId }: { stationId?: string }) {
  const [rainFailed, setRainFailed] = useState(false);

  const { data, isLoading, isError, error } = useDashboardWaterBalance(stationId);

  let message = "";
  if (isError) message = getErrorMessage(error);
  else if (data?.insight) message = data.insight;

  const pending = !stationId || isLoading;

  const rainfall = parseValueAndUnit(data?.total_rainfall);
  const rainyDay = parseValueAndUnit(data?.total_rainy_day);
  const deficit = parseValueAndUnit(data?.total_water_deficit);
  const surplus = parseValueAndUnit(data?.total_water_surplus);

  return (
    <Card>
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
        <MetricTile
          label="Curah Hujan"
          value={rainfall.val}
          unit={rainfall.unit}
          loading={pending}
        />
        <MetricTile
          label="Hari Hujan"
          value={rainyDay.val}
          unit={rainyDay.unit}
          loading={pending}
        />
      </TileRow>
      <TileRow>
        <MetricTile
          label="Defisit Air"
          value={deficit.val}
          unit={deficit.unit}
          loading={pending}
        />
        <MetricTile
          label="Kelebihan Air"
          value={surplus.val}
          unit={surplus.unit}
          loading={pending}
        />
      </TileRow>

      {!pending && message ? <SidePanelWarningBanner message={message} /> : null}
    </Card>
  );
}

function parseValueAndUnit(str?: string | null) {
  if (!str) return { val: "—", unit: "" };
  const parts = str.trim().split(/\s+/);
  if (parts.length > 1) {
    return { val: parts[0], unit: parts.slice(1).join(" ") };
  }
  return { val: str, unit: "" };
}

function MetricTile({
  label,
  value,
  unit,
  loading,
}: {
  label: string;
  value: string;
  unit?: string;
  loading: boolean;
}) {
  return (
    <Tile>
      <TileLabel>{label}</TileLabel>
      {loading ? (
        <SkeletonBlock $w="64px" $h="28px" $radius="8px" />
      ) : (
        <TileValue>
          {value}
          {unit && value !== "—" && <Unit> {unit}</Unit>}
        </TileValue>
      )}
    </Tile>
  );
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
 * (Rectangle 1 Figma, tipe Mask) supaya cuma tampak di pojok kanan atas.
 * Mask dalam PIKSEL berjangkar ke kanan (setara persen Figma di lebar 265px:
 * 48.9%→130px, 46.43%→97px, 80.52%→52px dari kanan, -2.62%→-5px) — bukan
 * persen, karena gambar lebar tetap 159px sedangkan kartu melebar di
 * mobile; kalau persen, fade ikut melebar & tepi gambar jadi keras. */
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
    130px 97px at calc(100% - 52px) -5px,
    #000 0%,
    transparent 100%
  );
  mask-image: radial-gradient(
    130px 97px at calc(100% - 52px) -5px,
    #000 0%,
    transparent 100%
  );
`;

const Rain = styled(Image)`
  position: absolute;
  top: 0;
  right: 0;
  width: 159px;
  height: 119px;
  max-width: none;

  /* Desktop: kartu ±265px (spec Figma) — left 109px = rapat kanan juga. */
  ${media.desktop} {
    left: 109px;
    right: auto;
  }
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
