"use client";

import styled from "styled-components";
import { DRY_SPELL_COLOR, DRY_SPELL_LABEL } from "@/lib/dry-spell-level";
import type { DrySpellLevel } from "@/types/domain";

// 3 chip warna sesuai Figma (<10/>10/>20 hari). Tidak ada level "tidak
// ada data" terpisah — array `dry_spell` kosong tetap masuk `rendah`
// (lihat `getDrySpellLevel`), jadi 3 level ini SUDAH cover semua kasus.
const LEVELS: DrySpellLevel[] = ["rendah", "sedang", "tinggi"];

/** Legend mengambang bawah-tengah peta tab Deret Terpanjang Hari Tidak
 *  Hujan — analog `WaterDeficitLegend.tsx`, cuma kategorinya beda
 *  (<10 Hari/>10 Hari/>20 Hari). Presentational murni, tidak butuh
 *  `useMap()`, dirender di luar `MapContainer`. */
export function DrySpellLegend() {
  return (
    <Wrapper>
      {LEVELS.map((level) => (
        <Item key={level}>
          <LegendDot $color={DRY_SPELL_COLOR[level]} />
          <Label $color={DRY_SPELL_COLOR[level]}>{DRY_SPELL_LABEL[level]}</Label>
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
