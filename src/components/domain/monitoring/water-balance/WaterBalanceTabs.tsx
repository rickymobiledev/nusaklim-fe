"use client";

import styled from "styled-components";
import type { WaterBalanceMetric } from "@/types/domain";

const TABS: { key: WaterBalanceMetric; label: string }[] = [
  { key: "waterDeficit", label: "Defisit Air" },
  { key: "rainfall", label: "Curah Hujan" },
  { key: "rainyDays", label: "Hari Hujan" },
  { key: "waterSurplus", label: "Kelebihan Air" },
];

export function WaterBalanceTabs({
  active,
  onChange,
}: {
  active: WaterBalanceMetric;
  onChange: (metric: WaterBalanceMetric) => void;
}) {
  return (
    <Row>
      {TABS.map((tab) => (
        <TabButton
          key={tab.key}
          type="button"
          $active={tab.key === active}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </TabButton>
      ))}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;

  background: ${(p) => (p.$active ? "#175fe2" : "#ffffff")};
  color: ${(p) => (p.$active ? "#ffffff" : "#175fe2")};

  &:hover {
    background: ${(p) => (p.$active ? "#175fe2" : "#f6f8f7")};
  }
`;
