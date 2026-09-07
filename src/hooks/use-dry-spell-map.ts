"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { StationDrySpell } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";

/** `companyId` TIDAK dikirim dari sini — Route Handler yang menentukan
 *  dari sesi server-side (`resolveCompanyId()`). Snapshot company-wide
 *  1 TAHUN untuk tab Peta > Deret Terpanjang Hari Tidak Hujan.
 *
 *  Nama file SENGAJA `use-dry-spell-map` (bukan `use-dry-spell`) —
 *  `use-dry-spell.ts` sudah dipakai halaman Monitoring
 *  (`/monitoring/dry-spell`, tipe `DrySpellReport`, endpoint beda
 *  `/dry_spell?device_id=&dateFrom=&dateTo=`, masih mock). Beda domain
 *  sama sekali meski nama mirip — jangan digabung. */
export function useDrySpellMap() {
  return useQuery({
    queryKey: ["map", "dry-spell"],
    queryFn: () => fetchJson<ApiListResponse<StationDrySpell>>("/api/map/dry-spell"),
    select: (res) => res.data,
    // Sama seperti use-water-deficit.ts — data "tahun ini", polling ringan
    // tiap 5 menit sudah cukup, tidak perlu WebSocket.
    refetchInterval: 5 * 60 * 1000,
  });
}
