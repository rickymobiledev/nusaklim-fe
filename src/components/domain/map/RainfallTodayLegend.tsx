"use client";

import styled from "styled-components";
import { RAINFALL_TODAY_COLOR, RAINFALL_TODAY_LABEL } from "@/lib/rainfall-today-level";

/** Legend mengambang bawah-tengah peta tab Curah Hujan Hari Ini — identik
 *  `DrySpellLegend`/`WaterDeficitLegend`: titik solid + cincin putih yang
 *  sama dengan marker peta (`getStationDotIcon`). Dulu pakai icon
 *  `RainIcon`/`SunIcon` (Figma), diganti titik supaya konsisten dengan
 *  marker; icon itu tetap dipakai di popup marker. */
export function RainfallTodayLegend() {
  return (
    <Wrapper>
      <Item>
        <LegendDot $color={RAINFALL_TODAY_COLOR.hujan} />
        <Label $color={RAINFALL_TODAY_COLOR.hujan}>{RAINFALL_TODAY_LABEL.hujan}</Label>
      </Item>
      <Item>
        <LegendDot $color={RAINFALL_TODAY_COLOR.tidak_hujan} />
        <Label $color={RAINFALL_TODAY_COLOR.tidak_hujan}>
          {RAINFALL_TODAY_LABEL.tidak_hujan}
        </Label>
      </Item>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  bottom: 38px;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #e5e7ea;
  backdrop-filter: blur(41.5px);
  border-radius: 12px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LegendDot = styled.span<{ $color: string }>`
  box-sizing: border-box;
  flex: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  border: 2px solid #ffffff;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.25),
    0 1px 4px rgba(0, 0, 0, 0.4);
`;

const Label = styled.span<{ $color: string }>`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: ${(p) => p.$color};
  white-space: nowrap;
`;
