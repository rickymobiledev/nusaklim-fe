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

/** Satu deret kelembapan relatif harian satu stasiun untuk rentang tanggal
 *  yang diminta — item `ApiListResponse` dari `GET /api/relative-humidity/daily`
 *  (halaman detail `/relative-humidity`, bukan kartu ringkasan Beranda). */
export interface RelativeHumidityStationSeries {
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

/** Level kategori defisit air untuk warna marker/legend Peta > Keseimbangan
 *  Air — bukan field dari BE, threshold ambang (>200mm) ikut teks alert
 *  di Figma. Lihat `lib/water-deficit-level.ts`. */
export type WaterDeficitLevel = "tidak_ada" | "rendah" | "tinggi";

/** Snapshot SATU BULAN (bukan "hari ini") untuk SATU stasiun, tab Peta >
 *  Keseimbangan Air — company-wide (list semua stasiun sekaligus untuk
 *  `year`+`month` yang sama, lihat `ApiListResponse` di route-nya), BEDA
 *  dari `WaterBalance` (data SETAHUN per SATU stasiun via `stationId`,
 *  dipakai halaman Monitoring).
 *
 *  Field `curahHujan`/`defisitAir`/`hariHujan`/`kelebihanAir` sudah
 *  DI-PIVOT di sini dari bentuk asli endpoint (dikonfirmasi lewat Postman
 *  collection tim BE, folder "Maps" > "Water Deficit",
 *  `GET /devices/water_deficit?company_code=&year=&month=` — `year` &
 *  `month` WAJIB, ini snapshot 1 bulan tertentu, bukan otomatis "hari
 *  ini"): tiap device di `data[]` asli punya array
 *  `water_deficit: [{ component: "CURAH_HUJAN"|"DEFISIT_AIR"|
 *  "HARI_HUJAN"|"KELEBIHAN_AIR", value: string | null }]` — "tidak ada
 *  data" muncul 2 bentuk: array KOSONG (`[]`) ATAU array ADA tapi semua
 *  `value` null, keduanya harus di-treat sama (jadi `null` di sini).
 *  `stationId`/`nama`/`brand`/`lat`/`long`/`companyCode`/`companyName`
 *  sebenarnya SUDAH ikut menempel di tiap device response asli (endpoint
 *  ini independen, tidak perlu join manual ke `/devices/status`).
 *  `sinkronisasiTerakhir` di sini BUKAN nilai asli device (endpoint
 *  `water_deficit` TIDAK punya field `last_sync_time`) — DULU di-join ke
 *  `stationApi.getStations()` (`lib/api/water-deficit-client.ts`), TAPI
 *  join itu sudah dilepas, diganti waktu-request-sekarang
 *  (`new Date().toISOString()`) — sama pola & alasan persis
 *  `StationDrySpell` (mengurangi request bersamaan ke `/devices/status`,
 *  lihat `CLAUDE.md`). */
export interface StationWaterDeficit {
  stationId: string;
  nama: string;
  brand: string;
  lat: number;
  long: number;
  companyCode: string;
  companyName: string;
  curahHujan: number | null;
  defisitAir: number | null;
  hariHujan: number | null;
  kelebihanAir: number | null;
  sinkronisasiTerakhir: string | null;
}

/** Level kategori durasi deret hari tidak hujan untuk warna marker/legend
 *  Peta > Deret Terpanjang Hari Tidak Hujan — bukan field dari BE,
 *  threshold ikut label yang ditampilkan di Figma (<10/>10/>20 hari).
 *  TIDAK ADA level "tidak ada data" terpisah — array `dry_spell` kosong
 *  di-treat SAMA seperti `rendah` (dikonfirmasi dari dashboard Nusaklim
 *  produksi/ground truth: stasiun tanpa periode tercatat ditampilkan
 *  "< 10 hari", bukan "tidak ada data"). Lihat `lib/dry-spell-level.ts`. */
export type DrySpellLevel = "rendah" | "sedang" | "tinggi";

/** Snapshot SATU TAHUN (bukan 1 bulan) untuk SATU stasiun, tab Peta >
 *  Deret Terpanjang Hari Tidak Hujan — company-wide (list semua stasiun
 *  sekaligus untuk `year` yang sama). Dikonfirmasi user lewat contoh
 *  response `GET /devices/dry_spell?company_code=&year=` — response-nya
 *  dibungkus `{status, message, data}` SAMA seperti `/devices/water_deficit`
 *  (sempat salah diasumsikan "array mentah" dari contoh awal, sudah
 *  dikoreksi setelah dicek langsung ke backend asli). BEDA dari
 *  `/devices/water_deficit`: tiap device punya array `dry_spell:
 *  [{ device_id, duration, start_date, end_date }]` yang bisa berisi
 *  BANYAK periode kekeringan dalam setahun (bukan 1 angka per komponen
 *  seperti Water Deficit).
 *
 *  `durasiTerakhir`/`tanggalMulai`/`tanggalSelesai` di sini adalah hasil
 *  pilih entri dengan `end_date` PALING BARU dari array `dry_spell`
 *  tahun itu — BUKAN durasi terbesar (nama field awalnya
 *  `durasiTerpanjang`/"terbesar", tapi dikoreksi jadi "periode paling
 *  baru" setelah dibandingkan langsung ke dashboard Nusaklim produksi,
 *  ground truth-nya ternyata pilih periode PALING BARU, bukan yang
 *  paling panjang — meski nama tab "Deret TERPANJANG Hari Tidak Hujan"
 *  sendiri tidak diubah). Array kosong (`[]`) = tidak ada periode
 *  kekeringan tercatat tahun itu, di-treat sebagai `null` (bukan 0) —
 *  TAPI secara visual/kategori tetap masuk level `rendah` ("< 10 Hari"),
 *  lihat `getDrySpellLevel` di `lib/dry-spell-level.ts`.
 *  `stationId`/`nama`/`brand`/`lat`/`long`/`companyCode`/`companyName`
 *  menempel langsung di tiap device response asli (endpoint ini
 *  independen, TIDAK PERNAH join ke `/devices/status`). `sinkronisasiTerakhir`
 *  di sini BUKAN nilai asli device (endpoint `dry_spell` TIDAK punya
 *  field `last_sync_time`) — SENGAJA diisi waktu-request-sekarang oleh
 *  `mapRawDeviceToDrySpell` (`lib/api/adapters/dry-spell-adapter.ts`),
 *  bukan hasil join ke `stationApi.getStations()` (pola & alasan yang
 *  sama juga dipakai `StationWaterDeficit`). Keputusan sadar: field ini
 *  di UI cuma dipakai sebagai info sekunder di popup peta, dan join tadi
 *  menambah 1 request bersamaan ke `/devices/status` yang terbukti
 *  lambat kalau kena concurrency (lihat `CLAUDE.md`). */
export interface StationDrySpell {
  stationId: string;
  nama: string;
  brand: string;
  lat: number;
  long: number;
  companyCode: string;
  companyName: string;
  durasiTerakhir: number | null;
  tanggalMulai: string | null;
  tanggalSelesai: string | null;
  sinkronisasiTerakhir: string | null;
}

/** Level status hujan hari ini untuk warna marker/legend/chip Peta >
 *  Curah Hujan Hari Ini — BUKAN threshold turunan seperti
 *  `WaterDeficitLevel`/`DrySpellLevel`, BE sudah balikin status biner
 *  langsung lewat field `is_rain` (lihat `StationRainfallToday`). Lihat
 *  `lib/rainfall-today-level.ts`. */
export type RainfallTodayLevel = "hujan" | "tidak_hujan";

/** Snapshot HARI INI (tanpa param tanggal/year/month sama sekali) untuk
 *  SATU stasiun, tab Peta > Curah Hujan Hari Ini — company-wide (list
 *  semua stasiun sekaligus). Dikonfirmasi lewat tes langsung ke endpoint
 *  asli `GET /devices/rainfall_today?company_code=` — response dibungkus
 *  `{status, message, data}` SAMA seperti `/devices/water_deficit` &
 *  `/devices/dry_spell`, TAPI beda dari keduanya: TIDAK ada param
 *  tanggal/year/month sama sekali (endpoint ini otomatis "hari ini" di
 *  sisi BE).
 *
 *  `curahHujan` di sini di-parse dari field mentah `rainfall` (STRING,
 *  bukan number) — salah satu device (brand "Meteo Nusantara
 *  Instrumen"/ARR) pernah balikin literal `"---"` sebagai sentinel
 *  "tidak ada data" (dikonfirmasi dari response asli), `Number("---")`
 *  jadi `NaN` sehingga di-treat `null` oleh
 *  `parseRainfallValue()` (`lib/api/adapters/rainfall-today-adapter.ts`).
 *  `isHujan` diambil APA ADANYA dari field `is_rain` — BE yang menentukan
 *  status hujan/tidak, BUKAN turunan threshold dari `curahHujan` seperti
 *  `getWaterDeficitLevel`/`getDrySpellLevel`.
 *
 *  `stationId`/`nama`/`brand`/`lat`/`long`/`companyCode`/`companyName`
 *  menempel langsung di tiap device response asli (endpoint ini
 *  independen, TIDAK PERNAH join ke `/devices/status`). `sinkronisasiTerakhir`
 *  BUKAN nilai asli device (endpoint `rainfall_today` TIDAK punya field
 *  `last_sync_time`) — SENGAJA diisi waktu-request-sekarang, pola &
 *  alasan yang sama persis `StationDrySpell`/`StationWaterDeficit`
 *  (menghindari 1 request bersamaan tambahan ke `/devices/status`, lihat
 *  `CLAUDE.md`). */
export interface StationRainfallToday {
  stationId: string;
  nama: string;
  brand: string;
  lat: number;
  long: number;
  companyCode: string;
  companyName: string;
  curahHujan: number | null;
  isHujan: boolean;
  sinkronisasiTerakhir: string | null;
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
