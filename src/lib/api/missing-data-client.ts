import { ApiError, type ApiItemResponse, type ApiListResponse } from "@/types/api";
import type { MissingDataImportResult, MissingDataRow } from "@/types/domain";
import { validateImportFile } from "@/lib/missing-data-import";
import type { MissingDataApi } from "./missing-data-api";

// TODO(sementara — belum ada kontrak BE): true = pakai data mock di bawah,
// BUKAN hit backend asli. Endpoint asli `GET /weathers/missing` (pagination
// Laravel `page`/`per_page`) & `POST /import/aws` (formdata Excel, maks 5 MB)
// SUDAH diketahui, tapi bentuk response-nya BELUM dikonfirmasi lewat tes
// langsung — begitu ada contoh JSON-nya, isi cabang real di bawah (adapter
// di `lib/api/adapters/`, pola `news-adapter.ts`) lalu set `false`.
const TEMP_USE_MOCK_MISSING_DATA = true;

/** Baris mock persis contoh Figma: semua metrik Missing, kecuali curah hujan
 *  yang kadang punya nilai 0 (tampil "0,00 mm"). */
function mockRow(
  id: number,
  stasiun: string,
  datetime: string,
  curahHujan: number | null,
): MissingDataRow {
  return {
    id: String(id),
    stasiun,
    datetime,
    temperaturUdara: null,
    kelembapanUdara: null,
    curahHujan,
    radiasiMatahari: null,
    tekananUdara: null,
    kecepatanAngin: null,
    arahMataAngin: null,
  };
}

const MOCK_ROWS: MissingDataRow[] = [
  mockRow(1, "Bukit Sentang", "01-08-2026 13:50", 0),
  mockRow(2, "Bukit Sentang", "01-08-2026 13:50", null),
  mockRow(3, "Bukit Sentang", "01-08-2026 13:50", null),
  mockRow(4, "Bukit Sentang", "01-08-2026 13:50", null),
  mockRow(5, "Bukit Sentang", "01-08-2026 13:50", null),
  mockRow(6, "Bukit Sentang", "01-08-2026 13:50", null),
  mockRow(7, "Bukit Sentang", "01-08-2026 13:50", 0),
  mockRow(8, "Marlihat", "01-08-2026 13:50", 0),
  mockRow(9, "Marlihat", "01-08-2026 13:50", null),
  mockRow(10, "Marlihat", "01-08-2026 13:50", 0),
  mockRow(11, "Sei Rokan", "02-08-2026 09:20", null),
  mockRow(12, "Sei Rokan", "02-08-2026 09:30", 0),
  mockRow(13, "Sei Rokan", "02-08-2026 09:40", null),
  mockRow(14, "Tanah Putih", "02-08-2026 10:00", null),
  mockRow(15, "Tanah Putih", "02-08-2026 10:10", 0),
];

export const missingDataClient: MissingDataApi = {
  async getMissingData(): Promise<ApiListResponse<MissingDataRow>> {
    if (TEMP_USE_MOCK_MISSING_DATA) {
      return {
        data: MOCK_ROWS,
        meta: { page: 1, pageSize: MOCK_ROWS.length, total: MOCK_ROWS.length },
      };
    }

    // TODO: `GET /weathers/missing` lewat `createApiClient()` (pola
    // `news-client.ts`), ambil SEMUA halaman (`page`/`per_page`), petakan
    // lewat adapter. Sengaja throw eksplisit — tidak ada fallback diam-diam
    // ke mock (kebijakan project).
    throw new ApiError(
      "MISSING_DATA_FETCH_FAILED",
      "Endpoint Missing Data belum tersambung ke server.",
    );
  },

  async importData(file: File): Promise<ApiItemResponse<MissingDataImportResult>> {
    const invalid = validateImportFile(file);
    if (invalid) throw new ApiError("MISSING_DATA_IMPORT_INVALID", invalid);

    if (TEMP_USE_MOCK_MISSING_DATA) {
      return { data: { imported: MOCK_ROWS.length } };
    }

    // TODO: `POST /import/aws` (formdata `file`) lewat `createApiClient()`.
    throw new ApiError(
      "MISSING_DATA_IMPORT_FAILED",
      "Endpoint import data belum tersambung ke server.",
    );
  },
};
