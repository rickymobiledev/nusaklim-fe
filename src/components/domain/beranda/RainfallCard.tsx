"use client";

import Image from "next/image";
import styled from "styled-components";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { WarningTriangleIcon } from "@/components/shared/DashboardIcons";
import type { WeatherChartPoint, WeatherStatus } from "@/types/domain";

interface RainfallCardProps {
  iconSrc: string;
  label: string;
  value: number | null;
  min: number | null;
  max: number | null;
  unit: string;
  chart: WeatherChartPoint[];
  status: WeatherStatus;
}

/** Sumbu-Y auto-scale ke data chart (bukan fixed 0-3mm) — curah hujan
 *  real bisa jauh di atas contoh Figma (dikonfirmasi uji langsung ke
 *  backend, ada hari dengan >19mm). 4 tick selalu: top = nilai maksimum
 *  dibulatkan ke atas, turun rata ke 0 — untuk data kecil (≤3mm) hasilnya
 *  kebetulan identik [3,2,1,0] seperti spec Figma. */
function computeYAxisTicks(chart: WeatherChartPoint[]): number[] {
  const maxValue = Math.max(0, ...chart.map((p) => p.value));
  const axisMax = Math.max(1, Math.ceil(maxValue));
  const step = axisMax / 3;
  return [axisMax, axisMax - step, axisMax - step * 2, 0].map(
    (v) => Math.round(v * 10) / 10,
  );
}

export function RainfallCard({
  iconSrc,
  label,
  value,
  min,
  max,
  unit,
  chart,
  status,
}: RainfallCardProps) {
  const yTicks = computeYAxisTicks(chart);
  const axisMax = yTicks[0];

  console.log({ chart });

  return (
    <Card>
      <Header>
        <IconLabel>
          <IconSlot src={iconSrc} alt="" width={54} height={54} />
          <LabelValueStack>
            <Label>{label}</Label>
            <Value>
              {value ?? "--"} {unit}
            </Value>
          </LabelValueStack>
        </IconLabel>

        <MinMaxPill>
          <MinHalf>
            <MinMaxLabel>Min</MinMaxLabel>
            <MinValue>
              {min ?? "--"}
              {unit}
            </MinValue>
          </MinHalf>
          <MaxHalf>
            <MinMaxLabel>Max</MinMaxLabel>
            <MaxValue>
              {max ?? "--"}
              {unit}
            </MaxValue>
          </MaxHalf>
        </MinMaxPill>
      </Header>

      <ChartSection>
        <ChartRow>
          <YAxisColumn>
            {yTicks.map((tick) => (
              <YTick key={tick}>{tick}</YTick>
            ))}
          </YAxisColumn>
          <ChartPlot>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <CartesianGrid
                  horizontal
                  vertical={false}
                  strokeDasharray="4 4"
                  stroke="#E5E7EA"
                />
                <YAxis
                  domain={[0, axisMax]}
                  ticks={yTicks}
                  hide
                  axisLine={false}
                  tickLine={false}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#175FE2"
                  strokeWidth={1}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartPlot>
        </ChartRow>

        <XAxisRow>
          {chart.map((point) => (
            <XTick key={point.date}>{point.date}</XTick>
          ))}
        </XAxisRow>
      </ChartSection>

      <StatusBanner $tone={status.tone}>
        <IconCircle $tone={status.tone}>
          <WarningTriangleIcon />
        </IconCircle>
        <StatusText $tone={status.tone}>{status.message}</StatusText>
      </StatusBanner>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  max-width: 530px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  gap: 24px;
  border: 1px solid #c3dffa;
  border-radius: 16px;
`;

const IconLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconSlot = styled(Image)`
  width: 54px;
  height: 54px;
  object-fit: contain;
`;

const LabelValueStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #1d2520;
`;

const Value = styled.span`
  font-family: var(--font-manrope), sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 34px;
  color: #1d2520;
`;

const MinMaxPill = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
`;

const MinMaxHalf = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 125px;
  height: 54px;
  padding: 0 16px;
`;

const MinHalf = styled(MinMaxHalf)`
  background: #eff5ff;
`;

const MaxHalf = styled(MinMaxHalf)`
  background: #dce9ff;
`;

const MinMaxLabel = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  color: #1d2520;
`;

const MinValue = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 16px;
  color: #4f8cf5;
`;

const MaxValue = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 16px;
  color: #1045a8;
`;

const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChartRow = styled.div`
  display: flex;
  align-items: stretch;
  height: 200px;
`;

const YAxisColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 13px;
  padding-right: 4px;
  border-right: 1px solid #d2d5db;
`;

const YTick = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 12px;
  color: #8b9c90;
`;

const ChartPlot = styled.div`
  flex: 1;
  min-width: 0;
`;

const XAxisRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  border-top: 1px solid #d2d5db;
`;

const XTick = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 12px;
  color: #8b9c90;
`;

const TONE_COLORS = {
  warning: { bg: "#FAC5C3", badge: "#EE443F", text: "#A9302D" },
  // Warna hijau estimasi placeholder — belum ada di spec Figma (cuma
  // varian warning yang tersedia), mirror bentuk pill merah.
  success: { bg: "#DCF2E3", badge: "#2FA360", text: "#1F7A45" },
} as const;

const StatusBanner = styled.div<{ $tone: "success" | "warning" }>`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;
  border-radius: 8px;
  background: ${(p) => TONE_COLORS[p.$tone].bg};
`;

const IconCircle = styled.div<{ $tone: "success" | "warning" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50px;
  background: ${(p) => TONE_COLORS[p.$tone].badge};
  flex-shrink: 0;
`;

const StatusText = styled.span<{ $tone: "success" | "warning" }>`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${(p) => TONE_COLORS[p.$tone].text};
`;
