"use client";

import Image from "next/image";
import styled from "styled-components";
import { useDashboardDrySpell } from "@/hooks/use-dashboard-sidebar";
import { SidePanelWarningBanner } from "@/components/domain/beranda/SidePanelWarningBanner";
import { SkeletonBlock } from "@/components/shared/SkeletonBlock";
import { getErrorMessage } from "@/lib/api/error-messages";
import { getDrySpellLevel } from "@/lib/dry-spell-level";

/** Kartu "Deret Hari Terpanjang Tidak Hujan" di sidebar kanan Beranda.
 *  Hit `/api/v2/dashboards/dry_spell?weather_station_id=...` */
export function DrySpellSummaryCard({ stationId }: { stationId?: string }) {
  const { data, isLoading, isError, error } = useDashboardDrySpell(stationId);

  const pending = !stationId || isLoading;

  let dateText: string;
  if (isError) dateText = "Data tidak dapat dimuat";
  else if (!data?.date) dateText = "Belum ada periode tercatat";
  else dateText = data.date;

  const valueText = data?.total_dry_spell ?? "—";
  const message = isError ? getErrorMessage(error) : (data?.insight ?? "");

  // TODO: SEMENTARA — menunggu rules warna baru dari peneliti. Threshold
  // > 20 hari (getDrySpellLevel "tinggi") & warna merah belum final.
  const days = parseInt(data?.total_dry_spell ?? "", 10);
  const isHigh = getDrySpellLevel(Number.isNaN(days) ? null : days) === "tinggi";

  return (
    <Card $high={isHigh}>
      <GlowFrame aria-hidden>
        <Glow src="/brand/dry-spell-glow.webp" alt="" width={520} height={520} />
      </GlowFrame>

      <Content>
        <Title $high={isHigh}>Deret Hari Terpanjang Tidak Hujan</Title>
        <ValueRow>
          <Image src="/brand/dry-spell.png" alt="" width={50} height={50} />
          {pending ? (
            <SkeletonBlock $w="80px" $h="28px" $radius="8px" />
          ) : (
            <Value $high={isHigh}>{valueText}</Value>
          )}
        </ValueRow>
      </Content>

      {pending ? (
        <SkeletonBlock $w="140px" $h="14px" />
      ) : (
        <DateText>{dateText}</DateText>
      )}

      {!pending && message ? <SidePanelWarningBanner message={message} /> : null}
    </Card>
  );
}

const Card = styled.div<{ $high: boolean }>`
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
  background: ${(p) =>
    p.$high
      ? "linear-gradient(277.11deg, #ffdad9 2.38%, #ff9c99 73.49%)"
      : "linear-gradient(277.11deg, #ffeeb7 2.38%, #ffe100 73.49%)"};
  border: 1px solid ${(p) => (p.$high ? "#ee443f" : "#e89b00")};
  border-radius: 16px;
`;

/* Frame "Background" Figma (tinggi 106px, clip content) — glow 520px
 * sengaja menjulur keluar frame, cuma bagian atas yang kelihatan. Clip
 * mentah di 106px bikin garis batas tegas di layar asli (Figma tidak
 * menampakkannya), jadi bagian bawah frame dipudarkan lewat mask —
 * bukan bagian spec Figma, penyesuaian visual. */
const GlowFrame = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 106px;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  -webkit-mask-image: linear-gradient(to bottom, #000 30%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 30%, transparent 100%);
`;

/* Opacity < 1 supaya lingkaran putih di tengah glow tidak terlalu
 * mencolok (di Figma tampil redup) — nilai perkiraan visual. */
const Glow = styled(Image)`
  position: absolute;
  top: -247px;
  right: -242px;
  width: 520px;
  height: 520px;
  max-width: none;
  opacity: 0.55;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.span<{ $high: boolean }>`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: ${(p) => (p.$high ? "#b3261e" : "#b57900")};
`;

const ValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Value = styled.span<{ $high: boolean }>`
  font-family: var(--font-manrope), sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  color: ${(p) => (p.$high ? "#8a1c17" : "#8c5e00")};
`;

const DateText = styled.span`
  position: relative;
  z-index: 2;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.5);
`;
