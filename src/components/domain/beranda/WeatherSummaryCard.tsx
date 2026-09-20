"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import styled from "styled-components";
import {
  ArrowDownIcon,
  CheckCircleIcon,
  ChevronCircleDownIcon,
  WarningTriangleIcon,
} from "@/components/shared/DashboardIcons";
import type { WeatherChartPoint, WeatherStatus } from "@/types/domain";

interface WeatherSummaryCardProps {
  label: string;
  illustrationSrc: string;
  value: number | null;
  unit: string;
  chart: WeatherChartPoint[];
  status: WeatherStatus;
  /** `false` = sembunyikan chip persentase (mis. arah angin: perubahan
   *  derajat tidak bermakna). */
  showTrend?: boolean;
  /** Teks kecil di samping nilai besar (mis. nama arah "Barat"). */
  valueSuffix?: string;
  /** Format nilai di 3 kotak hari (mis. derajat → nama arah); default =
   *  angka + unit. Komponen di `domain/` dilarang import `@/lib/utils`,
   *  jadi konversi seperti itu dikirim dari pemanggil. */
  formatDayValue?: (value: number | null) => string;
}

const RECENT_DAYS = 3;

/** Kartu ringkasan metrik cuaca Beranda (Frame 27 Figma): tab label, nilai
 *  terkini + chip perubahan, 3 hari terakhir, ilustrasi, banner status.
 *  Dipakai ketujuh kartu metrik Beranda (Curah Hujan, Kelembapan Relatif,
 *  Temperatur, Radiasi, Tekanan, Kecepatan Angin, Arah Mata Angin). */
export function WeatherSummaryCard({
  label,
  illustrationSrc,
  value,
  unit,
  chart,
  status,
  showTrend = true,
  valueSuffix,
  formatDayValue,
}: WeatherSummaryCardProps) {
  // Titik terakhir `chart` = hari ini, jadi 3 kotak = 3 hari SEBELUM hari ini.
  const recentDays = chart.slice(-(RECENT_DAYS + 1), -1);
  const trend = showTrend ? computeTrendPercent(chart) : null;

  const [expanded, setExpanded] = useState(false);
  const statusTextRef = useRef<HTMLSpanElement>(null);
  const truncated = useIsTruncated(statusTextRef, status.message);
  // Saat `expanded` teks tidak lagi terpotong, tombol tetap harus ada untuk menutup.
  const canToggle = truncated || expanded;

  return (
    <Card>
      <Body>
        <Main>
          <LabelTab>{label}</LabelTab>
          <Content>
            <ValueRow>
              <ValueGroup>
                <Value>{formatWithUnit(value, unit)}</Value>
                {valueSuffix && <ValueSuffix>{valueSuffix}</ValueSuffix>}
              </ValueGroup>
              {trend !== null && (
                <TrendChip>
                  <TrendArrow $up={trend > 0} size={16} />
                  <TrendText>{Math.abs(trend)}%</TrendText>
                </TrendChip>
              )}
            </ValueRow>
            <RecentDays>
              {recentDays.map((day) => (
                <DayBox key={day.date}>
                  <DayLabel>{day.date}</DayLabel>
                  <DayValue>
                    {formatDayValue
                      ? formatDayValue(day.value)
                      : formatWithUnit(day.value, unit)}
                  </DayValue>
                </DayBox>
              ))}
            </RecentDays>
          </Content>
        </Main>
        <Illustration src={illustrationSrc} alt="" width={130} height={130} />
      </Body>

      {status.message && (
        <StatusRow>
          <StatusBanner $tone={status.tone}>
            <IconCircle $tone={status.tone}>
              {status.tone === "success" ? <CheckCircleIcon /> : <WarningTriangleIcon />}
            </IconCircle>
            <StatusText ref={statusTextRef} $expanded={expanded}>
              {status.message}
            </StatusText>
            {canToggle && (
              <ToggleButton
                type="button"
                aria-expanded={expanded}
                aria-label={expanded ? "Sembunyikan" : "Tampilkan selengkapnya"}
                onClick={(event) => {
                  // Kartu dibungkus <Link> di page.tsx — jangan ikut navigasi.
                  event.preventDefault();
                  event.stopPropagation();
                  setExpanded((prev) => !prev);
                }}
              >
                <ToggleIcon
                  $expanded={expanded}
                  size={16}
                  color={TONE_COLORS[status.tone].badge}
                />
              </ToggleButton>
            )}
          </StatusBanner>
        </StatusRow>
      )}
    </Card>
  );
}

/** `true` kalau teks di `ref` terpotong ellipsis. Pakai ResizeObserver (state
 *  di-set dari callback observer, bukan sinkron di body effect — ditolak lint
 *  `react-hooks/set-state-in-effect`); `text` di dependency supaya observasi
 *  diulang saat pesan berganti tanpa perubahan ukuran elemen. */
function useIsTruncated(ref: RefObject<HTMLElement | null>, text: string): boolean {
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setTruncated(element.scrollWidth > element.clientWidth);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, text]);

  return truncated;
}

