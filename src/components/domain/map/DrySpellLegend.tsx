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
          <GlowDot $color={DRY_SPELL_COLOR[level]} />
          <Label $color={DRY_SPELL_COLOR[level]}>{DRY_SPELL_LABEL[level]}</Label>
        </Item>
      ))}
    </Wrapper>
  );
}

function GlowDot({ $color }: { $color: string }) {
  return (
    <DotWrapper>
      <DotLayer $color={$color} $size={16} $opacity={0.2} />
      <DotLayer $color={$color} $size={8} $opacity={0.5} />
      <DotLayer $color={$color} $size={4} $opacity={1} />
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
