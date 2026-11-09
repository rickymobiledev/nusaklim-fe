import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { isAccessTokenExpired, sessionCookie } from "@/auth.config";

/**
 * SERVER-ONLY. Mengembalikan header `Authorization` (`Bearer <access_token>`)
 * dari token backend yang disimpan di JWT sesi Auth.js (lihat `auth.ts`),
 * atau `null` kalau tidak ada sesi / token sudah expired / dipanggil di luar
 * request scope (mis. saat build).
 *
 * Sengaja baca langsung dari cookie JWT (bukan `auth()`), karena access token
 * backend TIDAK dimasukkan ke objek session supaya tidak bocor ke client
 * lewat `/api/auth/session`.
 */
export async function getBackendAuthorization(): Promise<string | null> {
  let reqHeaders: Headers;
  try {
    reqHeaders = await headers();
  } catch {
    return null;
  }

  const token = await getToken({
    req: { headers: reqHeaders },
    secret: process.env.AUTH_SECRET,
    cookieName: sessionCookie.name,
    salt: sessionCookie.name,
    secureCookie: sessionCookie.options.secure,
  });

  const accessToken = token?.accessToken;
  if (typeof accessToken !== "string" || !accessToken) return null;
  if (isAccessTokenExpired(token?.accessTokenExpiresAt)) return null;

  const tokenType = typeof token?.tokenType === "string" ? token.tokenType : "Bearer";
  return `${tokenType} ${accessToken}`;
}
