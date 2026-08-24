"use client";

import "leaflet/dist/leaflet.css";
import { format } from "date-fns";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { Station } from "@/types/domain";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mapDeviceStatus, STATION_STATUS_BADGE } from "@/lib/status";

/**
 * Peta pakai react-leaflet + OpenStreetMap tiles (gratis, tidak perlu API key).
 * Aplikasi existing memakai Highcharts Maps (butuh lisensi komersial untuk
 * penggunaan bisnis) — kalau tim ingin mempertahankan tampilan choropleth per
 * provinsi seperti sebelumnya, ganti komponen ini dengan
 * `highcharts-react-official` + peta GeoJSON provinsi Indonesia.
 */
export function StationMap({ stations }: { stations: Station[] }) {
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
      {stations.map((station) => {
        const statusInfo = STATION_STATUS_BADGE[mapDeviceStatus(station.status)];
        return (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.long]}
            radius={8}
            pathOptions={{
              color: statusInfo.color,
              fillColor: statusInfo.color,
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <div className="flex flex-col gap-1 text-sm">
                <p className="font-medium">{station.nama}</p>
                <StatusBadge label={statusInfo.label} tone={statusInfo.tone} />
                <p>
                  <span className="text-muted-foreground">Perusahaan:</span>{" "}
                  {station.companyName}
                </p>
                <p>
                  <span className="text-muted-foreground">Brand:</span> {station.brand}
                </p>
                <p>
                  <span className="text-muted-foreground">Lat/Long:</span>{" "}
                  {station.lat.toFixed(4)}, {station.long.toFixed(4)}
                </p>
                <p>
                  <span className="text-muted-foreground">Sinkronisasi terakhir:</span>{" "}
                  {station.sinkronisasiTerakhir
                    ? format(new Date(station.sinkronisasiTerakhir), "dd/MM/yyyy HH:mm")
                    : "Belum pernah sinkron"}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
