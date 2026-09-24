"use client";

import type { ReactNode } from "react";
import styled from "styled-components";

export function ForecastMetricCard({
  icon,
  label,
  value,
  caption,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <Card>
      <LabelRow>
        {icon}
        <Label>{label}</Label>
      </LabelRow>
      <Body>
        <Value>{value}</Value>
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

const Value = styled.span`
  font-family: var(--font-manrope), sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 34px;
  color: #1d2520;
  white-space: nowrap;
`;

const Caption = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #8b9c90;
`;
