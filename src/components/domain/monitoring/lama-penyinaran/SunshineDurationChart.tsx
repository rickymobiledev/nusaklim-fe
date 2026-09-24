"use client";

import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Sun } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { DataState } from "@/components/shared/DataState";
import { getBatasBawahJam } from "@/lib/sunshine-duration-summary";
import type { SunshineDuration } from "@/types/domain";

/** Estimasi lebar per titik tanggal supaya label "01 Agt 2026" tidak
 *  bertumpuk di mobile — chart di-scroll horizontal (pola sama
 *  `air-temperature`), BELUM spec Figma. */
const CHART_MIN_WIDTH_PER_POINT = 90;
const Y_TICKS = [0, 2, 4, 6, 8, 10, 12, 14];

interface ChartRow {
  tanggal: string;
  lamaPenyinaranJam: number;
}

export function SunshineDurationChart({
  data,
  isLoading,
  isError,
  error,
}: {
  data: SunshineDuration[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
}) {
  const rows: ChartRow[] = data.map((d) => ({
    tanggal: format(parseISO(d.tanggal), "dd MMM yyyy", { locale: id }),
    lamaPenyinaranJam: d.lamaPenyinaranJam,
  }));
  const batasBawah = getBatasBawahJam(data);
  const yMax = Math.max(14, ...rows.map((r) => Math.ceil(r.lamaPenyinaranJam / 2) * 2));
  const ticks =
    yMax > 14 ? Array.from({ length: yMax / 2 + 1 }, (_, i) => i * 2) : Y_TICKS;

  return (
    <Card>
      <HeadingRow>
        <Sun size={18} strokeWidth={1.5} color="#1d2520" />
        <Heading>Lama Penyinaran (Jam/Hari)</Heading>
      </HeadingRow>

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={data.length === 0}
        emptyMessage="Pilih stasiun & rentang tanggal untuk melihat lama penyinaran."
      >
        <ChartScroll>
          <ChartInner $minWidth={rows.length * CHART_MIN_WIDTH_PER_POINT}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={rows} margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EA" />
                <XAxis
                  dataKey="tanggal"
                  tick={{ fontSize: 12, fill: "#6D717F" }}
                  tickLine={false}
                  axisLine={{ stroke: "#D2D5DB" }}
                />
                <YAxis
                  domain={[0, yMax]}
                  ticks={ticks}
                  tick={{ fontSize: 12, fill: "#6D717F" }}
                  tickLine={false}
                  axisLine={{ stroke: "#D2D5DB" }}
                />
                <Tooltip cursor={false} content={<ChartTooltip />} />
                <ReferenceLine y={batasBawah} stroke="#EE443F" strokeWidth={1} />
                <Bar
                  dataKey="lamaPenyinaranJam"
                  name="Lama Penyinaran"
                  shape={<PillBar />}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartInner>
        </ChartScroll>

        <Footnote>
          Garis merah pada grafis adalah batas bawah lama penyinaran &lt; {batasBawah} jam
        </Footnote>
      </DataState>
    </Card>
  );
}

const BAR_WIDTH = 36;
const BAR_FRAME = 2;

interface PillBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/** Batang pil sesuai Figma: bingkai luar `#F6F8F7` (radius atas 24) + isi
 *  `#0039FF` (radius atas 24, bawah 4), lebar tetap 36px di tengah slot. */
function PillBar({ x = 0, y = 0, width = 0, height = 0 }: PillBarProps) {
  if (height <= 0) return null;
  const left = x + (width - BAR_WIDTH) / 2;
  const radius = Math.min(BAR_WIDTH / 2, height);
  return (
    <g>
      <path
        d={roundedTopPath(
          left - BAR_FRAME,
          y - BAR_FRAME,
          BAR_WIDTH + BAR_FRAME * 2,
          height + BAR_FRAME,
          radius + BAR_FRAME,
          6,
        )}
        fill="#F6F8F7"
      />
      <path d={roundedTopPath(left, y, BAR_WIDTH, height, radius, 4)} fill="#0039FF" />
    </g>
  );
}

/** Path persegi panjang dengan radius sudut atas `top` dan bawah `bottom`. */
function roundedTopPath(
  x: number,
  y: number,
  w: number,
  h: number,
  top: number,
  bottom: number,
): string {
  const t = Math.min(top, w / 2, h);
  const b = Math.min(bottom, w / 2, Math.max(h - t, 0));
  return [
    `M ${x} ${y + t}`,
    `Q ${x} ${y} ${x + t} ${y}`,
    `L ${x + w - t} ${y}`,
    `Q ${x + w} ${y} ${x + w} ${y + t}`,
    `L ${x + w} ${y + h - b}`,
    `Q ${x + w} ${y + h} ${x + w - b} ${y + h}`,
    `L ${x + b} ${y + h}`,
    `Q ${x} ${y + h} ${x} ${y + h - b}`,
    "Z",
  ].join(" ");
}

interface ChartTooltipPayloadEntry {
  value?: number | string | null;
  payload?: ChartRow;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ChartTooltipPayloadEntry[];
}) {
  const entry = payload?.[0];
  if (!active || !entry || entry.value === null || entry.value === undefined) return null;

  return (
    <TooltipBox>
      <TooltipDate>{entry.payload?.tanggal}</TooltipDate>
      <TooltipMetricRow>
        <TooltipLabel>Lama Penyinaran</TooltipLabel>
        <TooltipValue>{Number(entry.value)} Jam</TooltipValue>
      </TooltipMetricRow>
    </TooltipBox>
  );
}

const Card = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 8px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7ea;
  border-radius: 12px;
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Heading = styled.h3`
  margin: 0;
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: #000000;
`;

const ChartScroll = styled.div`
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ChartInner = styled.div<{ $minWidth: number }>`
  min-width: ${(p) => p.$minWidth}px;
`;

const Footnote = styled.p`
  margin: 0;
  padding-top: 8px;
  text-align: center;
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: #6d717f;
`;

const TooltipBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 156px;
  padding: 8px;
  background: #ffffff;
  border: 1px solid #e5e7ea;
  border-radius: 12px;
  box-shadow: 4px 4px 15.5px rgba(0, 0, 0, 0.15);
`;

const TooltipDate = styled.span`
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: #000000;
`;

const TooltipMetricRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TooltipLabel = styled.span`
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  color: #6d717f;
`;

const TooltipValue = styled.span`
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #0039ff;
`;
