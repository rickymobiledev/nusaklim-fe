import type { LucideIcon } from "lucide-react";
import styled from "styled-components";
import { Card, CardContent } from "@/components/ui/card";
import type { WeatherMetricRange } from "@/types/domain";

function fmt(value: number | null, satuan: string) {
  return value === null ? "--" : `${value} ${satuan}`;
}

const Content = styled(CardContent)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* CardContent bawaan pakai "pt-0" (nempel ke CardHeader) — di sini
     dipakai berdiri sendiri tanpa header, jadi padding-top dikembalikan
     penuh (disusun dari theme.spacing.md + xs supaya persis 1.25rem,
     setara Tailwind p-5, tanpa nilai lepas baru). */
  padding-top: calc(${(p) => p.theme.spacing.md} + ${(p) => p.theme.spacing.xs});
`;

const Label = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.neutral[900]};
`;

const Value = styled.p`
  margin-top: ${(p) => p.theme.spacing.xs};
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
`;

const RangeRow = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing.md};
  margin-top: ${(p) => p.theme.spacing.sm};
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.neutral[500]};
`;

const RangeValue = styled.span`
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
`;

const StyledIcon = styled.div`
  color: ${(p) => p.theme.colors.primary[300]};

  svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

export function MetricCard({
  icon: Icon,
  label,
  data,
}: {
  icon: LucideIcon;
  label: string;
  data: WeatherMetricRange;
}) {
  return (
    <Card>
      <Content>
        <div>
          <Label>{label}</Label>
          <Value>{fmt(data.nilai, data.satuan)}</Value>
          <RangeRow>
            <span>
              Min <RangeValue>{fmt(data.min, data.satuan)}</RangeValue>
            </span>
            <span>
              Maks <RangeValue>{fmt(data.maks, data.satuan)}</RangeValue>
            </span>
          </RangeRow>
        </div>
        <StyledIcon>
          <Icon />
        </StyledIcon>
      </Content>
    </Card>
  );
}
