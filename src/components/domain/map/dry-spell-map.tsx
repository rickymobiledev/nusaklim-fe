"use client";

import "leaflet/dist/leaflet.css";
import "./station-map.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import L, { type Map as LeafletMap, type PolylineOptions } from "leaflet";
import { MapContainer, GeoJSON, Marker, Popup } from "react-leaflet";
import { Info } from "lucide-react";
import type { StationDrySpell } from "@/types/domain";
import {
  getDrySpellLevel,
  DRY_SPELL_COLOR,
  DRY_SPELL_LABEL,
} from "@/lib/dry-spell-level";
import {
  INDONESIA_PROVINCE_BOUNDARIES,
  INDONESIA_PROVINCE_LABELS,
} from "@/lib/indonesia-provinces";
import { buildDrySpellCsv } from "@/lib/map-utils";
import { downloadCsvFile } from "@/lib/air-pressure-chart-utils";
import { MapToolbar } from "./MapToolbar";
import { MapZoomControls } from "./MapZoomControls";
import { DrySpellLegend } from "./DrySpellLegend";

/**
 * Peta tab Deret Terpanjang Hari Tidak Hujan — struktur paralel dengan
 * `water-deficit-map.tsx`: GeoJSON 34 provinsi + toolbar cetak/
 * fullscreen/unduh + zoom control diduplikasi & diadaptasi di sini
 * (bukan diekstrak jadi komponen dasar bersama), konsisten pola tab Peta
 * lain. Beda dari Water Deficit: marker/popup mewarnai berdasar level
 * durasi deret hari tidak hujan (bukan defisit air), popup cuma 1 baris
 * metrik (Durasi), dan gauge floating diberi label "Hari Tidak Hujan
 * Hari Ini" — bukan "Curah Hujan Hari Ini" seperti di mockup Figma, yang
 * teksnya adalah sisa copy-paste dari judul tab lain (tidak relevan
 * dengan isi gauge ini yang menampilkan rentang durasi hari, bukan curah
 * hujan).
 */

const DIV_ICON_CACHE = new Map<string, L.DivIcon>();
const PROVINCE_LABEL_ICON_CACHE = new Map<string, L.DivIcon>();

const PROVINCE_BOUNDARY_STYLE: PolylineOptions = {
  color: "#207E51",
  weight: 0.5,
  fillColor: "#AEE9CD",
  fillOpacity: 1,
  smoothFactor: 0,
};

/** Marker "glow dot" 3 lingkaran nested — identik pola `getStationDivIcon`
 *  di `station-map.tsx`, cuma warnanya dari level durasi deret hari tidak
 *  hujan. JANGAN tambahkan CSS `position` ke class `station-div-icon`
 *  manapun (lihat ADR di docs/ARCHITECTURE.md bagian 13). Reuse class
 *  yang sama dengan Status Stasiun/Water Deficit karena stylingnya
 *  memang identik, cuma warna HTML string-nya beda per pemanggilan. */
function getDrySpellDivIcon(color: string): L.DivIcon {
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

/** Floating box kanan-bawah "Hari Tidak Hujan Hari Ini" — gradient bar
 *  dari 0 (baseline) sampai durasi deret hari tidak hujan terpanjang di
 *  semua stasiun tahun ini, pola sama persis `WaterDeficitGauge`. */
function DrySpellGauge({ maxValue }: { maxValue: number }) {
  return (
    <GaugeWrapper>
      <GaugeHeader>
        <GaugeLabel>Hari Tidak Hujan Hari Ini</GaugeLabel>
        <Info size={14} strokeWidth={1.5} color="#8b9c90" />
      </GaugeHeader>
      <GaugeBar>
        <GaugeValue $color="#000000">0</GaugeValue>
        <GaugeValue $color="#ffffff">{maxValue}</GaugeValue>
      </GaugeBar>
    </GaugeWrapper>
  );
}

export function DrySpellMap({ rows }: { rows: StationDrySpell[] }) {
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
      `deret-hari-tidak-hujan_${format(new Date(), "yyyy-MM-dd")}.csv`,
      buildDrySpellCsv(rows),
    );
  }, [rows]);

  const maxDurasi = useMemo(() => {
    const values = rows
      .map((r) => r.durasiTerakhir)
      .filter((v): v is number => v !== null);
    return values.length > 0 ? Math.max(...values) : 0;
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
          const level = getDrySpellLevel(row.durasiTerakhir);
          const color = DRY_SPELL_COLOR[level];

          return (
            <Marker
              key={row.stationId}
              position={[row.lat, row.long]}
              icon={getDrySpellDivIcon(color)}
            >
              <Popup className="map-popup" closeButton={false}>
                <PopupContent>
                  <PopupName>{row.nama}</PopupName>

                  <PopupRow>
                    <PopupLabel>Durasi</PopupLabel>
                    <PopupValue>
                      {row.durasiTerakhir !== null
                        ? `${row.durasiTerakhir} Hari`
                        : DRY_SPELL_LABEL.rendah}
                    </PopupValue>
                  </PopupRow>

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

      <DrySpellGauge maxValue={maxDurasi} />
      <DrySpellLegend />
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

const GaugeWrapper = styled.div`
  position: absolute;
  right: 25px;
  bottom: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 175px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #e5e7ea;
  backdrop-filter: blur(41.5px);
  border-radius: 12px;
`;

const GaugeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const GaugeLabel = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #1d2520;
`;

const GaugeBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background: linear-gradient(90deg, #dce9ff 0%, #8db5ff 100%);
  border-radius: 50px;
`;

const GaugeValue = styled.span<{ $color: string }>`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => p.$color};
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
