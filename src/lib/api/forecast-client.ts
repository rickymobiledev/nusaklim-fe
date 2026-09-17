import { ApiError, type ApiItemResponse } from "@/types/api";
import type { ForecastResult } from "@/types/forecast";
import { createApiClient } from "./fetcher";
import {
  mapRawForecastResult,
  type RawForecastResponse,
} from "./adapters/forecast-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { ForecastApi } from "./forecast-api";

const FORM_HEADERS = { "Content-Type": "application/x-www-form-urlencoded" };

/** Satu-satunya implementasi asli Ramalan Cuaca — dipakai kartu Beranda
 *  (`ForecastCard.tsx`) DAN halaman `/forecast`, keduanya lewat
 *  `useForecast()` yang sama. `POST /forecast`, body form `station_id`
 *  (BUKAN JSON), dikonfirmasi lewat curl langsung ke backend asli.
 *
 *  SENGAJA TIDAK panggil `stationApi.getStationDetail()` sbg guard
 *  company dulu (BEDA dari domain real lain seperti
 *  `dry-spell-report-client.ts`/`vpd-client.ts` yang tetap panggil itu) —
 *  `stationId` dari client dipakai LANGSUNG apa adanya sebagai
 *  `station_id`, atas permintaan eksplisit user supaya tidak ada 1
 *  request tambahan (dropdown Pilih Stasiun sudah memilih dari daftar
 *  yang valid). KONSEKUENSI YANG DITERIMA: endpoint ini TIDAK divalidasi
 *  kepemilikan company-nya di sisi kita sebelum diteruskan ke BE — kalau
 *  BE sendiri tidak menolak `station_id` milik company lain, ini
 *  berpotensi IDOR. Lihat diskusi & keputusan di CLAUDE.md bagian
 *  "companyId (multi-tenant)". */
export const forecastClient: ForecastApi = {
  async getForecast(
    stationId: string,
    companyId?: string,
  ): Promise<ApiItemResponse<ForecastResult>> {
    // Belum ada stasiun dipilih di UI — tampilkan kosong, jangan error
    // (pola sama mock/forecast-api.ts yang digantikan file ini).
    if (!stationId) {
      return {
        data: {
          stationId: "",
          stationName: "",
          latitude: 0,
          longitude: 0,
          timezone: "Asia/Jakarta",
          forecast: [],
          units: {},
        },
      };
    }

    try {
      const client = createApiClient(companyId);
      const res = await client.post<RawForecastResponse>(
        "/forecast",
        new URLSearchParams({ station_id: stationId }).toString(),
        { headers: FORM_HEADERS },
      );

      if (!res.data.status) {
        throw new ApiError(
          "FORECAST_FETCH_FAILED",
          res.data.message || "Gagal mengambil data ramalan cuaca dari server.",
        );
      }

      return { data: mapRawForecastResult(res.data.data) };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "FORECAST_FETCH_FAILED",
        extractBackendErrorMessage(err) ?? "Gagal terhubung ke server ramalan cuaca.",
      );
    }
  },
};
