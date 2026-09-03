"use client";

import styled from "styled-components";

export type MapTab =
  "status-stasiun" | "keseimbangan-air" | "dry-spell" | "curah-hujan-hari-ini";

const TABS: { id: MapTab; label: string }[] = [
  { id: "status-stasiun", label: "Status Stasiun" },
  { id: "keseimbangan-air", label: "Keseimbangan Air" },
  { id: "dry-spell", label: "Deret Terpanjang Hari Tidak Hujan" },
  { id: "curah-hujan-hari-ini", label: "Curah Hujan Hari Ini" },
];

export function MapTabs({
  active,
  onChange,
}: {
  active: MapTab;
  onChange: (tab: MapTab) => void;
}) {
  return (
    <Row role="tablist" aria-label="Tampilan Peta">
      {TABS.map((tab) => (
        <Pill
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          $active={active === tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </Pill>
      ))}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  overflow-x: auto;
`;

const Pill = styled.button<{ $active: boolean }>`
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 12px 20px;
  white-space: nowrap;
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
`;
