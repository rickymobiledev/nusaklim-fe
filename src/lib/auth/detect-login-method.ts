import type { LoginMethod } from "@/types/auth";

/** NIK SAP = semua digit, Email = ada "@", selain itu dianggap Username. */
export function detectLoginMethod(identifier: string): LoginMethod {
  const trimmed = identifier.trim();
  if (trimmed.includes("@")) return "email";
  if (/^\d+$/.test(trimmed)) return "nik_sap";
  return "username";
}
