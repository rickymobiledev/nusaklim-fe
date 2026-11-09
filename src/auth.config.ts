import type { NextAuthConfig } from "next-auth";

/**
 * Konfigurasi yang "edge-safe" — dipisah dari `auth.ts` karena file ini juga
 * di-import oleh `middleware.ts` yang berjalan di Edge Runtime. Jangan taruh
 * provider yang butuh Node.js API (bcrypt, driver DB, dll) di sini.
 */
/** Durasi sesi saat "Ingat Saya" dicentang — lihat `app/api/auth/remember-me/route.ts`
 *  yang menulis ulang cookie ini tanpa `maxAge` (jadi session cookie) kalau tidak dicentang. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 hari

export const sessionCookie = {
  name: "nusaklim.session-token",
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  },
};

/** `true` kalau access token backend sudah lewat `expires_at`. Token tanpa
 *  `expires_at` (sesi lama sebelum field ini ada) dianggap belum expired. */
export function isAccessTokenExpired(expiresAt: unknown): boolean {
  if (typeof expiresAt !== "string" || !expiresAt) return false;
  const ts = Date.parse(expiresAt);
  return !Number.isNaN(ts) && ts <= Date.now();
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  cookies: {
    sessionToken: sessionCookie,
  },
  callbacks: {
    // Sesi ikut mati saat access token backend expired — return null
    // membuat Auth.js menghapus cookie sesi (berlaku juga di proxy).
    jwt({ token }) {
      return isAccessTokenExpired(token.accessTokenExpiresAt) ? null : token;
    },
    // Dipanggil oleh middleware untuk memutuskan apakah request boleh lanjut.
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      // Halaman auth publik (belum ada sesi): login & lupa password.
      const isOnLogin =
        pathname.startsWith("/login") || pathname.startsWith("/forgot-password");

      if (isOnLogin) {
        // Sudah login tapi buka /login -> lempar ke dashboard.
        return isLoggedIn ? Response.redirect(new URL("/", request.nextUrl)) : true;
      }

      // Semua route lain wajib login. Redirect manual ke /login (tanpa
      // `?callbackUrl=`) — kalau return false, NextAuth menambahkannya otomatis.
      return isLoggedIn || Response.redirect(new URL("/login", request.nextUrl));
    },
  },
  providers: [], // provider sesungguhnya didaftarkan di auth.ts
};
