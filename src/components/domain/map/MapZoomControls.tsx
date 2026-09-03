"use client";

import styled from "styled-components";
import { Plus, Minus } from "lucide-react";
import { useMap } from "react-leaflet";

/** Kontrol zoom custom (Figma) — menggantikan default Leaflet zoom control
 *  (`zoomControl={false}` di `MapContainer`). Wajib jadi child di dalam
 *  `MapContainer` karena `useMap()` cuma bisa dipanggil dari situ. */
export function MapZoomControls() {
  const map = useMap();

  return (
    <Wrapper>
      <Button type="button" aria-label="Perbesar peta" onClick={() => map.zoomIn()}>
        <Plus size={16} strokeWidth={2.5} color="#000000" />
      </Button>
      <Button type="button" aria-label="Perkecil peta" onClick={() => map.zoomOut()}>
        <Minus size={16} strokeWidth={2.5} color="#000000" />
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  left: 24px;
  bottom: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #e5e7ea;
  backdrop-filter: blur(41.5px);
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.85);
  }
`;
