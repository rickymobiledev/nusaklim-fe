"use client";

import type { ReactNode } from "react";
import styled from "styled-components";
import { media } from "@/lib/breakpoints";

export function ForecastMetricCard({
  icon,
  label,
  value,
  unit,
  caption,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  /** Dipisah dari `value` supaya boleh turun baris di kartu sempit (mobile)
   *  alih-alih terpotong. */
  unit?: string;
  caption: string;
}) {
  return (
    <Card>
      <LabelRow>
        {icon}
        <Label>{label}</Label>
      </LabelRow>
      <Body>
        <ValueRow>
          <Value>{value}</Value>
          {unit && <Unit $tight={unit === "%"}>{unit}</Unit>}
        </ValueRow>
        <Caption>{caption}</Caption>
      </Body>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 0;
  padding: 16px;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 16px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    flex: none;
  }
`;

const Label = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #1d2520;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;

const ValueRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 4px;
`;

const Value = styled.span`
  font-family: var(--font-manrope), sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 30px;
  color: #1d2520;
  white-space: nowrap;

  ${media.desktop} {
    font-size: 28px;
    line-height: 34px;
  }
`;

const Unit = styled.span<{ $tight: boolean }>`
  margin-left: ${(p) => (p.$tight ? "-4px" : "0")};
  font-family: var(--font-manrope), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
  white-space: nowrap;

  ${media.desktop} {
    font-size: 28px;
    line-height: 34px;
  }
`;

const Caption = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #8b9c90;
`;
