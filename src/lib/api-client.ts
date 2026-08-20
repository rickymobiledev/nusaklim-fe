import axios, { type AxiosInstance } from "axios";
import { API_BASE_URL } from "./constants";

/**
 * Membuat instance axios yang sudah dilengkapi Authorization header.
 *
 * Dipakai di 2 tempat:
 *  1. Client Components — lewat hook `useApiClient()` (src/hooks/use-api-client.ts),
 *     token diambil dari `useSession()`.
 *  2. Server Components / Route Handlers — lewat `getServerApiClient()` di bawah,
 *     token diambil langsung dari `auth()` tanpa pernah menyentuh browser.
 *
 * Kalau tim BE lebih suka pola "session cookie" (bukan Bearer JWT), cukup ubah
 * bagian header di sini — bagian lain (hooks, fetchers) tidak perlu berubah.
 */
export function createApiClient(accessToken?: string): AxiosInstance {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (accessToken) {
    instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Taruh error handling terpusat di sini: toast, logging, redirect ke /login
      // kalau 401, dsb. Contoh minimal:
      if (typeof window !== "undefined" && error?.response?.status === 401) {
        // Sesi kadaluarsa. Sengaja pakai hard redirect (bukan next/navigation)
        // supaya semua state client (React Query cache, Zustand store, dll)
        // ikut ter-reset bersih saat reload — bukan navigasi SPA biasa.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

/** Instance tanpa token — dipakai untuk endpoint publik (misal login). */
export const publicApi = createApiClient();
