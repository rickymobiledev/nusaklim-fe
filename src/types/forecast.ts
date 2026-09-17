/** Windows arah angin disimpan sebagai derajat mentah — konversi ke teks
 *  arah mata angin (lib/utils degreesToCompass) dilakukan di layer
 *  tampilan, bukan disimpan sebagai teks di sini. */
export interface ForecastDay {
  date: string;
  temperature: number;
  humidity: number;
  radiation: number;
  rainfall: number;
  airPressure: number;
  windSpeed: number;
  windDirectionDeg: number;
}

export interface ForecastResult {
  stationId: string;
  stationName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  forecast: ForecastDay[];
  units: Record<string, string>;
}
