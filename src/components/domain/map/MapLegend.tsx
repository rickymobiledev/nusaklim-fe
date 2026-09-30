"use client";

import styled from "styled-components";

/** Legend mengambang bawah-tengah peta — presentational murni, tidak butuh
 *  `useMap()`, jadi sengaja dirender di luar `MapContainer` (sibling di
 *  wrapper) supaya tidak perlu ikut lifecycle Leaflet. */
export function MapLegend() {
  return (
    <Wrapper>
      <Item>
        <LegendDot $color="#43B75D" />
        <Label $color="#43B75D">Stasiun Aktif</Label>
      </Item>
      <Item>
        <LegendDot $color="#EE443F" />
        <Label $color="#EE443F">Stasiun Tidak Aktif</Label>
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

/* Titik legend — inti solid + cincin putih + bayangan, sama gayanya dengan
 * marker stasiun di peta (`getStationDotIcon` di `lib/map-marker-icon.ts`). */
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
