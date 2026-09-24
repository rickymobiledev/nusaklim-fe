"use client";

import "leaflet/dist/leaflet.css";
import "@/components/domain/map/station-map.css";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import L, { type Map as LeafletMap, type PolylineOptions } from "leaflet";
import { MapContainer, GeoJSON, Marker, useMap } from "react-leaflet";
import { Maximize, Minimize } from "lucide-react";
import {
  INDONESIA_PROVINCE_BOUNDARIES,
  INDONESIA_PROVINCE_LABELS,
} from "@/lib/indonesia-provinces";
import { MapZoomControls } from "@/components/domain/map/MapZoomControls";
import { media } from "@/lib/breakpoints";

/**
 * Peta kecil halaman Ramalan Cuaca — GeoJSON 34 provinsi + satu marker
 * "glow dot" biru di koordinat stasiun terpilih. Sengaja file sendiri
 * (paralel dengan peta tab /map, bukan diekstrak) — konvensi proyek.
 * JANGAN tambahkan CSS `position` ke class `station-div-icon` (lihat ADR
 * di docs/ARCHITECTURE.md bagian 13).
 */

const DEFAULT_CENTER: [number, number] = [-2.5, 118];
const STATION_ZOOM = 7;
const PRIMARY = "#175FE2";

const PROVINCE_BOUNDARY_STYLE: PolylineOptions = {
  color: "#207E51",
  weight: 0.5,
  fillColor: "#AEE9CD",
  fillOpacity: 1,
  smoothFactor: 0,
};

const PROVINCE_LABEL_ICON_CACHE = new Map<string, L.DivIcon>();

function getProvinceLabelIcon(name: string): L.DivIcon {
  const cached = PROVINCE_LABEL_ICON_CACHE.get(name);
  if (cached) return cached;

  const icon = L.divIcon({
    className: "province-label-icon",
    html: `<span>${name}</span>`,
    iconSize: [0, 0],
  });
  PROVINCE_LABEL_ICON_CACHE.set(name, icon);
  return icon;
}

const STATION_ICON = L.divIcon({
  className: "station-div-icon",
  html: `
    <span style="position:absolute;inset:0;border-radius:50%;background:${PRIMARY};opacity:0.2"></span>
    <span style="position:absolute;left:6px;top:6px;right:6px;bottom:6px;border-radius:50%;background:${PRIMARY};opacity:0.5"></span>
    <span style="position:absolute;left:12px;top:12px;right:12px;bottom:12px;border-radius:50%;background:${PRIMARY}"></span>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

/** Terbang ke stasiun tiap koordinatnya berubah (ganti stasiun). */
function FlyToStation({ lat, long }: { lat: number; long: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, long], STATION_ZOOM, { duration: 0.8 });
  }, [map, lat, long]);
  return null;
}

export function ForecastMap({ lat, long }: { lat: number; long: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasPosition = Number.isFinite(lat) && Number.isFinite(long);
  const position: [number, number] = hasPosition ? [lat, long] : DEFAULT_CENTER;

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
      setTimeout(() => mapRef.current?.invalidateSize(), 50);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void wrapperRef.current?.requestFullscreen();
    }
  }, []);

  return (
    <Wrapper ref={wrapperRef} $fullscreen={isFullscreen}>
      <FullscreenButton
        type="button"
        title={isFullscreen ? "Keluar layar penuh" : "Perbesar layar penuh"}
        onClick={handleToggleFullscreen}
      >
        {isFullscreen ? (
          <Minimize size={20} strokeWidth={1.5} color="#6d717f" />
        ) : (
          <Maximize size={20} strokeWidth={1.5} color="#6d717f" />
        )}
      </FullscreenButton>

      <MapContainer
        ref={mapRef}
        center={position}
        zoom={hasPosition ? STATION_ZOOM : 5}
        minZoom={4}
        maxZoom={10}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: "#7BD4E9" }}
      >
        <GeoJSON
          data={INDONESIA_PROVINCE_BOUNDARIES}
          style={PROVINCE_BOUNDARY_STYLE}
          attribution='Batas wilayah &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, via <a href="https://www.geoboundaries.org">geoBoundaries.org</a> (ODbL)'
        />

        {INDONESIA_PROVINCE_LABELS.map((province) => (
          <Marker
            key={province.name}
            position={[province.lat, province.long]}
            icon={getProvinceLabelIcon(province.name)}
            interactive={false}
            keyboard={false}
          />
        ))}

        {hasPosition && <Marker position={position} icon={STATION_ICON} />}

        <FlyToStation lat={position[0]} long={position[1]} />
        <MapZoomControls />
      </MapContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $fullscreen: boolean }>`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: ${(p) => (p.$fullscreen ? "100vh" : "262px")};
  background: #7bd4e9;
  border: 1px solid #ecefed;
  border-radius: 20px;
  overflow: hidden;

  ${media.desktop} {
    height: ${(p) => (p.$fullscreen ? "100vh" : "100%")};
    min-height: 484px;
  }
`;

const FullscreenButton = styled.button`
  position: absolute;
  left: 24px;
  top: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(41.5px);
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.85);
  }
`;
