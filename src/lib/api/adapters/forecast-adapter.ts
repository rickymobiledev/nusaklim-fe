import type { ForecastDay, ForecastResult } from "@/types/forecast";

/** Bentuk mentah `POST /forecast` (body form `station_id`), dikonfirmasi
 *  lewat curl langsung ke backend asli — dibungkus `{status, data}`
 *  (`message` cuma muncul saat error, TIDAK selalu ada). Field angin/
 *  tekanan snake_case (`air_pressure`/`wind_speed`/`wind_direction`),
 *  field lain kebetulan sudah sama nama dengan `ForecastDay`. `units`
 *  KADANG tidak ada sama sekali di response — jangan asumsikan selalu
 *  ada (lihat catatan di `forecast-api.ts`). */
export interface RawForecastDay {
  date: string;
  temperature: number;
  humidity: number;
  radiation: number;
  rainfall: number;
  air_pressure: number;
  wind_speed: number;
  wind_direction: number;
}

export interface RawForecastResult {
  station_id: string;
  station_name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  forecast: RawForecastDay[];
  units?: Record<string, string>;
}

export interface RawForecastResponse {
  status: boolean;
  message?: string;
  data: RawForecastResult;
}

function mapRawForecastDay(raw: RawForecastDay): ForecastDay {
  return {
    date: raw.date,
    temperature: raw.temperature,
    humidity: raw.humidity,
    radiation: raw.radiation,
    rainfall: raw.rainfall,
    airPressure: raw.air_pressure,
    windSpeed: raw.wind_speed,
    windDirectionDeg: raw.wind_direction,
  };
}

export function mapRawForecastResult(raw: RawForecastResult): ForecastResult {
  const rawUnits = raw.units ?? {};
  const units: Record<string, string> = {};
  if (rawUnits.temperature) units.temperature = rawUnits.temperature;
  if (rawUnits.humidity) units.humidity = rawUnits.humidity;
  if (rawUnits.radiation) units.radiation = rawUnits.radiation;
  if (rawUnits.rainfall) units.rainfall = rawUnits.rainfall;
  if (rawUnits.air_pressure) units.airPressure = rawUnits.air_pressure;
  if (rawUnits.wind_speed) units.windSpeed = rawUnits.wind_speed;

  return {
    stationId: raw.station_id,
    stationName: raw.station_name,
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone,
    forecast: raw.forecast.map(mapRawForecastDay),
    units,
  };
}
