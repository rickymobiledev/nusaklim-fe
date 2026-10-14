import { format } from "date-fns";
import { ApiError } from "@/types/api";
import type { ApiListResponse } from "@/types/api";
import type { DataGranularity, DownloadDataRow } from "@/types/domain";
import { degreesToCompass } from "@/lib/utils";
import { stationApi } from "./station-client";
import {
  fetchRawDaily,
  parseHumidity,
  parseNumeric,
  parsePressure,
  parseRadiation,
  parseTemperature,
  parseWindDirection,
  parseWindSpeed,
  type RawWeatherDaily,
} from "./weather-daily-client";
import {
  fetchRawFilter,
  parseFilterDatetime,
  parseFilterNumeric,
  type RawWeatherFilter,
} from "./weather-filter-client";
import {
  fetchRawPeriod,
  type RawWeatherPeriod,
  type WeatherPeriod,
} from "./weather-period-client";
import { extractBackendErrorMessage } from "./backend-error";
import type { DownloadApi, GetDownloadDataParams } from "./download-api";

function mapDailyRow(row: RawWeatherDaily): DownloadDataRow {
  const windDeg = parseWindDirection(row);
  return {
    tanggal: row.date,
    rerataTemperatur: parseTemperature(row),
    rerataKelembapanRelatif: parseHumidity(row),
    totalCurahHujan: parseNumeric(row.sum_rainfall),
    totalRadiasi: parseRadiation(row),
    rerataTekananUdara: parsePressure(row),
    rerataKecepatanAngin: parseWindSpeed(row),
    arahMataAngin: windDeg === null ? null : degreesToCompass(windDeg),
  };
}

function mapFilterRow(row: RawWeatherFilter): DownloadDataRow {
  const windDeg = parseFilterNumeric(row.wind_direction);
  return {
    tanggal: format(parseFilterDatetime(row.datetime), "dd-MM-yyyy HH:mm"),
    rerataTemperatur: parseFilterNumeric(row.temperature),
    rerataKelembapanRelatif: parseFilterNumeric(row.humidity),
    totalCurahHujan: parseFilterNumeric(row.rainfall),
    totalRadiasi: parseFilterNumeric(row.radiation),
    rerataTekananUdara: parseFilterNumeric(row.air_pressure),
    rerataKecepatanAngin: parseFilterNumeric(row.wind_speed),
    arahMataAngin: windDeg === null ? null : degreesToCompass(windDeg),
  };
}

function mapPeriodRow(row: RawWeatherPeriod): DownloadDataRow {
  const windDeg = parseNumeric(row.wind_direction);
  return {
    tanggal: row.datetime,
    rerataTemperatur: parseNumeric(row.temperature),
    rerataKelembapanRelatif: parseNumeric(row.humidity),
    totalCurahHujan: parseNumeric(row.rainfall),
    totalRadiasi: parseNumeric(row.solar_radiation),
    rerataTekananUdara: parseNumeric(row.air_pressure),
    rerataKecepatanAngin: parseNumeric(row.wind_speed),
    arahMataAngin: windDeg === null ? null : degreesToCompass(windDeg),
  };
}

/** Granularitas periode → endpoint backend (`/weathers/{morning|afternoon|evening}`). */
const PERIOD_ENDPOINT: Partial<Record<DataGranularity, WeatherPeriod>> = {
  pagi: "morning",
  siang: "afternoon",
  malam: "evening",
};

async function fetchRows(
  stationId: string,
  granularity: DataGranularity,
  startDate: Date,
  endDate: Date,
  companyId?: string,
): Promise<DownloadDataRow[]> {
  if (granularity === "harian") {
    const raw = await fetchRawDaily(stationId, startDate, endDate, companyId);
    // Descending — tanggal terbaru duluan, sesuai permintaan user (mulai
    // dari "sekarang" mundur ke belakang), juga urutan asli yang memang
    // dikembalikan backend.
    return raw.map(mapDailyRow).sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }

  const period = PERIOD_ENDPOINT[granularity];
  if (period) {
    const raw = await fetchRawPeriod(period, stationId, startDate, endDate, companyId);
    // Descending juga — sama alasannya seperti "harian" di atas.
    return raw.map(mapPeriodRow).sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }

  // "10menit": semua pembacaan mentah dipakai apa adanya.
  const raw = await fetchRawFilter(stationId, startDate, endDate, companyId);
  return raw
    .map((row) => ({ row, date: parseFilterDatetime(row.datetime) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ row }) => mapFilterRow(row));
}

/** Implementasi `DownloadApi` — pola sama `air-temperature-client.ts`:
 *  guard company via `stationApi.getStationDetail()` dulu (404-style kalau
 *  stasiun bukan milik company), lalu ambil data mentah dari salah satu
 *  dari TIGA jenis endpoint tergantung `granularity` (dikonfirmasi lewat
 *  tes langsung ke backend asli):
 *  - `"harian"` → `/weathers/daily` (`fetchRawDaily`, 1 baris/hari, sudah
 *    dipakai halaman lain juga).
 *  - `"10menit"` → `/weathers/filter` (`fetchRawFilter`, pembacaan mentah
 *    ~tiap 10 menit, khusus dipakai halaman ini).
 *  - `"pagi"/"siang"/"malam"` → `/weathers/morning|afternoon|evening`
 *    (`fetchRawPeriod`, 1 baris AGREGAT per hari per periode — bukan subset
 *    jam dari data mentah).
 *  Semua endpoint balikin SELURUH rentang tanggal sekaligus (tidak native
 *  paginated). Kalau caller (`use-download-data.ts`) TIDAK eksplisit minta
 *  `page`/`pageSize`, balikin SEMUA baris apa adanya — pola PERSIS
 *  `stationApi.getStations()` (`station-client.ts`): "jangan diam-diam
 *  potong ke default 10", supaya UI bisa fetch sekali lalu paginate
 *  murni di client tanpa request lagi tiap pindah halaman (permintaan
 *  eksplisit user, ikut behaviour project lama). `page`/`pageSize`
 *  eksplisit tetap didukung (slice in-memory) kalau suatu saat ada
 *  consumer lain yang butuh pagination server-side. */
export const downloadClient: DownloadApi = {
  async getDownloadData(
    params: GetDownloadDataParams,
  ): Promise<ApiListResponse<DownloadDataRow>> {
    if (!params.stationId || !params.dateFrom || !params.dateTo) {
      return { data: [], meta: { page: 1, pageSize: params.pageSize ?? 10, total: 0 } };
    }

    // Guard company: 404-style kalau stasiun bukan milik company user,
    // konsisten kebijakan domain lain (bukan bocorkan "ada tapi bukan
    // company kamu").
    await stationApi.getStationDetail(params.stationId, params.companyId);

    try {
      const rows = await fetchRows(
        params.stationId,
        params.granularity,
        new Date(params.dateFrom),
        new Date(params.dateTo),
        params.companyId,
      );

      if (params.page === undefined && params.pageSize === undefined) {
        return {
          data: rows,
          meta: { page: 1, pageSize: rows.length, total: rows.length },
        };
      }

      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 10;
      const start = (page - 1) * pageSize;
      return {
        data: rows.slice(start, start + pageSize),
        meta: { page, pageSize, total: rows.length },
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "DOWNLOAD_DATA_FETCH_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    }
  },
};
