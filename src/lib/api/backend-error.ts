import { isAxiosError } from "axios";

/** Ekstrak pesan error APA ADANYA dari body response BE, kalau BE
 *  sempat balas (HTTP non-2xx, axios throw) — dikonfirmasi lewat tes
 *  curl langsung ke backend asli, bentuknya TIDAK konsisten antar
 *  skenario: `{status:false, message:"No such vpd found."}` (404,
 *  device_id salah) TAPI `{status:false, error:"Invalid API key "}`
 *  (403, api-key salah) — field beda (`message` vs `error`), makanya
 *  dicek dua-duanya. Sebagian request gagal (mis. param tanggal wajib
 *  dihilangkan) balikin 500 body KOSONG (`Content-Length: 0`, bukan
 *  JSON sama sekali) — kasus itu balikin `undefined`, biar caller
 *  fallback ke teks generik sendiri (BE memang tidak sempat bicara
 *  apa-apa, generik itu SAH di sini, bukan disembunyikan). */
export function extractBackendErrorMessage(err: unknown): string | undefined {
  if (!isAxiosError(err)) return undefined;

  const data: unknown = err.response?.data;
  if (!data || typeof data !== "object") return undefined;

  const record = data as Record<string, unknown>;
  const message = record.message ?? record.error;
  return typeof message === "string" && message.trim() ? message : undefined;
}
