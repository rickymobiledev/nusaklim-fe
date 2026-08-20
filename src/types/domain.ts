/**
 * Domain types — ini adalah "kontrak" antara Frontend, Backend, dan Data Analyst.
 * Idealnya file ini di-generate otomatis dari OpenAPI/Swagger spec milik BE
 * (lihat catatan di README), tapi ditulis manual dulu di boilerplate ini
 * berdasarkan tampilan existing app supaya tim FE bisa mulai duluan.
 */

export type StationStatus = "aktif" | "tidak_aktif";

export interface Station {
  id: string;
  nama: string;
  lokasi: string;
  provinsi: string;
  latitude: number;
  longitude: number;
  status: StationStatus;
  sinkronisasiTerakhir: string | null; // ISO date string
}

export interface StationSummary {
  totalStasiun: number;
  stasiunAktif: number;
  stasiunTidakAktif: number;
}

export interface WeatherMetricRange {
  nilai: number | null;
  min: number | null;
  maks: number | null;
  satuan: string;
}

/** Kartu ringkasan cuaca di Beranda: Temperatur Udara, Radiasi Matahari, dst. */
export interface WeatherSnapshot {
  stasiunId: string;
  diperbaruiPada: string | null;
  temperaturUdara: WeatherMetricRange;
  radiasiMatahari: WeatherMetricRange;
  kelembabanUdara: WeatherMetricRange;
  curahHujan: WeatherMetricRange;
  tekananUdara: WeatherMetricRange;
  kecepatanAngin: WeatherMetricRange;
}

/** Panel "Monitoring" di sidebar Beranda + halaman Monitoring. */
export interface KeseimbanganAir {
  curahHujan: number | null;
  defisitAir: number | null;
  hariHujan: number | null;
  kelebihanAir: number | null;
  periode: string; // contoh: "Juli 2026" (diambil dari bulan sebelumnya)
}

export interface DeretHariTidakHujan {
  tanggalMulai: string | null;
  durasiHari: number | null;
}

export interface LamaPenyinaran {
  batasBawahJam: number | null;
  batasAtasJam: number | null;
}

export interface VpdIndex {
  nilai: number | null;
  kategori: "rendah" | "sedang" | "tinggi" | null;
}

/** Baris tabel "Unduh Data". */
export interface WeatherDataRow {
  tanggal: string;
  rerataTemperaturUdaraMin: number | null;
  rerataTemperaturUdaraMax: number | null;
  totalCurahHujan: number | null;
  totalRadiasiMatahari: number | null;
  rerataTekananUdara: number | null;
  rerataKecepatanAngin: number | null;
  arahMataAngin: string | null;
}

export type DataGranularity =
  | "harian"
  | "10menit"
  | "pagi"
  | "siang"
  | "malam";

/** Baris tabel "Ramalan Cuaca" — hasil model DL dari tim Data Analyst. */
export interface ForecastRow {
  tanggal: string;
  temperaturUdara: number | null;
  kelembabanUdara: number | null;
  curahHujan: number | null;
  radiasiMatahari: number | null;
  tekananUdara: number | null;
  kecepatanAngin: number | null;
  arahMataAngin: string | null;
}

export interface ApiError {
  message: string;
  code?: string;
}
