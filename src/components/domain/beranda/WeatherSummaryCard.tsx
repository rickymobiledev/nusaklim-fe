"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import styled from "styled-components";
import {
  CheckCircleIcon,
  ChevronCircleDownIcon,
  WarningTriangleIcon,
} from "@/components/shared/DashboardIcons";
import { SkeletonBlock } from "@/components/shared/SkeletonBlock";
import type { WeatherChartPoint, WeatherStatus } from "@/types/domain";

export interface WeatherSummaryDayItem {
  date: string;
  valueText: string;
}

export interface WeatherSummaryCardProps {
  label: string;
  illustrationSrc: string;
  value?: number | null;
  /** Nilai siap-tampil lengkap dengan unit (mis. "28.6 °C"), mengabaikan `value` & `unit`. */
  displayValue?: string;
  unit?: string;
  chart?: WeatherChartPoint[];
  /** Daftar 3 hari terakhir siap-tampil, mengabaikan slice dari `chart`. */
  days?: WeatherSummaryDayItem[];
  status: WeatherStatus;
  /** Teks kecil di samping nilai besar (mis. nama arah "Barat"). */
  valueSuffix?: string;
  /** Format nilai di 3 kotak hari (mis. derajat → nama arah); default =
   *  angka + unit. Komponen di `domain/` dilarang import `@/lib/utils`,
   *  jadi konversi seperti itu dikirim dari pemanggil. */
  formatDayValue?: (value: number | null) => string;
  /** `true` = nilai, 3 kotak hari & banner status diganti skeleton (label tab
   *  & ilustrasi statis tetap tampil). */
  isLoading?: boolean;
}

const RECENT_DAYS = 3;

/** Kartu ringkasan metrik cuaca Beranda (Frame 27 Figma): tab label, nilai
 *  terkini, 3 hari terakhir, ilustrasi, banner status.
 *  Dipakai ketujuh kartu metrik Beranda (Curah Hujan, Kelembapan Relatif,
 *  Temperatur, Radiasi, Tekanan, Kecepatan Angin, Arah Mata Angin). */
export function WeatherSummaryCard({
  label,
  illustrationSrc,
  value,
  displayValue,
  unit = "",
  chart,
  days,
  status,
  valueSuffix,
  formatDayValue,
  isLoading = false,
}: WeatherSummaryCardProps) {
  // Jika `days` dikirim eksplisit, pakai itu; jika tidak, ambil 3 hari sebelum hari ini dari `chart`
  const recentDays: WeatherSummaryDayItem[] =
    days ??
    (chart
      ? chart.slice(-(RECENT_DAYS + 1), -1).map((day) => ({
          date: day.date,
          valueText: formatDayValue
            ? formatDayValue(day.value)
            : formatWithUnit(day.value, unit),
        }))
      : []);

  const renderedValue = displayValue ?? formatWithUnit(value ?? null, unit);

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
              {isLoading ? (
                <SkeletonBlock $w="120px" $h="38px" $radius="8px" />
              ) : (
                <>
                  <ValueGroup>
                    <Value>{renderedValue}</Value>
                    {valueSuffix && <ValueSuffix>{valueSuffix}</ValueSuffix>}
                  </ValueGroup>
                </>
              )}
            </ValueRow>
            <RecentDays>
              {isLoading
                ? Array.from({ length: RECENT_DAYS }, (_, i) => (
                    <DayBox key={i}>
                      <SkeletonBlock $w="70%" $h="12px" />
                      <SkeletonBlock $w="50%" $h="14px" />
                    </DayBox>
                  ))
                : recentDays.map((day) => (
                    <DayBox key={day.date}>
                      <DayLabel>{day.date}</DayLabel>
                      <FitDayValue text={day.valueText} />
                    </DayBox>
                  ))}
            </RecentDays>
          </Content>
        </Main>
        <Illustration src={illustrationSrc} alt="" width={130} height={130} />
      </Body>

      {isLoading ? (
        <StatusRow>
          <SkeletonBlock $h="28px" $radius="8px" />
        </StatusRow>
      ) : status.message ? (
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
      ) : null}
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

const DAY_VALUE_MAX_FONT_PX = 16;
const DAY_VALUE_MIN_FONT_PX = 9;

/** Nilai di kotak hari: font turun dari 16px sampai teks muat selebar
 *  kotaknya (kotak fluid, ikut lebar kartu/viewport). Ukuran diatur langsung
 *  lewat style DOM di layout effect — bukan state — supaya tanpa re-render &
 *  tanpa kedip; ResizeObserver mengukur ulang saat lebar berubah. `ellipsis`
 *  di `DayValue` cuma pengaman di ukuran minimum. */
function FitDayValue({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const fit = () => {
      element.style.fontSize = `${DAY_VALUE_MAX_FONT_PX}px`;
      const { scrollWidth, clientWidth } = element;
      if (scrollWidth <= clientWidth) return;
      const fitted = Math.floor((DAY_VALUE_MAX_FONT_PX * clientWidth) / scrollWidth);
      element.style.fontSize = `${Math.max(DAY_VALUE_MIN_FONT_PX, fitted)}px`;
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text]);

  return <DayValue ref={ref}>{text}</DayValue>;
}

/** Pembulatan 1 desimal; unit `%` ditulis rapat ("90%", sesuai Figma), unit
 *  lain pakai spasi ("0.4 mm"). */
function formatWithUnit(value: number | null, unit: string): string {
  const glued = unit === "%" || unit === "°";
  if (value === null) return glued ? `--${unit}` : `-- ${unit}`;
  const rounded = Math.round(value * 10) / 10;
  return glued ? `${rounded}${unit}` : `${rounded} ${unit}`;
}

/* Kartu fluid (lebar ikut cell grid, bukan viewport) — makanya pakai
 * `@container` di lebar kartu, bukan `media.desktop`. Base = spec Figma
 * (kartu 530px); <500px = versi ringkas (ilustrasi 82px, padding
 * dikurangi) supaya 3 kotak hari tetap muat di lebar sempit — ukuran
 * 82px dikonfirmasi dari CSS Figma mobile persis (kartu ~397px lebar),
 * BUKAN lagi tebakan 96px/disembunyikan di bawah 420px seperti revisi
 * sebelumnya (mobile Figma TETAP menampilkan ilustrasi). */
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

/* `position:relative` — konteks positioning `Illustration` di mobile
 * (jadi `position:absolute`, lihat di bawah). Di mobile, ilustrasi
 * dilepas dari flex flow (bukan flex sibling `Main` lagi) — CSS Figma
 * mobile persis nunjukkan ilustrasi `position:absolute` "mengambang" di
 * pojok kanan atas, TIDAK menyisakan ruang horizontal, jadi `Main`
 * (label+value+day-boxes) mengisi PENUH lebar card, bukan cuma sisa
 * ruang setelah ilustrasi seperti desktop. */
const Body = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 0 40px 0 0;

  @container (max-width: 499px) {
    padding-right: 0;
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
    padding-right: 16px;
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
  flex: 1 1 0;
  min-width: 0;
  min-height: 60px;
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

/* Font-size final diatur `FitDayValue` lewat style inline (16px = ukuran
 * awal sebelum diukur); `ellipsis` = pengaman di ukuran minimum.
 * `display:block` wajib agar `overflow` berlaku. */
const DayValue = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: #1d2520;
  white-space: nowrap;
`;

const Illustration = styled(Image)`
  flex-shrink: 0;
  width: 130px;
  height: 130px;
  object-fit: contain;

  @container (max-width: 499px) {
    position: absolute;
    top: 12px;
    right: 16px;
    width: 82px;
    height: 82px;
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
