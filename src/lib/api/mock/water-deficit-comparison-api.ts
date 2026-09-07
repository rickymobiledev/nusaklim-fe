import type { ApiListResponse } from "@/types/api";
import type { StationWaterDeficit } from "@/types/domain";
import { stationApi } from "../station-client";
import type { WaterDeficitApi, WaterDeficitParams } from "../water-deficit-api";
import { delay } from "./delay";

/** Hash string -> pecahan stabil [0,1) — supaya nilai mock per stasiun
 *  konsisten antar-request/reload (bukan `Math.random()` polos yang
 *  berubah tiap render), tanpa perlu state/DB tambahan. */
function seededFraction(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return (hash % 1000) / 1000;
}

/** TODO: panel "Perbandingan Defisit Air" (`WaterDeficitPanel.tsx`) BELUM
 *  punya endpoint BE terkonfirmasi — JANGAN disamakan dengan
 *  `GET /devices/water_deficit?company_code=&year=&month=` yang dipakai
 *  peta (`water-deficit-client.ts`, itu SUDAH real, dikonfirmasi
 *  langsung ke `nusaklim-api.holding-perkebunan.com`). Mock ini
 *  independen dari data map — nilainya generated, bukan snapshot bulan
 *  asli manapun. Ganti implementasi ini (`water-deficit-client.ts` versi
 *  comparison, atau apapun bentuk endpoint aslinya nanti) begitu BE
 *  konfirmasi kontraknya, lalu update wiring di `lib/api/index.ts`
 *  (`waterDeficitComparisonApi`) — TIDAK perlu ubah Route Handler/hook/
 *  komponen `WaterDeficitPanel.tsx` kalau bentuk `StationWaterDeficit`
 *  tetap sama.
 *
 *  `stationId`/`nama`/`brand`/`lat`/`long`/`companyCode`/`companyName`/
 *  `sinkronisasiTerakhir` tetap dari `stationApi` asli (Stasiun 100%
 *  real) — cuma 4 metrik defisit air yang di-generate. Setiap 4 stasiun
 *  (berdasar urutan), 1 sengaja dibuat "Tidak Ada Data" (null semua)
 *  supaya empty-state di panel ikut teruji. */
export const mockWaterDeficitComparisonApi: WaterDeficitApi = {
  async getStationWaterDeficit(
    params: WaterDeficitParams,
  ): Promise<ApiListResponse<StationWaterDeficit>> {
    await delay();
    const { data: stations } = await stationApi.getStations({
      companyId: params.companyId,
    });

    const data: StationWaterDeficit[] = stations.map((station, index) => {
      const noData = index % 4 === 3;
      if (noData) {
        return {
          stationId: station.id,
          nama: station.nama,
          brand: station.brand,
          lat: station.lat,
          long: station.long,
          companyCode: station.companyCode,
          companyName: station.companyName,
          curahHujan: null,
          defisitAir: null,
          hariHujan: null,
          kelebihanAir: null,
          sinkronisasiTerakhir: station.sinkronisasiTerakhir,
        };
      }

      const fraction = seededFraction(station.id);
      const curahHujan = Math.round((80 + fraction * 400) * 10) / 10;
      const defisitAir = Math.round(fraction * 320);
      const hariHujan = Math.round(4 + fraction * 16);
      const kelebihanAir = defisitAir === 0 ? Math.round(fraction * 20) : 0;

      return {
        stationId: station.id,
        nama: station.nama,
        brand: station.brand,
        lat: station.lat,
        long: station.long,
        companyCode: station.companyCode,
        companyName: station.companyName,
        curahHujan,
        defisitAir,
        hariHujan,
        kelebihanAir,
        sinkronisasiTerakhir: station.sinkronisasiTerakhir,
      };
    });

    return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
  },
};
