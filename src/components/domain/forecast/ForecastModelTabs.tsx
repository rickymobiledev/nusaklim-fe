"use client";

import styled from "styled-components";
import { media } from "@/lib/breakpoints";
import { FORECAST_MODELS, type ForecastModel } from "@/types/forecast";

/** Tab model ramalan (Primer/Sekunder) — gaya pill sama dengan `MapTabs.tsx`
 *  (Sebaran Spasial). Cuma label — catatan model tampil di bawah grafik
 *  (`ForecastSection.tsx`). */
export function ForecastModelTabs({
  active,
  onChange,
}: {
  active: ForecastModel;
  onChange: (model: ForecastModel) => void;
}) {
  return (
    <Row role="tablist" aria-label="Model ramalan cuaca">
      {FORECAST_MODELS.map((model) => (
        <Pill
          key={model.id}
          type="button"
          role="tab"
          aria-selected={active === model.id}
          $active={active === model.id}
          onClick={() => onChange(model.id)}
        >
          {model.label}
        </Pill>
      ))}
    </Row>
  );
}

/* Mobile: tab ditumpuk ke bawah, lebar penuh; desktop: sejajar horizontal. */
const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: 100%;

  ${media.desktop} {
    flex-direction: row;
    width: auto;
  }
`;

const Pill = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  padding: 0 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  background: ${(p) => (p.$active ? "#175FE2" : "#ffffff")};
  color: ${(p) => (p.$active ? "#ffffff" : "#175FE2")};
  transition:
    background-color 0.15s,
    color 0.15s;

  ${media.desktop} {
    flex: none;
    width: auto;
  }
`;
