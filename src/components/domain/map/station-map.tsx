"use client";

import "leaflet/dist/leaflet.css";
import "./station-map.css";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import L, {
  type Map as LeafletMap,
  type Marker as LeafletMarker,
  type PolylineOptions,
} from "leaflet";
import { MapContainer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import { Info } from "lucide-react";
import type { Station } from "@/types/domain";
import { mapDeviceStatus, STATION_STATUS_BADGE } from "@/lib/status";
import {
  INDONESIA_PROVINCE_BOUNDARIES,
  INDONESIA_PROVINCE_LABELS,
} from "@/lib/indonesia-provinces";
import { buildStationsCsv } from "@/lib/map-utils";
import { downloadCsvFile } from "@/lib/air-pressure-chart-utils";
import { MapToolbar } from "./MapToolbar";
import { MapZoomControls } from "./MapZoomControls";
import { MapLegend } from "./MapLegend";

/**
 * Peta pakai react-leaflet + GeoJSON 34 provinsi (`lib/indonesia-provinces.ts`,
 * di-derive dari geoBoundaries.org/OpenStreetMap, di-simplify pakai mapshaper
 * jadi ~200KB) — BUKAN tile raster OSM lagi. Keputusan ganti tile ini
 * disengaja (dikonfirmasi user): tile raster OSM/CartoDB tidak bisa di-style
 * jadi ilustrasi flat solid seperti Figma (warnanya "dipanggang" di gambar
 * tile), jadi diganti polygon GeoJSON yang bisa di-fill warna custom. Karena
 * tiap provinsi feature terpisah (bukan satu outline nasional), stroke
 * `<GeoJSON>` otomatis jadi garis batas antar-provinsi juga — bukan cuma
 * garis pantai. Attribution ODbL WAJIB tetap tampil (lihat prop
 * `attribution` di bawah), jangan dihapus.
 */

const DIV_ICON_CACHE = new Map<string, L.DivIcon>();
const PROVINCE_LABEL_ICON_CACHE = new Map<string, L.DivIcon>();

/** `smoothFactor` cuma dideklarasikan di `PolylineOptions` (bukan `PathOptions`
 *  generik yang dipakai tipe prop `style` react-leaflet `<GeoJSON>`), padahal
 *  Polygon tetap mewarisi & menghormatinya saat render — jadi di-tipekan
 *  eksplisit di sini, bukan inline, supaya lolos type-check tanpa `as any`. */
const PROVINCE_BOUNDARY_STYLE: PolylineOptions = {
  color: "#207E51",
  weight: 0.5,
  fillColor: "#AEE9CD",
  fillOpacity: 1,
  // Default Leaflet (1) nyederhanain render garis pantai di zoom rendah demi
  // performa — bikin marker yang sebenarnya persis di pantai/darat kelihatan
  // "di laut" sampai di-zoom in. Data kita sudah ringan (~200KB, disimplify
  // sekali via mapshaper) jadi render presisi (0) di semua zoom tidak masalah
  // performa.
  smoothFactor: 0,
};

/** Marker "glow dot" 3 lingkaran nested meniru Figma (12px/20% opacity,
 *  8px/50% opacity, 4px solid) — Leaflet `divIcon` cuma terima HTML string,
 *  bukan JSX, jadi tidak bisa dibuat styled-components biasa. */
function getStationDivIcon(color: string): L.DivIcon {
  const cached = DIV_ICON_CACHE.get(color);
  if (cached) return cached;

  const icon = L.divIcon({
    className: "station-div-icon",
    html: `
      <span style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.2"></span>
      <span style="position:absolute;left:2px;top:2px;right:2px;bottom:2px;border-radius:50%;background:${color};opacity:0.5"></span>
      <span style="position:absolute;left:4px;top:4px;right:4px;bottom:4px;border-radius:50%;background:${color}"></span>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6],
  });
  DIV_ICON_CACHE.set(color, icon);
  return icon;
}

/** Label teks nama provinsi (bukan marker stasiun) — non-interactive, cuma
 *  teks dengan outline putih tipis biar kebaca di atas fill hijau pulau.
 *  Style-nya di `station-map.css` (class `.province-label-icon`) karena sama
 *  seperti `getStationDivIcon`, ini HTML string mentah Leaflet, bukan JSX. */
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

/** Child di dalam `MapContainer` (butuh `useMap()`) yang menerbangkan peta
 *  ke stasiun terpilih & buka popup-nya — dipicu dari klik item di panel
 *  kanan "Daftar Stasiun" (`MapStationList`), bukan dari klik marker
 *  langsung (itu sudah ditangani `eventHandlers.click` tiap `Marker`). */
function MapController({
  selectedStationId,
  stations,
  markersRef,
}: {
  selectedStationId: string | null;
  stations: Station[];
  markersRef: RefObject<Record<string, LeafletMarker | null>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedStationId) return;
    const station = stations.find((s) => s.id === selectedStationId);
    if (!station) return;

    const position: L.LatLngExpression = [station.lat, station.long];

    // Marker yang diklik langsung di peta SUDAH kelihatan di layar — flyTo
    // di sini bikin peta ikut animasi zoom/pan ulang tanpa perlu (kelihatan
    // seperti titiknya "geser" sesaat). Cuma terbang kalau stasiunnya
    // memang belum kelihatan penuh atau peta masih zoom out jauh (kasus
    // klik dari panel kanan "Daftar Stasiun", yang stasiunnya bisa saja
    // di luar viewport saat ini).
    const alreadyVisible = map.getBounds().contains(position) && map.getZoom() >= 6;
    if (!alreadyVisible) {
      map.flyTo(position, Math.max(map.getZoom(), 6), { duration: 0.75 });
    }

    markersRef.current[selectedStationId]?.openPopup();
  }, [selectedStationId, stations, map, markersRef]);

  return null;
}

export function StationMap({
  stations,
  selectedStationId = null,
  onSelectStation,
}: {
  stations: Station[];
  selectedStationId?: string | null;
  onSelectStation?: (id: string) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, LeafletMarker | null>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === wrapperRef.current);
      // Ukuran container berubah drastis saat masuk/keluar fullscreen — Leaflet
      // tidak auto-detect ini lewat ResizeObserver, harus dipaksa recalculate.
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

  const handlePrint = useCallback(() => window.print(), []);

  const handleDownload = useCallback(() => {
    downloadCsvFile(
      `daftar-stasiun_${format(new Date(), "yyyy-MM-dd")}.csv`,
      buildStationsCsv(stations),
    );
  }, [stations]);

  return (
    <Wrapper ref={wrapperRef} $fullscreen={isFullscreen}>
      <MapToolbar
        isFullscreen={isFullscreen}
        onPrint={handlePrint}
        onToggleFullscreen={handleToggleFullscreen}
        onDownload={handleDownload}
      />

      <MapContainer
        ref={mapRef}
        center={[-2.5, 118]}
        zoom={5}
        minZoom={4}
        maxZoom={10}
        scrollWheelZoom
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

        {stations.map((station) => {
          const statusInfo = STATION_STATUS_BADGE[mapDeviceStatus(station.status)];
          return (
            <Marker
              key={station.id}
              position={[station.lat, station.long]}
              icon={getStationDivIcon(statusInfo.color)}
              ref={(marker) => {
                markersRef.current[station.id] = marker;
              }}
              eventHandlers={{ click: () => onSelectStation?.(station.id) }}
            >
              <Popup className="map-popup" closeButton={false}>
                <PopupContent>
                  <PopupHeader>
                    <PopupName>{station.nama}</PopupName>
                    <PopupBadge $color={statusInfo.color}>{statusInfo.label}</PopupBadge>
                  </PopupHeader>

                  <PopupRow>
                    <PopupLabel>Kode</PopupLabel>
                    <PopupValue>{station.id}</PopupValue>
                  </PopupRow>
                  <PopupRow>
                    <PopupLabel>Brand</PopupLabel>
                    <PopupValue>{station.brand}</PopupValue>
                  </PopupRow>
                  <PopupRow>
                    <PopupLabel>Latitude</PopupLabel>
                    <PopupValue>{station.lat}</PopupValue>
                  </PopupRow>
                  <PopupRow>
                    <PopupLabel>Longitude</PopupLabel>
                    <PopupValue>{station.long}</PopupValue>
                  </PopupRow>

                  <PopupSync>
                    <Info size={20} strokeWidth={1.5} color="#ffffff" />
                    <span>
                      {station.sinkronisasiTerakhir
                        ? `Sinkronisasi Terakhir ${format(
                            new Date(station.sinkronisasiTerakhir),
                            "dd MMM yyyy, HH:mm",
                            { locale: idLocale },
                          )}`
                        : "Belum pernah sinkron"}
                    </span>
                  </PopupSync>
                </PopupContent>
              </Popup>
            </Marker>
          );
        })}

        <MapZoomControls />
        <MapController
          selectedStationId={selectedStationId}
          stations={stations}
          markersRef={markersRef}
        />
      </MapContainer>

      <MapLegend />
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $fullscreen: boolean }>`
  position: relative;
  width: 100%;
  height: ${(p) => (p.$fullscreen ? "100vh" : "560px")};
  background: #7bd4e9;
  border: 1px solid #ecefed;
  border-radius: 20px;
  overflow: hidden;
`;

const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 202px;
`;

const PopupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const PopupName = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
`;

const PopupRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const PopupLabel = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
`;

const PopupValue = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
`;

/** Badge solid warna status (bukan `StatusBadge` shared yang bg-terang/
 *  teks-gelap) — popup peta pakai gaya sendiri persis Figma: bg solid warna
 *  status (sama seperti dot marker), teks putih, pill kecil. */
const PopupBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  background: ${(p) => p.$color};
  border-radius: 100px;
  color: #ffffff;
  font-family: var(--font-body), sans-serif;
  font-size: 10px;
  line-height: 12px;
  white-space: nowrap;
`;

const PopupSync = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.18);
  border: 1.5px solid #ffffff;
  border-radius: 12px;
  font-family: var(--font-caption), sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  color: #ffffff;

  svg {
    flex: none;
  }
`;
