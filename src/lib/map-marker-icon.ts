import L from "leaflet";

const DOT_ICON_CACHE = new Map<string, L.DivIcon>();

/** Marker titik stasiun untuk keempat tab Peta (`station-map`,
 *  `water-deficit-map`, `dry-spell-map`, `rainfall-today-map`) — cuma warna
 *  yang beda per tab. Inti solid + cincin putih tebal + bayangan gelap tipis
 *  supaya tetap menonjol di atas fill hijau provinsi. Leaflet `divIcon` cuma
 *  terima HTML string, bukan JSX, jadi tidak bisa styled-components.
 *
 *  JANGAN tambahkan CSS `position` ke class `station-div-icon` manapun —
 *  `leaflet.css` sudah set `.leaflet-marker-icon { position: absolute }`
 *  lewat CSS class, dan menimpanya bikin marker meleset dari lokasinya
 *  (lihat ADR di docs/ARCHITECTURE.md bagian 13). `position:absolute` di span
 *  dalam ini inline dan aman. */
export function getStationDotIcon(color: string): L.DivIcon {
  const cached = DOT_ICON_CACHE.get(color);
  if (cached) return cached;

  const icon = L.divIcon({
    className: "station-div-icon",
    html: `<span style="position:absolute;inset:0;box-sizing:border-box;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,0.25),0 2px 6px rgba(0,0,0,0.45)"></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
  DOT_ICON_CACHE.set(color, icon);
  return icon;
}
