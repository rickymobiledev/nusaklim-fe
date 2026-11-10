import type { JWT } from "next-auth/jwt";

/**
 * Cek apakah access token backend masih aktif (belum di-revoke lewat
 * `/authentications/logout`) — perbaikan VA-06. Backend belum punya endpoint
 * khusus (mis. `/authentications/me`), jadi SEMENTARA memakai `GET /users`
 * sebagai "probe": yang dilihat HANYA status HTTP-nya, body diabaikan.
 *
 *   401           -> token mati (revoked/expired) -> sesi ditolak
 *   200/403/lain  -> token masih diterima backend (403 = role tidak berhak
 *                    ke /users, tapi tokennya valid)
 *   network error -> dianggap aktif (fail-open) supaya gangguan backend
 *                    tidak me-logout semua user; endpoint data tetap
 *                    menolak token mati di sisi backend.
 *
 * Ganti URL probe ke `/authentications/me` begitu backend menyediakannya.
 *
 * Sengaja TIDAK meng-import `@/constants` (ikut meng-import komponen React)
 * karena file ini dipakai `auth.config.ts` yang juga dimuat proxy.
 */
const PROBE_URL = `${process.env.API_BASE_URL ?? "http://localhost:8000"}/api/v2/users`;

/** Hasil "aktif" di-cache sebentar per token supaya tidak tiap request
 *  memanggil backend. Jendela ini = jeda maksimum token salinan masih
 *  diterima setelah logout di instance lain. */
const ACTIVE_CACHE_TTL_MS = 10_000;
/** Batas waktu probe — lewat dari ini dianggap gangguan backend (fail-open). */
const PROBE_TIMEOUT_MS = 3_000;
const MAX_CACHE_ENTRIES = 1_000;
const activeUntil = new Map<string, number>();

/** Dipanggil saat logout supaya token langsung ditolak di instance ini. */
export function forgetProbedToken(accessToken: unknown) {
  if (typeof accessToken === "string") activeUntil.delete(accessToken);
}

async function isBackendTokenActive(authorization: string, accessToken: string) {
  const now = Date.now();
  const cached = activeUntil.get(accessToken);
  if (cached && cached > now) return true;

  let status: number;
  const startedAt = Date.now();
  try {
    const res = await fetch(PROBE_URL, {
      method: "GET",
      headers: {
        "api-key": process.env.API_KEY ?? "",
        Authorization: authorization,
        Accept: "application/json",
      },
      cache: "no-store",
      // Probe tidak boleh menahan /api/auth/session (login & tiap halaman).
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    status = res.status;
    // Body tidak dipakai — buang tanpa ditunggu (jangan `await`, bisa menggantung).
    void res.body?.cancel().catch(() => {});
  } catch (err) {
    console.error(
      `[auth] probe sesi gagal setelah ${Date.now() - startedAt}ms (fail-open):`,
      err,
    );
    // Cache juga hasil fail-open supaya tiap navigasi tidak ikut tertahan
    // PROBE_TIMEOUT_MS selama backend lambat.
    activeUntil.set(accessToken, Date.now() + ACTIVE_CACHE_TTL_MS);
    return true;
  }

  if (status === 401) {
    activeUntil.delete(accessToken);
    return false;
  }

  if (activeUntil.size >= MAX_CACHE_ENTRIES) {
    for (const [key, until] of activeUntil) {
      if (until <= now) activeUntil.delete(key);
    }
    if (activeUntil.size >= MAX_CACHE_ENTRIES) activeUntil.clear();
  }
  activeUntil.set(accessToken, now + ACTIVE_CACHE_TTL_MS);
  return true;
}

/** `true` kalau access token backend sudah lewat `expires_at`. */
export function isAccessTokenExpired(expiresAt: unknown): boolean {
  if (typeof expiresAt !== "string" || !expiresAt) return false;
  const ts = Date.parse(expiresAt);
  return !Number.isNaN(ts) && ts <= Date.now();
}

/**
 * Batas umur sesi (VA-04), ditegakkan di server — bukan lewat umur cookie.
 * `absolute` dihitung dari waktu login, `idle` dari aktivitas terakhir.
 * `expires_at` dari backend tetap jadi batas atas tambahan.
 */
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
export const SESSION_LIMITS = {
  /** "Ingat Saya" dicentang. */
  remembered: { absoluteMs: 30 * DAY, idleMs: 7 * DAY },
  /** "Ingat Saya" tidak dicentang. */
  standard: { absoluteMs: 12 * HOUR, idleMs: 30 * MINUTE },
} as const;

/** `true` kalau sesi sudah lewat batas absolut atau idle. */
export function isSessionTimedOut(token: JWT, now = Date.now()): boolean {
  const { authTime, lastActivity } = token;
  // Sesi tanpa klaim waktu (dibuat sebelum aturan ini ada) -> paksa login ulang.
  if (typeof authTime !== "number" || typeof lastActivity !== "number") return true;
  const limits = token.rememberMe ? SESSION_LIMITS.remembered : SESSION_LIMITS.standard;
  return now - authTime > limits.absoluteMs || now - lastActivity > limits.idleMs;
}

/**
 * Dipakai di callback `jwt` (auth.config.ts & auth.ts). Return `null`
 * membuat Auth.js menganggap sesi habis dan menghapus cookie-nya — berlaku
 * untuk proxy (halaman), `auth()` di Route Handler, dan `/api/auth/session`.
 * Kalau masih valid, `lastActivity` diperbarui (tersimpan ke cookie saat
 * Auth.js menulis ulang sesi: navigasi halaman lewat proxy & `/api/auth/session`).
 */
export async function validateSessionToken(token: JWT): Promise<JWT | null> {
  const accessToken = token.accessToken;
  // Sesi lama (sebelum backend mengeluarkan access token) tidak bisa
  // di-revoke -> paksa login ulang.
  if (typeof accessToken !== "string" || !accessToken) return null;
  if (isAccessTokenExpired(token.accessTokenExpiresAt)) return null;

  const now = Date.now();
  if (isSessionTimedOut(token, now)) return null;

  const authorization = `${token.tokenType ?? "Bearer"} ${accessToken}`;
  if (!(await isBackendTokenActive(authorization, accessToken))) return null;

  token.lastActivity = now;
  return token;
}