/** Pembulatan 1 desimal; unit `%` ditulis rapat ("90%", sesuai Figma), unit
 *  lain pakai spasi ("0.4 mm"). */
function formatWithUnit(value: number | null, unit: string): string {
  const glued = unit === "%" || unit === "°";
  if (value === null) return glued ? `--${unit}` : `-- ${unit}`;
  const rounded = Math.round(value * 10) / 10;
  return glued ? `${rounded}${unit}` : `${rounded} ${unit}`;
}

/** Perubahan nilai hari ini vs kemarin (dari 2 titik terakhir `chart`,
 *  sumber yang sama supaya apple-to-apple) — tidak ada field persentase
 *  dari BE manapun, jadi derived di sini. `null` (badge disembunyikan) kalau
 *  salah satu hari tanpa data (mis. kelembapan), kemarin 0 (pembagi nol),
 *  atau hasil pembulatan 0%. Catatan: angka hari ini bisa masih parsial
 *  (hari berjalan, terutama curah hujan), jadi di pagi hari hampir selalu
 *  turun. */
function computeTrendPercent(chart: WeatherChartPoint[]): number | null {
  const today = chart[chart.length - 1]?.value;
  const yesterday = chart[chart.length - 2]?.value;
  if (today == null || yesterday == null || yesterday === 0) return null;

  const percent = Math.round(((today - yesterday) / yesterday) * 100);
  return percent === 0 ? null : percent;
}

/* Kartu fluid (lebar ikut cell grid, bukan viewport) — makanya pakai
 * `@container` di lebar kartu, bukan `media.desktop`. Base = spec Figma
 * (kartu 530px); <500px = versi ringkas (ilustrasi 96px, padding
 * dikurangi) supaya 3 kotak hari tetap muat di lebar ~440px (kolom kiri
 * Beranda di 1280px); <420px = ilustrasi disembunyikan. Versi ringkas
 * BUKAN dari Figma (hanya ada mockup 530px), asumsi penulis. */
const Card = styled.div`
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 530px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 20px;
`;

const Body = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 0 40px 0 0;

  @container (max-width: 499px) {
    padding-right: 16px;
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 0;
  gap: 12px;
  padding: 12px 0;
`;

const LabelTab = styled.div`
  box-sizing: border-box;
  align-self: flex-start;
  max-width: 100%;
  width: 180px;
  padding: 8px 12px;
  background: #175fe2;
  border-radius: 0 50px 50px 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #ffffff;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding-left: 24px;

  @container (max-width: 499px) {
    padding-left: 16px;
  }
`;

const ValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ValueGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

/* TODO: style estimasi dari screenshot (Plus Jakarta Sans 400 16/24) —
 * menunggu CSS Figma teks arah dari user. */
const ValueSuffix = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #1d2520;
  white-space: nowrap;
`;

const Value = styled.span`
  font-family: var(--font-manrope), sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 38px;
  color: #1d2520;
  white-space: nowrap;
`;

const TrendChip = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  padding: 6px 8px;
  background: #dce9ff;
  border: 1.5px solid #bbd3ff;
  border-radius: 100px;
`;

const TrendArrow = styled(ArrowDownIcon)<{ $up: boolean }>`
  flex-shrink: 0;
  transform: ${(p) => (p.$up ? "rotate(180deg)" : "none")};
`;

const TrendText = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 12px;
  color: #1454c9;
`;

const RecentDays = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DayBox = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 0 1 100px;
  min-width: 0;
  min-height: 50px;
  padding: 4px 8px 8px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
`;

const DayLabel = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: #667a6c;
  white-space: nowrap;
`;

const DayValue = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 16px;
  color: #1d2520;
  white-space: nowrap;
`;

const Illustration = styled(Image)`
  flex-shrink: 0;
  width: 130px;
  height: 130px;
  object-fit: contain;

  @container (max-width: 499px) {
    width: 96px;
    height: 96px;
  }

  @container (max-width: 419px) {
    display: none;
  }
`;

const StatusRow = styled.div`
  padding: 0 16px 16px;
`;

const TONE_COLORS = {
  warning: { bg: "#FAC5C3", badge: "#EE443F" },
  success: { bg: "#C5E9CD", badge: "#43B75D" },
} as const;

const StatusBanner = styled.div<{ $tone: "success" | "warning" }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  background: ${(p) => TONE_COLORS[p.$tone].bg};
`;

const IconCircle = styled.div<{ $tone: "success" | "warning" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50px;
  background: ${(p) => TONE_COLORS[p.$tone].badge};
`;

const StatusText = styled.span<{ $expanded: boolean }>`
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: ${(p) => (p.$expanded ? "normal" : "nowrap")};
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #1d2520;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
`;

const ToggleIcon = styled(ChevronCircleDownIcon)<{ $expanded: boolean }>`
  transform: ${(p) => (p.$expanded ? "rotate(180deg)" : "none")};
`;
