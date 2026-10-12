"use client";

import styled from "styled-components";
import { WATER_DEFICIT_COLOR, WATER_DEFICIT_LABEL } from "@/lib/water-deficit-level";
import type { WaterDeficitLevel } from "@/types/domain";

const LEVELS: WaterDeficitLevel[] = ["tidak_ada", "rendah", "tinggi"];

/** Legend mengambang bawah-tengah peta tab Keseimbangan Air — analog
 *  `MapLegend.tsx` (Status Stasiun), cuma kategorinya beda (Tidak Ada/
 *  <200mm/>200mm, bukan Aktif/Tidak Aktif). Presentational murni, tidak
 *  butuh `useMap()`, dirender di luar `MapContainer`. */
export function WaterDeficitLegend() {
  return (
    <Wrapper>
      {LEVELS.map((level) => (
        <Item key={level}>
          <LegendDot $color={WATER_DEFICIT_COLOR[level]} />
          <Label $color={WATER_DEFICIT_COLOR[level]}>{WATER_DEFICIT_LABEL[level]}</Label>
        </Item>
      ))}
    </Wrapper>
  );
}

/** Titik legend — inti solid + cincin putih + bayangan, sama gayanya dengan
 *  marker peta (`getStationDotIcon` di `lib/map-marker-icon.ts`). */

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
