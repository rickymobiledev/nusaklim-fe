"use client";

import { useState } from "react";
import styled from "styled-components";
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
import { mergeSeriesByDate } from "@/lib/relative-humidity-chart-utils";

interface ColoredSeries {
  stationId: string;
  stationName: string;
  color: string;
}

export function RelativeHumidityChart({
  series,
  isLoading,
  isError,
  error,
}: {
  series: (ColoredSeries & { points: { date: string; value: number | null }[] })[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
}) {
  const rows = mergeSeriesByDate(series);
  const [hoveredStationId, setHoveredStationId] = useState<string | null>(null);

  return (
    <Card>
      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={series.length === 0}
        emptyMessage="Pilih minimal satu stasiun untuk melihat grafik."
      >
        <ResponsiveContainer width="100%" height={352}>
          <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EA" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6D717F" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6D717F" }}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 2", "dataMax + 2"]}
              tickFormatter={(value: number) => value.toLocaleString("id-ID")}
            />
            <Tooltip
              content={
                <ChartTooltip series={series} hoveredStationId={hoveredStationId} />
              }
            />
            {series.map((s) => (
              <Line
                key={s.stationId}
                type="monotone"
                dataKey={s.stationId}
                name={s.stationName}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  onMouseEnter: () => setHoveredStationId(s.stationId),
                  onMouseLeave: () => setHoveredStationId(null),
                }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        <Legend>
          {series.map((s) => (
            <LegendItem key={s.stationId}>
              <LegendDot $color={s.color} />
              {s.stationName}
            </LegendItem>
          ))}
        </Legend>
      </DataState>
    </Card>
  );
}

interface ChartTooltipPayloadEntry {
  dataKey?: string | number;
  value?: number | string | null;
}

function ChartTooltip({
  active,
  label,
  payload,
  series,
  hoveredStationId,
}: {
  active?: boolean;
  label?: string;
  payload?: ChartTooltipPayloadEntry[];
  series: ColoredSeries[];
  hoveredStationId: string | null;
}) {
  if (!active || !payload || !hoveredStationId) return null;

  const entry = payload.find((p) => p.dataKey === hoveredStationId);
  const s = series.find((item) => item.stationId === hoveredStationId);
  if (!entry || !s || entry.value === null || entry.value === undefined) return null;

  return (
    <TooltipBox>
      <TooltipStationName>{s.stationName}</TooltipStationName>
      <TooltipDivider />
      <TooltipDate>{label}</TooltipDate>
      <TooltipMetricRow>
        <TooltipLabel>Kelembapan Relatif</TooltipLabel>
        <TooltipValue $color={s.color}>
          {Number(entry.value).toLocaleString("id-ID")}
        </TooltipValue>
      </TooltipMetricRow>
    </TooltipBox>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 8px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e7ea;
  border-radius: 12px;
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
  flex-direction: row;
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

const TooltipStationName = styled.span`
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #000000;
`;

const TooltipDivider = styled.div`
  border-top: 1px solid #e5e7ea;
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
  font-weight: 600;
  color: ${(p) => p.$color};
`;
