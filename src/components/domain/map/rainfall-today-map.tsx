"use client";

import "leaflet/dist/leaflet.css";
import "./station-map.css";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import L, { type Map as LeafletMap, type PolylineOptions } from "leaflet";
import { MapContainer, GeoJSON, Marker, Popup } from "react-leaflet";
import { Info } from "lucide-react";
import { RainIcon, SunIcon } from "@/components/shared/RainfallIcons";
import type { StationRainfallToday } from "@/types/domain";
import { getRainfallTodayLevel, RAINFALL_TODAY_COLOR } from "@/lib/rainfall-today-level";
import {
  INDONESIA_PROVINCE_BOUNDARIES,
  INDONESIA_PROVINCE_LABELS,
} from "@/lib/indonesia-provinces";
import { buildRainfallTodayCsv } from "@/lib/map-utils";
import { getStationDotIcon } from "@/lib/map-marker-icon";
import { downloadCsvFile } from "@/lib/air-pressure-chart-utils";
import { MapToolbar } from "./MapToolbar";
import { MapZoomControls } from "./MapZoomControls";
import { RainfallTodayLegend } from "./RainfallTodayLegend";

/**
 * Peta tab Curah Hujan Hari Ini — struktur paralel dengan
 * `dry-spell-map.tsx`/`water-deficit-map.tsx`: GeoJSON 34 provinsi +
 * toolbar cetak/fullscreen/unduh + zoom control diduplikasi & diadaptasi
 * di sini (bukan diekstrak jadi komponen dasar bersama), konsisten pola
 * tab Peta lain. BEDA dari 2 tab itu: TIDAK ada floating Gauge (metrik
 * di sini boolean `is_rain`, bukan skala kontinu yang butuh
 * min-max bar), dan popup cuma tampilkan icon+status teks (bukan angka
 * mm) — ikut Figma persis.
 */

const PROVINCE_LABEL_ICON_CACHE = new Map<string, L.DivIcon>();

const PROVINCE_BOUNDARY_STYLE: PolylineOptions = {
  color: "#207E51",
  weight: 0.5,
  fillColor: "#AEE9CD",
  fillOpacity: 1,
  smoothFactor: 0,
};

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

export function RainfallTodayMap({ rows }: { rows: StationRainfallToday[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const handlePrint = useCallback(() => window.print(), []);

  const handleDownload = useCallback(() => {
    downloadCsvFile(
      `curah-hujan-hari-ini_${format(new Date(), "yyyy-MM-dd")}.csv`,
      buildRainfallTodayCsv(rows),
    );
  }, [rows]);

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

        {rows.map((row) => {
          const level = getRainfallTodayLevel(row.isHujan);
          const color = RAINFALL_TODAY_COLOR[level];

          return (
            <Marker
              key={row.stationId}
              position={[row.lat, row.long]}
              icon={getStationDotIcon(color)}
            >
              <Popup className="map-popup" closeButton={false}>
                <PopupContent>
                  <PopupName>{row.nama}</PopupName>

                  <PopupStatus>
                    {row.isHujan ? (
                      <RainIcon size={16} color="#ffffff" />
                    ) : (
                      <SunIcon size={16} color="#ffffff" />
                    )}
                    <span>{row.isHujan ? "Terjadi Hujan" : "Tidak Terjadi Hujan"}</span>
                  </PopupStatus>

                  <PopupSync>
                    <Info size={20} strokeWidth={1.5} color="#ffffff" />
                    <span>
                      {row.sinkronisasiTerakhir
                        ? `Sinkronisasi Terakhir ${format(
                            new Date(row.sinkronisasiTerakhir),
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
      </MapContainer>

      <RainfallTodayLegend />
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
  width: 166px;
`;

const PopupName = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
`;

const PopupStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;

  svg {
    flex: none;
  }
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
