"use client";

import styled from "styled-components";
import { RainIcon, SunIcon } from "@/components/shared/RainfallIcons";
import { RAINFALL_TODAY_COLOR, RAINFALL_TODAY_LABEL } from "@/lib/rainfall-today-level";

/** Legend mengambang bawah-tengah peta tab Curah Hujan Hari Ini — posisi
 *  identik `DrySpellLegend`/`WaterDeficitLegend`, TAPI gaya beda: Figma
 *  eksplisit gambar icon hujan/matahari di sini (bukan "glow dot" 3
 *  lingkaran nested yang dipakai legend lain), jadi diikuti apa adanya.
 *  Icon `RainIcon`/`SunIcon` dari `RainfallIcons.tsx` — SVG custom
 *  langsung dari Figma, bukan `CloudRain`/`Sun` bawaan lucide-react. */
export function RainfallTodayLegend() {
  return (
    <Wrapper>
      <Item>
        <RainIcon size={16} color={RAINFALL_TODAY_COLOR.hujan} />
        <Label $color={RAINFALL_TODAY_COLOR.hujan}>{RAINFALL_TODAY_LABEL.hujan}</Label>
      </Item>
      <Item>
        <SunIcon size={16} color={RAINFALL_TODAY_COLOR.tidak_hujan} />
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

  svg {
    flex: none;
  }
`;

const Label = styled.span<{ $color: string }>`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: ${(p) => p.$color};
  white-space: nowrap;
`;
