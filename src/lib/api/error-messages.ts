import { ApiError } from "@/types/api";

const ERROR_MESSAGES: Record<string, string> = {
  STATION_NOT_FOUND: "Stasiun tidak ditemukan.",
  STATION_INACTIVE: "Stasiun sedang tidak aktif, data tidak tersedia.",
  STATION_FETCH_FAILED: "Gagal mengambil data stasiun dari server.",
  NETWORK_ERROR: "Gagal terhubung ke server. Periksa koneksi internet.",
};

/** Satu tempat mapping ApiError.code -> pesan yang user-friendly. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return ERROR_MESSAGES[error.code] ?? error.message;
  }
  return "Terjadi kesalahan yang tidak diketahui.";
}
