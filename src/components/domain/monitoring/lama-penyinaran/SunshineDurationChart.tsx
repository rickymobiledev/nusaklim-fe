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
import { ChartSkeleton } from "@/components/shared/ChartSkeleton";
import { DataState } from "@/components/shared/DataState";
import { PillBar } from "@/components/shared/PillBar";
import { getBatasBawahJam } from "@/lib/sunshine-duration-summary";
import type { SunshineDuration } from "@/types/domain";

/** Lebar minimum per titik tanggal — chart di-scroll horizontal kalau
 *  titiknya lebih banyak dari lebar card (pola sama `air-temperature`).
 *  Sengaja kecil (40px): dulu 90px + scrollbar disembunyikan, sehingga
 *  rentang > ±14 hari terpotong diam-diam di desktop. Label sumbu X yang
 *  bertumpuk dilewati Recharts (`minTickGap`). BELUM spec Figma. */
const CHART_MIN_WIDTH_PER_POINT = 40;
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
        skeleton={<ChartSkeleton />}
      >
        <ChartScroll>
          <ChartInner $minWidth={rows.length * CHART_MIN_WIDTH_PER_POINT}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={rows} margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EA" />
                <XAxis
                  dataKey="tanggal"
                  minTickGap={8}
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
  -webkit-overflow-scrolling: touch;
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
