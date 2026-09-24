"use client";

import styled from "styled-components";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FORECAST_PARAMETERS,
  getParameterUnit,
  type ForecastParameter,
} from "@/lib/forecast-display";
import { media } from "@/lib/breakpoints";
import type { ForecastDay } from "@/types/forecast";

/** Lebar minimum per titik tanggal — chart bisa di-scroll horizontal di
 *  layar sempit (pola sama chart halaman detail cuaca). BELUM final. */
const CHART_MIN_WIDTH_PER_POINT = 80;

/** Parameter yang berbaseline 0 (curah hujan/radiasi/angin); sisanya
 *  berkisar sempit di sekitar nilai tertentu, jadi sumbu Y diberi padding. */
const ZERO_BASED: ForecastParameter[] = ["rainfall", "radiation", "windSpeed"];

interface TooltipEntry {
  value?: number | string | null;
  payload?: { label?: string };
}

export function ForecastTrendChart({
  days,
  units,
  stationName,
  parameter,
  onParameterChange,
}: {
  days: ForecastDay[];
  units: Record<string, string>;
  stationName: string;
  parameter: ForecastParameter;
  onParameterChange: (parameter: ForecastParameter) => void;
}) {
  const meta = FORECAST_PARAMETERS.find((p) => p.value === parameter)!;
  const unit = getParameterUnit(parameter, units);
  const rows = days.map((day) => ({
    label: format(new Date(day.date), "dd MMM yyyy", { locale: id }),
    value: day[parameter],
  }));

  return (
    <Card>
      <Head>
        <HeadText>
          <Title>Tren Prediksi</Title>
          <Subtitle>Grafik prediksi paramter cuaca harian untuk 7 hari ke depan</Subtitle>
        </HeadText>

        <Field>
          <FieldLabel htmlFor="forecast-parameter">Parameter</FieldLabel>
          <Select
            value={parameter}
            onValueChange={(value) => onParameterChange(value as ForecastParameter)}
          >
            <ParameterTrigger id="forecast-parameter" aria-label="Pilih Parameter">
              <SelectValue />
            </ParameterTrigger>
            <SelectContent>
              {FORECAST_PARAMETERS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Head>

      <ChartScroll>
        <ChartInner $minWidth={rows.length * CHART_MIN_WIDTH_PER_POINT}>
          <ResponsiveContainer width="100%" height={352}>
            <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EA" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#6D717F" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6D717F" }}
                tickLine={false}
                domain={
                  ZERO_BASED.includes(parameter)
                    ? [0, "auto"]
                    : ["dataMin - 2", "dataMax + 2"]
                }
                tickFormatter={(value: number) => value.toLocaleString("id-ID")}
                label={{
                  value: `${meta.axisLabel} (${unit})`,
                  angle: -90,
                  position: "insideLeft",
                  offset: 8,
                  style: { fontSize: 12, fill: "#667A6C", textAnchor: "middle" },
                }}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    stationName={stationName}
                    label={meta.label}
                    unit={unit}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0039FF"
                strokeWidth={1}
                dot={false}
                activeDot={{ r: 4, fill: "#ffffff", stroke: "#0039FF" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartInner>
      </ChartScroll>
    </Card>
  );
}

function ChartTooltip({
  active,
  payload,
  stationName,
  label,
  unit,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  stationName: string;
  label: string;
  unit: string;
}) {
  const entry = payload?.[0];
  if (!active || !entry || entry.value === null || entry.value === undefined) return null;

  return (
    <TooltipBox>
      <TooltipStation>{stationName}</TooltipStation>
      <TooltipInner>
        <TooltipDate>{entry.payload?.label}</TooltipDate>
        <TooltipRow>
          <TooltipBar />
          <div>
            <TooltipMetric>{label}</TooltipMetric>
            <TooltipValue>
              {Number(entry.value).toLocaleString("id-ID", { maximumFractionDigits: 1 })}
              {unit}
            </TooltipValue>
          </div>
        </TooltipRow>
      </TooltipInner>
    </TooltipBox>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  gap: 16px;
  background: #ffffff;
  border: 1px solid #e5e7ea;
  border-radius: 12px;
`;

const Head = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${media.desktop} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const HeadText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Title = styled.h2`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
`;

const Subtitle = styled.p`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #667a6c;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;

  ${media.desktop} {
    flex-direction: row;
    align-items: center;
  }
`;

const FieldLabel = styled.label`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #1d2520;
`;

const ParameterTrigger = styled(SelectTrigger)`
  width: 100%;
  height: 48px;
  padding: 12px;
  background: #ffffff;
  border: 1.5px solid #d6dcd8;
  border-radius: 12px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #1d2520;

  ${media.desktop} {
    width: 291px;
  }

  & svg {
    color: #8b9c90;
  }
`;

const ChartScroll = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const ChartInner = styled.div<{ $minWidth: number }>`
  min-width: ${(p) => p.$minWidth}px;
`;

const TooltipBox = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 135px;
  padding: 8px;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e5e7ea;
  border-radius: 12px;
  box-shadow: 4px 4px 15.5px rgba(0, 0, 0, 0.15);
`;

const TooltipStation = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #000000;
`;

const TooltipInner = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 8px;
  gap: 4px;
  border: 1px solid #d6dcd8;
  border-radius: 4px;
`;

const TooltipDate = styled.span`
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #8b9c90;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 4px;
`;

const TooltipBar = styled.span`
  flex: none;
  width: 5px;
  background: #0139fe;
  border-radius: 50px;
`;

const TooltipMetric = styled.div`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #1d2520;
`;

const TooltipValue = styled.div`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #0039ff;
`;
