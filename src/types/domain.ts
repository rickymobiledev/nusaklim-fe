/**
 * Domain types — ini adalah "kontrak" antara Frontend, Backend, dan Data Analyst.
 * Idealnya file ini di-generate otomatis dari OpenAPI/Swagger spec milik BE
 * (lihat catatan di README), tapi ditulis manual dulu di boilerplate ini
 * berdasarkan tampilan existing app supaya tim FE bisa mulai duluan.
 */

/** API asli (`GET /devices/status`) balikin `"ON"/"OFF"` (uppercase) — nilai
 *  di sini sudah dinormalisasi lowercase oleh
 *  `lib/api/adapters/station-adapter.ts`, bukan "aktif"/"tidak_aktif". */
export type StationStatus = "on" | "off";

/** Field mengikuti `GET /devices`/`GET /devices/status` API asli. Tidak ada
 *  `kode`/`provinsi` di sana — jangan tambahkan lagi tanpa data BE yang
 *  benar-benar menyediakannya. */
export interface Station {
  id: string;
  nama: string;
  brand: string;
  companyCode: string;
  companyName: string;
  lat: number;
  long: number;
  status: StationStatus;
  sinkronisasiTerakhir: string | null; // dari field `last_sync_time` API asli — BUKAN `updated_at` (field beda, updated_at cuma timestamp record berubah)
}

/** PENGECUALIAN sengaja dari konvensi "kontrak Indonesia" di docblock
 *  atas file ini — field grup tipe Weather (`WeatherMetricRange`,
 *  `WeatherChartPoint`, `WeatherMetric`) di Bahasa Inggris atas
 *  permintaan eksplisit, TIDAK berlaku untuk tipe domain lain di file
 *  ini (semuanya tetap Indonesia). Jangan "diperbaiki balik" ke
 *  Indonesia demi konsistensi tanpa konfirmasi ulang. */
export interface WeatherMetricRange {
  value: number | null;
  min: number | null;
  max: number | null;
  unit: string;
}

export interface WeatherChartPoint {
  date: string; // label pendek "01 Jan"
  // null = hari tanpa data (bukan 0) — lihat WeatherChartCard, Recharts
  // otomatis putus garis chart di titik null (connectNulls default false).
  value: number | null;
}

export interface WeatherStatus {
  tone: "success" | "warning";
  message: string;
}

/** Data tambahan khusus kartu Curah Hujan (chart 7 hari + status
 *  pemupukan). DERIVED di mock layer dari threshold sementara — status
 *  "belum final" sama seperti VPDReport.kategori, butuh konfirmasi Data
 *  Analyst/BE sebelum dianggap final. */
export interface RainfallDetail {
  chart: WeatherChartPoint[];
  status: WeatherStatus;
}

/** Data tambahan kartu Kelembapan Relatif (chart 7 hari + status ambang
 *  lembab). Threshold di humidity-status.ts BELUM final (butuh konfirmasi
 *  Data Analyst/BE). Field harian sumber chart JUGA belum dikonfirmasi
 *  ada di payload /weathers/daily asli — lihat weather-daily-client.ts. */
export interface HumidityDetail {
  chart: WeatherChartPoint[];
  status: WeatherStatus;
}

/** Satu deret temperatur harian satu stasiun untuk rentang tanggal yang
 *  diminta — item `ApiListResponse` dari `GET /api/air-temperature/daily`
 *  (halaman detail `/air-temperature`, bukan kartu ringkasan Beranda). */
export interface AirTemperatureStationSeries {
  stationId: string;
  stationName: string;
  points: WeatherChartPoint[];
}

/** Satu deret radiasi matahari harian satu stasiun untuk rentang tanggal
 *  yang diminta — item `ApiListResponse` dari `GET /api/solar-radiation/daily`
 *  (halaman detail `/solar-radiation`, bukan kartu ringkasan Beranda). */
export interface SolarRadiationStationSeries {
  stationId: string;
  stationName: string;
  points: WeatherChartPoint[];
}

/** Satu deret tekanan udara harian satu stasiun untuk rentang tanggal yang
 *  diminta — item `ApiListResponse` dari `GET /api/air-pressure/daily`
 *  (halaman detail `/air-pressure`, bukan kartu ringkasan Beranda). */
export interface AirPressureStationSeries {
  stationId: string;
  stationName: string;
  points: WeatherChartPoint[];
}

/** Kartu ringkasan cuaca di Beranda: Temperatur Udara, Radiasi Matahari, dst. */
export interface WeatherMetric {
  stationId: string;
  updatedAt: string | null;
  airTemperature: WeatherMetricRange;
  solarRadiation: WeatherMetricRange;
  airHumidity: WeatherMetricRange;
  rainfall: WeatherMetricRange;
  airPressure: WeatherMetricRange;
  windSpeed: WeatherMetricRange;
  rainfallDetail?: RainfallDetail;
  humidityDetail?: HumidityDetail;
}

export type BulanKey =
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "may"
  | "jun"
  | "jul"
  | "aug"
  | "sep"
  | "oct"
  | "nov"
  | "dec";

/** Urutan `BulanKey` — dipakai untuk generate 12 baris & mapping index bulan. */
export const BULAN_ORDER: BulanKey[] = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

/** Satu baris bulan dari tabel `GET /water_deficit` asli (pivot dari 4 baris
 *  per-parameter x kolom jan..dec ke bentuk per-bulan yang gampang dirender
 *  sebagai tabel/chart). */
export interface WaterBalanceMonth {
  bulan: BulanKey;
  curahHujan: number | null;
  defisitAir: number | null;
  hariHujan: number | null;
  kelebihanAir: number | null;
}

/** Panel "Monitoring" di sidebar Beranda + halaman Monitoring — data
 *  SETAHUN penuh per stasiun (bukan 1 periode), sesuai `GET /water_deficit?device_id=&year=`. */
export interface WaterBalance {
  stationId: string;
  tahun: number;
  bulanan: WaterBalanceMonth[];
}

/** Satu baris dari `GET /dry_spell` — bisa lebih dari satu periode dry-spell
 *  dalam rentang tanggal, jadi ini item list, bukan objek tunggal. */
export interface DrySpellReport {
  stasiun: string;
  tanggal: string;
  totalHariKering: number;
  tanggalMulai: string;
  tanggalSelesai: string;
}

/** Satu baris per-hari dari `GET /solar_sunshine`. */
export interface SunshineDuration {
  stasiun: string;
  tanggal: string;
  lamaPenyinaranJam: number;
  batasBawahJam: number;
}

/** Satu baris per-hari dari `GET /vpd`. API asli tidak punya field
 *  "kategori" — `kategori` di sini DERIVED dari `vpd`/`batasAman`
 *  (threshold sementara: <=70% "rendah", <=100% "sedang", >100% "tinggi"),
 *  bukan nilai dari Backend. Konfirmasi ke tim Data Analyst/BE sebelum
 *  dianggap final. */
export interface VPDReport {
  stasiun: string;
  tanggal: string;
  temperaturUdara: number;
  kelembabanUdara: number;
  svp: number;
  vpd: number;
  batasAman: number;
  kategori: "rendah" | "sedang" | "tinggi";
}

/** Baris tabel "Unduh Data". */
export interface DownloadDataRow {
  tanggal: string;
  rerataTemperatur: number | null;
  totalCurahHujan: number | null;
  totalRadiasi: number | null;
  rerataTekananUdara: number | null;
  rerataKecepatanAngin: number | null;
  arahMataAngin: string | null;
}

export type DataGranularity = "harian" | "10menit" | "pagi" | "siang" | "malam";
