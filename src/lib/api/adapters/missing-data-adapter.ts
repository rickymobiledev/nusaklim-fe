import { degreesToCompass } from "@/lib/utils";
import type { MissingDataRow } from "@/types/domain";
import { parseFilterNumeric } from "../weather-filter-client";

/** Bentuk mentah satu baris `GET /weathers/missing` (dikonfirmasi user lewat
 *  contoh response asli). Semua metrik STRING; sentinel `"---"` = tidak ada
 *  data (Missing). `rainfall` justru selalu terisi (`"0.00000"` = nilai valid
 *  0, bukan Missing). `datetime` berformat `"YYYY-MM-DD HH:mm:ss"`. Response
 *  tidak punya id baris. */
export interface RawMissingDataRow {
  station_id: string;
  station_name: string;
  temperature?: string | null;
  humidity?: string | null;
  solar_radiation?: string | null;
  rainfall?: string | null;
  air_pressure?: string | null;
  wind_speed?: string | null;
  wind_direction?: string | null;
  datetime: string;
}

/** Pagination Laravel di response asli (`meta`), hanya field yang dipakai. */
export interface RawMissingDataMeta {
  total: number;
  per_page: number | string;
  current_page: number;
}

export interface RawMissingDataResponse {
  status: boolean;
  message?: string;
  data: RawMissingDataRow[];
  meta?: RawMissingDataMeta;
}

/** `"---"`, string kosong, atau non-numerik apa pun → `null`. Tanpa cek
 *  kosong, `Number("")` = 0 dan sel kosong tampil sebagai nilai valid. */
function parseMetric(raw: string | null | undefined): number | null {
  if (raw == null || raw.trim() === "") return null;
  return parseFilterNumeric(raw);
}

/** `"2026-10-08 09:50:00"` → `"08-10-2026 09:50"` (format yang dibaca
 *  `parseDatetime` di `MissingDataSection.tsx`, sama seperti Unduh Data).
 *  Bentuk tak dikenal dikembalikan apa adanya. */
function formatDatetime(raw: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(raw);
  if (!match) return raw;
  const [, year, month, day, hour, minute] = match;
  return `${day}-${month}-${year} ${hour}:${minute}`;
}

export function mapRawMissingData(raw: RawMissingDataRow): MissingDataRow {
  const windDeg = parseMetric(raw.wind_direction);
  return {
    // Response tidak punya id — stasiun + waktu pembacaan unik per baris.
    id: `${raw.station_id}-${raw.datetime}`,
    stasiun: raw.station_name,
    datetime: formatDatetime(raw.datetime),
    temperaturUdara: parseMetric(raw.temperature),
    kelembapanUdara: parseMetric(raw.humidity),
    curahHujan: parseMetric(raw.rainfall),
    radiasiMatahari: parseMetric(raw.solar_radiation),
    tekananUdara: parseMetric(raw.air_pressure),
    kecepatanAngin: parseMetric(raw.wind_speed),
    arahMataAngin: windDeg === null ? null : degreesToCompass(windDeg),
  };
}
