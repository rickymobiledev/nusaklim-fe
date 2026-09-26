import type { StationFields } from "@/types/user-management";
import { STATION_BRANDS } from "@/constants";

/** Validasi field stasiun (tanpa id); balikin input bersih atau `null`. */
export function parseStationBody(
  body: Partial<Record<keyof StationFields, unknown>>,
): StationFields | null {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const companyCode = typeof body.companyCode === "string" ? body.companyCode.trim() : "";
  const brand = typeof body.brand === "string" ? body.brand.trim() : "";
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);

  const valid =
    name &&
    companyCode &&
    (STATION_BRANDS as readonly string[]).includes(brand) &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180;

  return valid ? { name, companyCode, brand, latitude, longitude } : null;
}

/** ID stasiun dari body POST: wajib, tanpa `/` (dipakai di path `[id]`). */
export function parseStationId(raw: unknown): string | null {
  const id = typeof raw === "string" ? raw.trim() : "";
  return id && !id.includes("/") ? id : null;
}

export const INVALID_STATION_INPUT = {
  code: "STATION_INVALID_INPUT",
  message: "Data stasiun tidak valid.",
};
