"use client";

import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Waves } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { DataState } from "@/components/shared/DataState";
import { getBatasAmanKpa, isMeaningfulVpdRow, formatKpa } from "@/lib/vpd-summary";
import type { VPDReport } from "@/types/domain";

/** Estimasi lebar per titik tanggal supaya label "01 Agt 2026" tidak
 *  bertumpuk di mobile — chart di-scroll horizontal (pola sama Lama
 *  Penyinaran), BELUM spec Figma. */
const CHART_MIN_WIDTH_PER_POINT = 90;
const Y_MIN_MAX = 3;

interface ChartRow {
  tanggal: string;
  /** `null` untuk baris kosong/lonjakan sensor dari BE (lihat
   *  `isMeaningfulVpdRow`) — diplot sebagai celah, bukan 0. */
  vpd: number | null;
}

export function VpdChart({
  data,
  isLoading,
  isError,
  error,
}: {
  data: VPDReport[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
}) {
  const rows: ChartRow[] = data.map((d) => ({
    tanggal: format(parseISO(d.tanggal), "dd MMM yyyy", { locale: id }),
    vpd: isMeaningfulVpdRow(d) ? d.vpd : null,
  }));
  const batasAman = getBatasAmanKpa(data);
  const maxVpd = Math.max(0, ...rows.map((r) => r.vpd ?? 0));
  const yMax = Math.max(Y_MIN_MAX, Math.ceil(maxVpd * 2) / 2);
  const ticks = Array.from({ length: yMax * 2 + 1 }, (_, i) => i / 2);

  return (
    <Card>
      <HeadingRow>
        <Waves size={18} strokeWidth={1.5} color="#1d2520" />
        <Heading>VPD</Heading>
      </HeadingRow>

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={data.length === 0}
        emptyMessage="Pilih stasiun & rentang tanggal untuk melihat VPD."
      >
        <ChartScroll>
          <ChartInner $minWidth={rows.length * CHART_MIN_WIDTH_PER_POINT}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={rows} margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
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
                  tickFormatter={(value: number) =>
                    value === 0 ? "0" : value.toFixed(1)
                  }
                  tick={{ fontSize: 12, fill: "#6D717F" }}
                  tickLine={false}
                  axisLine={{ stroke: "#D2D5DB" }}
                />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={batasAman} stroke="#EE443F" strokeWidth={1} />
                <Line
                  type="monotone"
                  dataKey="vpd"
                  name="VPD"
                  stroke="#0039FF"
                  strokeWidth={1}
                  dot={false}
                  activeDot={{ r: 4, fill: "#FFFFFF", stroke: "#0039FF", strokeWidth: 1 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartInner>
        </ChartScroll>

        <Footnote>
          Garis merah pada grafis adalah batas bawah VPD &gt;{" "}
          {Number(batasAman.toFixed(2))} kPa
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
        <TooltipLabel>VPD</TooltipLabel>
        <TooltipValue>{formatKpa(Number(entry.value))}</TooltipValue>
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
  min-width: 95px;
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
