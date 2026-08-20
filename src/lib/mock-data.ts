import type {
  DeretHariTidakHujan,
  ForecastRow,
  KeseimbanganAir,
  LamaPenyinaran,
  Station,
  StationSummary,
  VpdIndex,
  WeatherSnapshot,
} from "@/types/domain";

/**
 * Data contoh, dipetakan dari tampilan existing app (lihat screenshot yang
 * dilampirkan). Dipakai supaya tim frontend bisa membangun UI tanpa menunggu
 * API backend siap — set NEXT_PUBLIC_USE_MOCK=true di .env.local untuk
 * mengaktifkan.
 */

export const MOCK_STATIONS: Station[] = [
  {
    id: "st-1",
    nama: "PPKS Bukit Sentang",
    lokasi: "Bukit Sentang",
    provinsi: "Sumatera Selatan",
    latitude: -3.05,
    longitude: 104.7,
    status: "aktif",
    sinkronisasiTerakhir: "2026-08-19T06:00:00Z",
  },
  {
    id: "st-2",
    nama: "PPKS Jawa Timur",
    lokasi: "Jawa Timur",
    provinsi: "Jawa Timur",
    latitude: -7.9,
    longitude: 112.6,
    status: "tidak_aktif",
    sinkronisasiTerakhir: null,
  },
];

export const MOCK_STATION_SUMMARY: StationSummary = {
  totalStasiun: 5,
  stasiunAktif: 4,
  stasiunTidakAktif: 1,
};

export const MOCK_WEATHER_SNAPSHOT: WeatherSnapshot = {
  stasiunId: "st-1",
  diperbaruiPada: null,
  temperaturUdara: { nilai: null, min: null, maks: null, satuan: "°C" },
  radiasiMatahari: { nilai: null, min: null, maks: null, satuan: "MJ/m²" },
  kelembabanUdara: { nilai: null, min: null, maks: null, satuan: "%" },
  curahHujan: { nilai: null, min: null, maks: null, satuan: "mm" },
  tekananUdara: { nilai: null, min: null, maks: null, satuan: "hPa" },
  kecepatanAngin: { nilai: null, min: null, maks: null, satuan: "m/s" },
};

export const MOCK_KESEIMBANGAN_AIR: KeseimbanganAir = {
  curahHujan: null,
  defisitAir: null,
  hariHujan: null,
  kelebihanAir: null,
  periode: "Juli 2026",
};

export const MOCK_DERET_HARI_TIDAK_HUJAN: DeretHariTidakHujan = {
  tanggalMulai: null,
  durasiHari: null,
};

export const MOCK_LAMA_PENYINARAN: LamaPenyinaran = {
  batasBawahJam: null,
  batasAtasJam: null,
};

export const MOCK_VPD: VpdIndex = { nilai: null, kategori: null };

export const MOCK_FORECAST_ROWS: ForecastRow[] = [
  { tanggal: "2026-08-19", temperaturUdara: 26.8, kelembabanUdara: 88, curahHujan: 1.9, radiasiMatahari: 22.74, tekananUdara: 1010, kecepatanAngin: 0.87, arahMataAngin: "Barat Daya" },
  { tanggal: "2026-08-20", temperaturUdara: 27.3, kelembabanUdara: 84, curahHujan: 0.1, radiasiMatahari: 20.11, tekananUdara: 1009.9, kecepatanAngin: 1.1, arahMataAngin: "Selatan" },
  { tanggal: "2026-08-21", temperaturUdara: 27.7, kelembabanUdara: 83, curahHujan: 0, radiasiMatahari: 21.43, tekananUdara: 1009.1, kecepatanAngin: 1.23, arahMataAngin: "Selatan" },
  { tanggal: "2026-08-22", temperaturUdara: 27.7, kelembabanUdara: 86, curahHujan: 2.5, radiasiMatahari: 22.9, tekananUdara: 1009.2, kecepatanAngin: 1.33, arahMataAngin: "Barat" },
  { tanggal: "2026-08-23", temperaturUdara: 26.7, kelembabanUdara: 89, curahHujan: 3.2, radiasiMatahari: 22.78, tekananUdara: 1009.8, kecepatanAngin: 1.24, arahMataAngin: "Selatan" },
  { tanggal: "2026-08-24", temperaturUdara: 25.7, kelembabanUdara: 92, curahHujan: 4.7, radiasiMatahari: 19.68, tekananUdara: 1010, kecepatanAngin: 1.18, arahMataAngin: "Barat Daya" },
  { tanggal: "2026-08-25", temperaturUdara: 25.9, kelembabanUdara: 90, curahHujan: 3, radiasiMatahari: 20.77, tekananUdara: 1009.7, kecepatanAngin: 1.08, arahMataAngin: "Barat Daya" },
];

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
