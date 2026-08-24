import type { WeatherMetric, WeatherMetricRange } from "@/types/domain";

/**
 * `GET /weathers/latest?device_id=` mengembalikan bentuk BEDA TOTAL
 * tergantung brand device (dikonfirmasi dari Postman "Nusaklim"):
 * - Davis Instruments: field paling lengkap, SEMUA nilai berupa string.
 * - Meteo Nusantara Instrumen: cuma `{ rainfall, voltage }`, tidak ada
 *   temperature/humidity/radiation/wind sama sekali.
 * - Merapi Tani Instrumen: `air_temperature`/`air_humidity` (bukan
 *   temperature/humidity), nilai berupa number asli (bukan string).
 *
 * Satu fungsi normalizer per brand di sini — semuanya WAJIB balikin
 * `WeatherMetric` yang sama (field yang tidak tersedia dari brand
 * tertentu jadi `null`, bukan dihilangkan dari tipe). Komponen UI
 * (MetricCard dkk) HANYA boleh menerima hasil yang sudah dinormalisasi ini,
 * tidak pernah bentuk mentah per-brand.
 */

const EMPTY_RANGE: WeatherMetricRange = {
  nilai: null,
  min: null,
  maks: null,
  satuan: "",
};

function toRange(rawValue: unknown, satuan: string): WeatherMetricRange {
  const nilai = typeof rawValue === "number" ? rawValue : parseFloat(String(rawValue));
  return { nilai: Number.isFinite(nilai) ? nilai : null, min: null, maks: null, satuan };
}

export function mapDavisInstruments(
  raw: Record<string, unknown>,
  stationId: string,
): WeatherMetric {
  return {
    stationId,
    diperbaruiPada: typeof raw.datetime === "string" ? raw.datetime : null,
    temperaturUdara: toRange(raw.temperature, "°C"),
    radiasiMatahari: toRange(raw.radiation, "MJ/m²"),
    kelembabanUdara: toRange(raw.humidity, "%"),
    curahHujan: toRange(raw.rainfall, "mm"),
    tekananUdara: toRange(raw.air_pressure, "hPa"),
    kecepatanAngin: toRange(raw.wind_speed, "m/s"),
  };
}

export function mapMeteoNusantara(
  raw: Record<string, unknown>,
  stationId: string,
): WeatherMetric {
  return {
    stationId,
    diperbaruiPada: typeof raw.datetime === "string" ? raw.datetime : null,
    temperaturUdara: EMPTY_RANGE,
    radiasiMatahari: EMPTY_RANGE,
    kelembabanUdara: EMPTY_RANGE,
    curahHujan: toRange(raw.rainfall, "mm"),
    tekananUdara: EMPTY_RANGE,
    kecepatanAngin: EMPTY_RANGE,
  };
}

export function mapMerapiTani(
  raw: Record<string, unknown>,
  stationId: string,
): WeatherMetric {
  return {
    stationId,
    diperbaruiPada: typeof raw.datetime === "string" ? raw.datetime : null,
    temperaturUdara: toRange(raw.air_temperature, "°C"),
    radiasiMatahari: EMPTY_RANGE,
    kelembabanUdara: toRange(raw.air_humidity, "%"),
    curahHujan: toRange(raw.rainfall, "mm"),
    tekananUdara: EMPTY_RANGE,
    kecepatanAngin: EMPTY_RANGE,
  };
}

type BrandAdapter = (raw: Record<string, unknown>, stationId: string) => WeatherMetric;

const ADAPTERS_BY_BRAND: Record<string, BrandAdapter> = {
  "Davis Instruments": mapDavisInstruments,
  "Meteo Nusantara Instrumen": mapMeteoNusantara,
  "Merapi Tani Instrumen": mapMerapiTani,
};

/** Pilih adapter berdasarkan `Station.brand`. Brand yang belum dikenal
 *  balikin semua field `null` (bukan throw) supaya UI tetap render "--". */
export function normalizeWeatherByBrand(
  brand: string,
  raw: Record<string, unknown>,
  stationId: string,
): WeatherMetric {
  const adapter = ADAPTERS_BY_BRAND[brand];
  if (!adapter) {
    return {
      stationId,
      diperbaruiPada: null,
      temperaturUdara: EMPTY_RANGE,
      radiasiMatahari: EMPTY_RANGE,
      kelembabanUdara: EMPTY_RANGE,
      curahHujan: EMPTY_RANGE,
      tekananUdara: EMPTY_RANGE,
      kecepatanAngin: EMPTY_RANGE,
    };
  }
  return adapter(raw, stationId);
}
