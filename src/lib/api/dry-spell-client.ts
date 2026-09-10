import { ApiError, type ApiListResponse } from "@/types/api";
import type { StationDrySpell } from "@/types/domain";
import { createApiClient } from "./fetcher";
import {
  mapRawDeviceToDrySpell,
  type RawDrySpellDevice,
} from "./adapters/dry-spell-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { DrySpellApi, DrySpellParams } from "./dry-spell-api";

/** Satu-satunya implementasi Dry Spell (Peta > Deret Terpanjang Hari Tidak
 *  Hujan) — pola identik `water-deficit-client.ts`: `createApiClient(companyId)`
 *  inject `company_code` otomatis, cek `res.data.status`, `ApiError` kalau
 *  gagal, TIDAK ada fallback diam-diam ke mock. Response `/devices/dry_spell`
 *  TERNYATA dibungkus `{status, message, data}` sama persis
 *  `/devices/water_deficit` (dikonfirmasi user lewat testing langsung ke
 *  backend asli — bukan array mentah seperti contoh awal yang dikasih).
 *  BEDA dari `water-deficit-client.ts`: TIDAK join ke
 *  `stationApi.getStations()` — `nama` sudah tersedia langsung di payload
 *  `dry_spell` (`raw.name`), dan `sinkronisasiTerakhir` sengaja diisi
 *  waktu-request-sekarang di adapter (lihat docblock
 *  `mapRawDeviceToDrySpell`), BUKAN di-join. Keputusan ini juga sekalian
 *  mengurangi 1 request bersamaan ke `/devices/status` (endpoint yang
 *  terbukti lambat kalau kena concurrency — lihat catatan di `CLAUDE.md`). */
export const drySpellClient: DrySpellApi = {
  async getStationDrySpell(
    params: DrySpellParams,
  ): Promise<ApiListResponse<StationDrySpell>> {
    try {
      const client = createApiClient(params.companyId);
      const res = await client.get<{
        status: boolean;
        message: string;
        data: RawDrySpellDevice[];
      }>("/devices/dry_spell", {
        params: { year: params.year },
      });

      if (!res.data.status) {
        throw new ApiError(
          "DRY_SPELL_FETCH_FAILED",
          res.data.message || "Gagal mengambil data deret hari tidak hujan dari server.",
        );
      }

      const data = res.data.data.map((raw) => mapRawDeviceToDrySpell(raw));

      return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "DRY_SPELL_FETCH_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server deret hari tidak hujan.",
      );
    }
  },
};
