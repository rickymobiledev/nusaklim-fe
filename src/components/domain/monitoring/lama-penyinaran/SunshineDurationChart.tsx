"use client";

import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Sun } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { DataState } from "@/components/shared/DataState";
import { getStationColor } from "@/lib/station-colors";
import type { SunshineDuration } from "@/types/domain";

interface ChartRow {
  tanggal: string;
  lamaPenyinaranJam: number | null;
  batasBawahJam: number | null;
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
    tanggal: format(parseISO(d.tanggal), "dd MMM", { locale: id }),
    lamaPenyinaranJam: d.lamaPenyinaranJam,
    batasBawahJam: d.batasBawahJam,
  }));

  const lamaColor = getStationColor(0);
  const batasColor = getStationColor(1);

  return (
    <Card>
      <HeadingRow>
        <Sun size={18} strokeWidth={1.5} color="#1d2520" />
        <Heading>Lama Penyinaran</Heading>
      </HeadingRow>

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={data.length === 0}
        emptyMessage="Pilih stasiun & rentang tanggal untuk melihat lama penyinaran."
      >
        <ResponsiveContainer width="100%" height={352}>
          <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EA" />
            <XAxis
              dataKey="tanggal"
              tick={{ fontSize: 12, fill: "#6D717F" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6D717F" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="lamaPenyinaranJam"
              name="Lama Penyinaran"
              stroke={lamaColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="batasBawahJam"
              name="Batas Bawah"
              stroke={batasColor}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <Legend>
          <LegendItem>
            <LegendDot $color={lamaColor} />
            Lama Penyinaran
          </LegendItem>
          <LegendItem>
            <LegendDot $color={batasColor} />
            Batas Bawah
          </LegendItem>
        </Legend>
      </DataState>
    </Card>
  );
}

interface ChartTooltipPayloadEntry {
  dataKey?: string;
  name?: string;
  value?: number | string | null;
  color?: string;
}

function ChartTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: ChartTooltipPayloadEntry[];
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <TooltipBox>
      <TooltipDate>{label}</TooltipDate>
      {payload.map((entry) => {
        if (entry.value === null || entry.value === undefined) return null;
        return (
          <TooltipMetricRow key={entry.dataKey}>
            <TooltipLabel>{entry.name}</TooltipLabel>
            <TooltipValue $color={entry.color ?? "#000000"}>
              {entry.value} jam
            </TooltipValue>
          </TooltipMetricRow>
        );
      })}
    </TooltipBox>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 12px;
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

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding-top: 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: 1px solid #e5e7ea;
  border-radius: 12px;
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  box-sizing: border-box;
  background: #ffffff;
`;

const LegendDot = styled.span<{ $color: string }>`
  width: 18px;
  height: 4px;
  border-radius: 50px;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

const TooltipBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
  padding: 8px;
  background: #ffffff;
  border: 1px solid #e5e7ea;
  border-radius: 12px;
  box-shadow: 4px 4px 15.5px rgba(0, 0, 0, 0.15);
`;

const TooltipDate = styled.span`
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #000000;
`;

const TooltipMetricRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const TooltipLabel = styled.span`
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  color: #6d717f;
`;

const TooltipValue = styled.span<{ $color: string }>`
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${(p) => p.$color};
`;
