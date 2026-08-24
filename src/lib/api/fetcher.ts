import axios, { type AxiosInstance } from "axios";
import { API_V2_URL } from "@/constants";

/**
 * Membuat instance axios yang otomatis menyisipkan `company_code` sebagai
 * query param di tiap request (dipakai backend Nusaklim untuk membatasi
 * data per-perusahaan/multi-tenant — dikonfirmasi dari Postman collection).
 *
 * SERVER-ONLY — WAJIB hanya dipanggil dari Route Handler di bawah
 * `app/api/**` (lihat CLAUDE.md "Batas arsitektur data"), TIDAK PERNAH
 * dari `"use client"` hook/komponen. Ini yang membuat `API_BASE_URL` dan
 * `API_KEY` (server-only, tidak diprefix `NEXT_PUBLIC_`, lihat
 * .env.example) aman — keduanya tidak pernah ke-bundle ke browser.
 *
 * `baseURL` pakai `API_V2_URL` (`constants/index.ts`, = `API_BASE_URL +
 * "/api/v2"`) — SATU-SATUNYA tempat prefix "/api/v2" ditentukan, dipakai
 * bareng oleh `src/auth.ts` (login). Jangan concat "/api/v2" manual di
 * tempat lain.
 *
 * Belum benar-benar dipakai (`lib/api/index.ts` masih 100% mock — belum
 * ada `real/*` implementation, menunggu akses BE sungguhan), tapi begitu
 * dibuat, header `api-key` di bawah sudah siap (dikonfirmasi wajib lewat
 * Postman collection — auth level collection, bukan cuma opsional).
 */
export function createApiClient(companyCode?: string): AxiosInstance {
  const instance = axios.create({
    baseURL: API_V2_URL,
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.API_KEY ?? "",
    },
  });

  if (companyCode) {
    instance.interceptors.request.use((config) => {
      config.params = { ...config.params, company_code: companyCode };
      return config;
    });
  }

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Taruh error handling terpusat di sini: logging, dsb. Karena instance
      // ini sekarang cuma jalan di server (Route Handler), tidak ada lagi
      // redirect ke /login di sini — Route Handler pemanggil yang
      // memutuskan status code apa yang dibalikin ke client (lihat contoh
      // di app/api/stations/route.ts).
      return Promise.reject(error);
    },
  );

  return instance;
}

/** Instance tanpa company_code — dipakai untuk endpoint publik (misal login). */
export const publicApi = createApiClient();
