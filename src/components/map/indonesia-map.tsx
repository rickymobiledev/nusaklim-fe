"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { Station } from "@/types/domain";

/**
 * Peta pakai react-leaflet + OpenStreetMap tiles (gratis, tidak perlu API key).
 * Aplikasi existing memakai Highcharts Maps (butuh lisensi komersial untuk
 * penggunaan bisnis) — kalau tim ingin mempertahankan tampilan choropleth per
 * provinsi seperti sebelumnya, ganti komponen ini dengan
 * `highcharts-react-official` + peta GeoJSON provinsi Indonesia.
 */
export function IndonesiaMap({ stations }: { stations: Station[] }) {
  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={5}
      scrollWheelZoom
      className="h-[520px] w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map((station) => (
        <CircleMarker
          key={station.id}
          center={[station.latitude, station.longitude]}
          radius={8}
          pathOptions={{
            color: station.status === "aktif" ? "#15803d" : "#b91c1c",
            fillColor: station.status === "aktif" ? "#15803d" : "#b91c1c",
            fillOpacity: 0.85,
          }}
        >
          <Popup>
            <p className="font-medium">{station.nama}</p>
            <p className="text-xs text-muted-foreground">{station.provinsi}</p>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
