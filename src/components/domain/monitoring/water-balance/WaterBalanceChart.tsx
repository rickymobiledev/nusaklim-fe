"use client";

import { useState } from "react";
import styled from "styled-components";
import { Droplets, Info } from "lucide-react";
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
import { getStationColor } from "@/lib/station-colors";
import { mergeSeriesByMonth, sumMetric } from "@/lib/water-balance-chart-utils";
import type { WaterBalance, WaterBalanceMetric } from "@/types/domain";

const METRIC_LABEL: Record<WaterBalanceMetric, string> = {
  waterDeficit: "Defisit Air",
  rainfall: "Curah Hujan",
  rainyDays: "Hari Hujan",
  waterSurplus: "Kelebihan Air",
};

/** Ambang defisit air > 200mm/tahun ikut teks alert Figma (sama seperti
 *  panel "Keseimbangan Air" di tab Peta) — bukan field dari BE. */
const WATER_DEFICIT_THRESHOLD = 200;

interface ColoredYearSeries extends WaterBalance {
  color: string;
}

export function WaterBalanceChart({
  series,
  metric,
  isLoading,
  isError,
  error,
}: {
  series: WaterBalance[];
  metric: WaterBalanceMetric;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
}) {
  const coloredSeries: ColoredYearSeries[] = series.map((s, index) => ({
    ...s,
    color: getStationColor(index),
  }));
  const rows = mergeSeriesByMonth(series, metric);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  return (
    <Card>
      <HeadingRow>
        <Droplets size={18} strokeWidth={1.5} color="#1d2520" />
        <Heading>{METRIC_LABEL[metric]}</Heading>
      </HeadingRow>

      {metric === "waterDeficit" && (
        <InfoAlert>
          <Info size={20} strokeWidth={1.5} color="#175fe2" />
          <AlertText>
            Defisit air &gt; {WATER_DEFICIT_THRESHOLD} mm/tahun akan menyebabkan cekaman
            kekeringan bagi tanaman kelapa sawit.
          </AlertText>
        </InfoAlert>
      )}

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={coloredSeries.length === 0}
        emptyMessage="Pilih stasiun untuk melihat keseimbangan air."
      >
        <ResponsiveContainer width="100%" height={352}>
          <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EA" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#6D717F" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6D717F" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={
                <ChartTooltip
                  series={coloredSeries}
                  metric={metric}
                  hoveredYear={hoveredYear}
                />
              }
            />
            {metric === "waterDeficit" && (
              <ReferenceLine
                y={WATER_DEFICIT_THRESHOLD}
                stroke="#EE443F"
                strokeWidth={1.5}
              />
            )}
            {coloredSeries.map((s) => (
              <Line
                key={s.year}
                type="monotone"
                dataKey={s.year}
                name={String(s.year)}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  onMouseEnter: () => setHoveredYear(s.year),
                  onMouseLeave: () => setHoveredYear(null),
                }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        <Legend>
          {coloredSeries.map((s) => (
            <LegendItem key={s.year}>
              <LegendDot $color={s.color} />
              {s.year} Total: {sumMetric(s, metric).toLocaleString("id-ID")}
            </LegendItem>
          ))}
        </Legend>

        {metric === "waterDeficit" && (
          <FootnoteText>
            Garis merah pada grafik adalah batas bawah defisit air &gt;{" "}
            {WATER_DEFICIT_THRESHOLD}
          </FootnoteText>
        )}
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
  metric,
  hoveredYear,
}: {
  active?: boolean;
  label?: string;
  payload?: ChartTooltipPayloadEntry[];
  series: ColoredYearSeries[];
  metric: WaterBalanceMetric;
  hoveredYear: number | null;
}) {
  if (!active || !payload || hoveredYear === null) return null;

  const entry = payload.find((p) => Number(p.dataKey) === hoveredYear);
  const s = series.find((item) => item.year === hoveredYear);
  if (!entry || !s || entry.value === null || entry.value === undefined) return null;

  return (
    <TooltipBox>
      <TooltipMonth>{label}</TooltipMonth>
      <TooltipMetricRow>
        <TooltipLabel>{METRIC_LABEL[metric]}</TooltipLabel>
        <TooltipValue $color={s.color}>{entry.value}</TooltipValue>
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

const InfoAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #e6f4ff;
  border: 1.5px solid #0095ff;
  border-radius: 12px;
`;

const AlertText = styled.p`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: #667a6c;
`;

const FootnoteText = styled.p`
  margin: 0;
  text-align: center;
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  color: #6d717f;
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

const TooltipMonth = styled.span`
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
