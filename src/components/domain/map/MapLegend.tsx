"use client";

import styled from "styled-components";

/** Legend mengambang bawah-tengah peta — presentational murni, tidak butuh
 *  `useMap()`, jadi sengaja dirender di luar `MapContainer` (sibling di
 *  wrapper) supaya tidak perlu ikut lifecycle Leaflet. */
export function MapLegend() {
  return (
    <Wrapper>
      <Item>
        <GlowDot $color="#43B75D" />
        <Label $color="#43B75D">Stasiun Aktif</Label>
      </Item>
      <Item>
        <GlowDot $color="#EE443F" />
        <Label $color="#EE443F">Stasiun Tidak Aktif</Label>
      </Item>
    </Wrapper>
  );
}

/** Titik 3 lingkaran nested (glow) — sama gayanya seperti marker stasiun di
 *  peta (`getStationDivIcon` di `station-map.tsx`), cuma di sini boleh JSX
 *  styled-components biasa (bukan HTML string mentah Leaflet `divIcon`).
 *  Ukuran & opacity ikut spec Figma legend (beda dikit dari marker peta:
 *  16px/~11px/~5px, bukan 12px/8px/4px). */
function GlowDot({ $color }: { $color: string }) {
  return (
    <DotWrapper>
      <DotLayer $color={$color} $size={16} $opacity={0.26} />
      <DotLayer $color={$color} $size={11} $opacity={0.5} />
      <DotLayer $color={$color} $size={5} $opacity={1} />
    </DotWrapper>
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

const DotWrapper = styled.span`
  position: relative;
  width: 16px;
  height: 16px;
  flex: none;
`;

const DotLayer = styled.span<{ $color: string; $size: number; $opacity: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  opacity: ${(p) => p.$opacity};
  transform: translate(-50%, -50%);
`;

const Label = styled.span<{ $color: string }>`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: ${(p) => p.$color};
  white-space: nowrap;
`;
