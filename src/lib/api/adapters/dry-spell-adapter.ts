import type { StationDrySpell } from "@/types/domain";

/**
 * Bentuk mentah `GET /devices/dry_spell` (dikonfirmasi user lewat contoh
 * response langsung) — cuma field yang benar-benar dipetakan ke
 * `StationDrySpell` yang dideklarasikan di sini, field lain (`created_at`,
 * `updated_at`, `company_id`, `company_image_url`, `company_created_at`,
 * `company_updated_at`, dst) sengaja diabaikan sama seperti pola
 * `RawWaterDeficitDevice` di `water-deficit-adapter.ts`.
 *
 * BEDA dari `RawWaterDeficitDevice`: `dry_spell` di sini array PERIODE
 * kekeringan (bisa lebih dari satu dalam setahun), bukan pivot 1 nilai
 * per komponen — array bisa KOSONG (`[]`) untuk device tanpa periode
 * kekeringan tahun itu.
 */
export interface RawDrySpellEntry {
  device_id: string;
  duration: number;
  start_date: string;
  end_date: string;
}

export interface RawDrySpellDevice {
  id: string;
  name: string;
  brand: string;
  latitude: string;
  longitude: string;
  company_code: string;
  company_name: string;
  dry_spell: RawDrySpellEntry[];
}

/** Pilih entri dengan `end_date` PALING BARU dari array `dry_spell` —
 *  BUKAN durasi terbesar. Awalnya diasumsikan "durasi terbesar" (sesuai
 *  nama tab "Deret TERPANJANG Hari Tidak Hujan"), tapi dikoreksi setelah
 *  dibandingkan langsung ke dashboard Nusaklim produksi (ground truth):
 *  yang ditampilkan di sana adalah periode PALING BARU, bukan yang paling
 *  panjang durasinya. `null` kalau array kosong (tidak ada periode
 *  kekeringan tercatat tahun itu). */
function pickMostRecentDrySpell(entries: RawDrySpellEntry[]): RawDrySpellEntry | null {
  if (entries.length === 0) return null;
  return entries.reduce((mostRecent, entry) =>
    new Date(entry.end_date) > new Date(mostRecent.end_date) ? entry : mostRecent,
  );
}

/** `sinkronisasiTerakhir` TIDAK ada di payload `dry_spell` asli — SENGAJA
 *  diisi waktu request saat ini (`new Date().toISOString()`), BUKAN hasil
 *  join ke `stationApi.getStations()` — keputusan sadar supaya
 *  `dry-spell-client.ts` tidak perlu manggil `stationApi.getStations()`
 *  sama sekali (mengurangi request BERSAMAAN ke `/devices/status`, yang
 *  terbukti lambat kalau kena concurrency — lihat `CLAUDE.md`; pola &
 *  alasan yang sama juga dipakai `water-deficit-adapter.ts`). Konsekuensi:
 *  nilai ini BUKAN waktu sync asli device, cuma timestamp saat data
 *  di-fetch — popup peta akan selalu menampilkan "baru saja" untuk field
 *  ini, bukan riwayat sync sebenarnya. */
export function mapRawDeviceToDrySpell(raw: RawDrySpellDevice): StationDrySpell {
  const mostRecent = pickMostRecentDrySpell(raw.dry_spell);

  return {
    stationId: raw.id,
    nama: raw.name,
    brand: raw.brand,
    lat: Number(raw.latitude),
    long: Number(raw.longitude),
    companyCode: raw.company_code,
    companyName: raw.company_name,
    durasiTerakhir: mostRecent?.duration ?? null,
    tanggalMulai: mostRecent?.start_date ?? null,
    tanggalSelesai: mostRecent?.end_date ?? null,
    sinkronisasiTerakhir: new Date().toISOString(),
  };
}
