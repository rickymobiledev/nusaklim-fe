import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
  Position,
} from "geojson";
import provinceBoundaries from "@/data/geo/indonesia-provinces.json";

/**
 * Batas 34 provinsi Indonesia (ADM1) — di-derive dari geoBoundaries.org
 * (https://www.geoboundaries.org, sumber data OpenStreetMap contributors,
 * lisensi Open Data Commons ODbL 1.0). File asli ~3.4MB, sudah di-simplify
 * sekali lewat `mapshaper` (`-simplify weighted 25% keep-shapes -clean`,
 * topology-aware — borders antar-provinsi tetap menyambung, bukan cuma
 * di-crop per-fitur) jadi ~655KB di `src/data/geo/indonesia-provinces.json`
 * — TIDAK ada fetch live, file statis ter-bundle. Retention 25% + algoritma
 * weighted Visvalingam (bukan Douglas-Peucker 8% di percobaan pertama —
 * TERLALU agresif, sempat bikin marker stasiun dekat pantai kelihatan di
 * luar pulau; lihat ADR bagian 13) dipilih supaya bentuk pantai cukup
 * presisi buat marker stasiun, sambil ukuran file tetap wajar. WAJIB
 * tampilkan atribusi ini di UI peta (syarat ODbL share-alike/attribution)
 * — lihat prop `attribution` di `<GeoJSON>` `station-map.tsx`.
 *
 * Dataset ini MENGGANTIKAN `world-atlas`/`topojson-client` (outline
 * nasional-only) yang dipakai sebelumnya — karena tiap provinsi sekarang
 * feature terpisah, gabungan semua provinsi otomatis = outline nasional
 * juga, jadi satu sumber data cukup untuk fill pulau DAN garis batas
 * antar-provinsi.
 */
export const INDONESIA_PROVINCE_BOUNDARIES = provinceBoundaries as FeatureCollection<
  Polygon | MultiPolygon,
  { shapeName: string; shapeISO: string }
>;

/** `shapeName` di dataset geoBoundaries Bahasa Inggris — dipetakan ke nama
 *  Indonesia baku supaya konsisten sama aturan "semua teks UI Bahasa
 *  Indonesia" di CLAUDE.md. Vintage data 2017, belum termasuk provinsi
 *  Papua hasil pemekaran 2022 (Papua Tengah/Pegunungan/Selatan/Barat Daya)
 *  — cukup untuk label peta, bukan sumber data administratif resmi. */
const PROVINCE_NAME_ID: Record<string, string> = {
  Aceh: "Aceh",
  Bali: "Bali",
  "Bangka-Belitung Islands": "Kepulauan Bangka Belitung",
  Banten: "Banten",
  Bengkulu: "Bengkulu",
  "Central Java": "Jawa Tengah",
  "Central Kalimantan": "Kalimantan Tengah",
  "Central Sulawesi": "Sulawesi Tengah",
  "East Java": "Jawa Timur",
  "East Kalimantan": "Kalimantan Timur",
  "East Nusa Tenggara": "Nusa Tenggara Timur",
  Gorontalo: "Gorontalo",
  "Jakarta Special Capital Region": "DKI Jakarta",
  Jambi: "Jambi",
  Lampung: "Lampung",
  Maluku: "Maluku",
  "North Kalimantan": "Kalimantan Utara",
  "North Maluku": "Maluku Utara",
  "North Sulawesi": "Sulawesi Utara",
  "North Sumatra": "Sumatera Utara",
  Papua: "Papua",
  Riau: "Riau",
  "Riau Islands": "Kepulauan Riau",
  "South Kalimantan": "Kalimantan Selatan",
  "South Sulawesi": "Sulawesi Selatan",
  "South Sumatra": "Sumatera Selatan",
  "Southeast Sulawesi": "Sulawesi Tenggara",
  "Special Region of Yogyakarta": "Daerah Istimewa Yogyakarta",
  "West Java": "Jawa Barat",
  "West Kalimantan": "Kalimantan Barat",
  "West Nusa Tenggara": "Nusa Tenggara Barat",
  "West Papua": "Papua Barat",
  "West Sulawesi": "Sulawesi Barat",
  "West Sumatra": "Sumatera Barat",
};

/** Centroid area-weighted (shoelace formula) dari satu ring polygon —
 *  cukup akurat untuk posisi label teks, tidak perlu presisi GIS. */
function ringCentroid(ring: Position[]): [number, number] {
  let area = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    const cross = x1 * y2 - x2 * y1;
    area += cross;
    cx += (x1 + x2) * cross;
    cy += (y1 + y2) * cross;
  }

  area /= 2;
  if (area === 0) {
    const xs = ring.map((p) => p[0]);
    const ys = ring.map((p) => p[1]);
    return [
      (Math.min(...xs) + Math.max(...xs)) / 2,
      (Math.min(...ys) + Math.max(...ys)) / 2,
    ];
  }

  return [cx / (6 * area), cy / (6 * area)];
}

/** Provinsi seperti Riau (daratan + kepulauan) punya beberapa polygon part
 *  — label ditaruh di centroid ring terluar terbesar (daratan utamanya),
 *  bukan rata-rata semua part (yang bisa jatuh di tengah laut). */
function labelPositionFor(geometry: Polygon | MultiPolygon): {
  lat: number;
  long: number;
} {
  const polygons =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

  let best: { ring: Position[]; area: number } | null = null;
  for (const polygon of polygons) {
    const exteriorRing = polygon[0];
    let area = 0;
    for (let i = 0; i < exteriorRing.length - 1; i++) {
      const [x1, y1] = exteriorRing[i];
      const [x2, y2] = exteriorRing[i + 1];
      area += x1 * y2 - x2 * y1;
    }
    area = Math.abs(area / 2);
    if (!best || area > best.area) best = { ring: exteriorRing, area };
  }

  const [long, lat] = ringCentroid(best!.ring);
  return { lat, long };
}

/** Label nama provinsi + posisi centroid, di-derive langsung dari geometri
 *  asli `INDONESIA_PROVINCE_BOUNDARIES` (bukan koordinat hasil tebakan
 *  manual) — otomatis selalu selaras sama bentuk batas yang dirender. */
export const INDONESIA_PROVINCE_LABELS: { name: string; lat: number; long: number }[] =
  INDONESIA_PROVINCE_BOUNDARIES.features.map(
    (feature: Feature<Polygon | MultiPolygon, { shapeName: string }>) => ({
      name:
        PROVINCE_NAME_ID[feature.properties.shapeName] ?? feature.properties.shapeName,
      ...labelPositionFor(feature.geometry),
    }),
  );
